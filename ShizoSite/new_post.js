function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function new_post()
{
  const data = {
    usr: getCookie('login'),
    hed: document.getElementById("header_input").value,
    txt: document.getElementById("text_input").value,
    cod: document.getElementById("code_input").value,
    img: document.getElementById("img_input").value,
    vid: document.getElementById("vid_input").value,
    ytb: document.getElementById("yt_input").value
  };
  //console.log(data);

  const res = await fetch('/new_post', {method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },});
  
  
  const res_json = await res.json();
  console.log(res_json);
  if (res_json['message'] == 'FAIL') {
    alert('Возникла ошибка!\nПроверьте наличие заголовка, и хоть одной НЕ пустой формы.');
  } else if (res_json['message'] == 'SUCCES'){
    console.log(res_json);
    window.location = '/';
  }
}