let current_user;

async function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function quit()
{
  console.log("Quiting from acc");
  document.cookie = "login=''";
  window.location = '/';
}

async function get_cookies()
{
  const cookie = await getCookie('login');
  const user_header = await document.getElementById('user-name-header');
  const login_button = await document.getElementById("login");
  const new_button = await document.getElementById("new-post");
  const quit = await document.getElementById("quit");

  if ((cookie === "''") || 
  (cookie === undefined) ||
  ((cookie === ''))) {
    console.log('No cookies');
    const expire = new Date();
    expire.setHours(expire.getHours() + 8760); //1 year
    document.cookie = "login='';expires=" + expire.toUTCString() + ";";
    new_button.disabled = true;
    quit.style.display = 'none';
    login_button.style.display = 'inline';
  } else {

    console.log(cookie);
    current_user = cookie;
    
    user_header.style.display = 'block';
    user_header.textContent = cookie;

    new_button.disabled = false;
    quit.style.display = 'inline';
    login_button.style.display = 'none';
  }
}

function gen_div(where, name, layer = 0)
{
  const where_div = document.getElementsByClassName(where);
  const new_div = document.createElement("div");
  new_div.className = where + '--' + name;
  where_div[layer].appendChild(new_div);

  return new_div;
}

function gen_object(where, type, layer = 0)
{
  const where_div = document.getElementsByClassName(where);
  const new_div = document.createElement(type);
  try {
    where_div[layer].appendChild(new_div); 
  } catch(ex) {
    console.log(ex);
  } 
  finally {
    where_div[where_div.length - 1].appendChild(new_div); 
  }
  
  return new_div;
}

function gen_content(type, source, layer, invert)
{
  /*const content_box_container = document.getElementsByClassName("content_box_container");
  const content_box_container__item = document.createElement("div");
  content_box_container__item.className = 'content_box--item--' + type;
  content_box_container[layer].appendChild(content_box_container__item);*/

  const sliced_type = type.slice(0,3);

  let content_div = document.getElementsByClassName("content_box_container--item--" + sliced_type)[layer];

  if (!document.getElementsByClassName("content_box_container--item--" + sliced_type)[layer]) {
    content_div = gen_div("content_box_container--item", sliced_type, layer);
  }

  let content_obj = new Object;
  switch(sliced_type) {
    case 'num':
      content_obj = gen_object(content_div.className, 'tt', layer);
      content_obj.textContent = 'id: '+ source;      
      break;
    case 'hed':
      content_obj = gen_object(content_div.className, 'h2', layer);
      content_obj.textContent = source;
      break;
    case 'txt':
      content_obj = gen_object(content_div.className, 'p', layer);
      content_obj.textContent = source;
      break;  
    case 'cod':  
      content_obj = gen_object(content_div.className, 'code', layer);
      content_obj.textContent = source;
      break;
    case 'img':

      content_obj = gen_object(content_div.className, 'img', layer);
      if (source.slice(0,4) === 'http') {
        content_obj.src = source;
      } else {
        content_obj.src = './posts/' + invert + '/' + source;
      }
      break;
    case 'vid':
      content_obj = gen_object(content_div.className, 'video', layer);
      content_obj.setAttribute("controls","controls");
      content_obj.src = './posts/' + invert + '/' + source;      
      break;
    case 'ytb':
      content_obj = gen_object(content_div.className, 'iframe', layer);
      content_obj.src = source;  
      content_obj.setAttribute("frameborder", "0");
      content_obj.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      content_obj.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      content_obj.setAttribute("allowfullscreen", "allowfullscreen"); 
      break;
    case 'snd':
      content_obj = gen_object(content_div.className, 'audio', layer);
      content_obj.setAttribute("controls","controls");

      if (source.slice(0,4) === 'http') {
        content_obj.src = source;
      } else {
        content_obj.src = './posts/' + invert + '/' + source;
      }
      
      break;
    case 'foo':
      content_obj = gen_object(content_div.className, 'footer', layer);
      content_obj.textContent = source;
      break;
  }
}

async function load()
{
  const get_resp = await fetch('/posts.json');
  const json_text = await get_resp.json();

 // console.log(json_text);

  let json_data = [];

  json_text.forEach(text => {
    json_data.push(JSON.parse(text));
  });

  //console.log(json_data);

  for (let layer=0; layer<json_data.length; layer++) {
    let invert = Math.abs(layer - json_data.length + 1);
    gen_div('content_box_container', 'item');

    for (key in json_data[layer]) {
      gen_content(key, json_data[layer][key], layer, invert);
      //console.log(layer, key, json_data[layer][key]);
    }
  };
}

function isLandscape() {
  if (window.matchMedia("(orientation: landscape)").matches) {
    return true;
  } else if (window.matchMedia("(orientation: portrait)").matches) {
    return false;
  }
  return true;
}

function resize_css()
{

  const root = document.getElementsByClassName('root');
  if (!isLandscape()) {
    root[0].style.setProperty('--content_size', '100%');

    /*  --header_font_size: 18px;
        --code_font_size: 14px;
        --text_font_size: 16px; */
    root[0].style.setProperty('--header_font_size', '32px');
    root[0].style.setProperty('--code_font_size', '24px');
    root[0].style.setProperty('--text_font_size', '28px');
    root[0].style.setProperty('--backdrop_filter', 'none');

    root[0].style.setProperty('--background', 'rgba(41, 45, 52, 80%)');
    }
}