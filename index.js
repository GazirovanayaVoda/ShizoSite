const express = require("express");
const fs = require("fs");
const bodyParser = require('body-parser');

const port = 3000;

let post_count;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function get_json(path) {
  return fs.readFileSync(path.slice(0,-2), 'utf-8').split('\r\n').join('') + ' ';
}

app.get("/posts.json", function(request, response) {
  function get_posts(dir, files) {
    files = files || [];
    var allFiles = fs.readdirSync(dir);
    for (var i = allFiles.length-1; i>=0; i--){
        var name = dir + '/' + allFiles[i];
        if (fs.statSync(name).isDirectory()){
          get_posts(name, files);
        } else {
            if (name.slice(-4) === "json") {
              name += ' ' + dir.slice(-1);
              files.push(name);
            }   
        }
    }
    return files;
  };



  let res = [];
  const posts = get_posts('./public/posts');

  posts.forEach(post => {
    res.push(get_json(post));
  });
  
  post_count = res.length;
  console.log('Post count:', post_count);

  const json_str = JSON.stringify(res); 

  response.send(json_str);
  //console.log(res);
});

app.get("/", function(request, response){
  response.sendFile(__dirname + "/index.html");
})


//let urlEncodedParser = bodyParser.urlencoded({extended: false});
app.post('/check', (request, response) => {
  const {username, password} = request.body;

  console.log(request.body);

  const users_json = JSON.parse(get_json("./public/users/users.json  "));


  if (users_json[request.body["user_login"]] === undefined) {
    users_json[request.body["user_login"]] = request.body["user_password"];
    fs.writeFile('./public/users/users.json', JSON.stringify(users_json, null, 2), (err) => {
      if (err) throw err;
    });
  } else {
    if (request.body["user_password"] === users_json[request.body["user_login"]]) {
      //console.log(JSON.stringify(request.body["user_login"]), request.body["user_password"]);
      response.send(JSON.stringify({ message: request.body["user_login"] }));
    } else {
      //app.set('view engine', 'html');
      //app.engine('html', require('ejs').renderFile);
      response.send(JSON.stringify({ message: '' }));
    }
  }
});

app.post('/new_post', (request, response) => {
  const body = request.body;
  let res = {};
  console.log(post_count, 'Getting new post: ', request.body);

  function isEmpty(string) {
    return (string.replace(/\s+/g, '') === '');
  }

  if ((isEmpty(body["hed"])) || (isEmpty(body["usr"])) ||
     ((isEmpty(body["txt"])) && (isEmpty(body["img"])) && 
     (isEmpty(body["vid"])) && (isEmpty(body["ytb"])) &&
     (isEmpty(body["cod"]))) || 
     (post_count === undefined)) {
      console.log("Failed");
      response.send(JSON.stringify({ message: 'FAIL' }));
     }
  else {
    console.log("Validation checked!");

    res["num"] = post_count;
    res["foo"] = 'Автор: ' + body["usr"] + ' | Опубликовано: ' + new Date().toLocaleString();
    res["hed"] = body["hed"];

    if (!isEmpty(body["txt"])) {
      res["txt"] = body["txt"];
    }
    if (!isEmpty(body["cod"])) {
      res["cod"] = body["cod"];
    }  

    if (!isEmpty(body["img"])) {
      const img_content = body["img"].split("\n");
      for(let i=0; i<img_content.length; i++) {
        let name = 'img' + i;
        res[name] = img_content[i];
      }
    }    
    if (!isEmpty(body["vid"])) {
      const img_content = body["vid"].split("\n");
      for(let i=0; i<img_content.length; i++) {
        let name = 'vid' + i;
        res[name] = img_content[i];
      }
    }   
    if (!isEmpty(body["ytb"])) {
      const img_content = body["ytb"].split("\n");
      for(let i=0; i<img_content.length; i++) {
        let name = 'ytb' + i;

        if (img_content[i].search("embed") === -1) {
          var url = img_content[i];
          var id = url.split("?v=")[1]; //sGbxmsDFVnE
          id = id.split("&")[0];
          var embedlink = "http://www.youtube.com/embed/" + id;
        } else {
          embedlink = img_content[i];
        }

        res[name] = embedlink;
      }
    }  

    const json = JSON.stringify(res);
    console.log(json);

    const dir = './public/posts/'+post_count;
    try {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
      } catch {
        console.log('Error creating dir', dir);
        throw "fail";
      }
      
      try {
        fs.writeFileSync(dir+'/post.json', json);
      } catch {
        console.log('Error writting file', dir+'/post.json');
        throw "fail";
      }

    } catch {
      console.log("Failed");
      response.send(JSON.stringify({ message: 'FAIL' }));
    }

    console.log("SUCCES");
    response.send(JSON.stringify({ message: 'SUCCES' }));
  }
})

const ifaces = require('os').networkInterfaces();
const localhost = Object.keys(ifaces).reduce((host,ifname) => {
    let iface = ifaces[ifname].find(iface => !('IPv4' !== iface.family || iface.internal !== false));
    return iface? iface.address : host;
}, '127.0.0.1');
console.log(localhost + ':' + port);

app.listen(port, localhost);
