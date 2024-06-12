const http = require("http")
const fs = require("fs");


const port = 5500;

function get_posts(dir, files) {
  files = files || [];
  var allFiles = fs.readdirSync(dir);
  for (var i = 0; i<allFiles.length; i++){
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

function get_json(path) {
  return fs.readFileSync(path.slice(0,-2), 'utf-8').split('\r\n').join('') + ' ';
}


http.createServer(function(request, response) {
  console.log(`Запрошенный адрес: ${request.url}`);

  if (request.url == '/posts.json') {
    let res = [];
    const posts = get_posts('./posts');

    posts.forEach(post => {
      res.push(get_json(post));
    });
    
    response.end(JSON.stringify(res))
  }

  // получаем путь после слеша
  const filePath = request.url.substring(1);
  fs.readFile(filePath, function(error, data){
    if(error){     
      response.statusCode = 404;
      response.end("404 Resourse not found!\nTry go to index.html");
    }   
    else{
      response.end(data);
    }
  });
}).listen(port, '127.0.0.1', function() {
  console.log("Server Started at http://localhost:" + port);

  
});