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
  where_div[layer].appendChild(new_div); 
  
  return new_div;
}

function gen_content(type, source, layer)
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
      content_obj.src = './posts/' + layer + '/' + source;
      break;
    case 'vid':
      content_obj = gen_object(content_div.className, 'video', layer);
      content_obj.setAttribute("controls","controls");
      content_obj.src = './posts/' + layer + '/' + source;      
      break;
    case 'ytb':
      content_obj = gen_object(content_div.className, 'iframe', layer);
      content_obj.src = source;  
      content_obj.setAttribute("frameborder", "0");
      content_obj.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      content_obj.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      content_obj.setAttribute("allowfullscreen", "allowfullscreen"); 
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

    gen_div('content_box_container', 'item');

    for (key in json_data[layer]) {
      gen_content(key, json_data[layer][key], layer);
      //console.log(layer, key, json_data[layer][key]);
    }
  };
}