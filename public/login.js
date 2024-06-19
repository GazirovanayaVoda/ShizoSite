async function logint()
{
  const userlogin = document.getElementById("login_input").value;
  const userpassword = document.getElementById("password_input").value;

  const data = {
    user_login: userlogin,
    user_password: userpassword
  };

  const res = await fetch('/check', {method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },});

  const res_json = await res.json();
  console.log(userlogin, userpassword);
  console.log(res_json['message']);

  if (res_json['message'] != '') {
    const expire = new Date();
    expire.setHours(expire.getHours() + 8760); //1 year
    document.cookie = "login=" + res_json['message'] +";expires=" + expire.toUTCString() + ";";

    window.location = '/';
  } else {
    alert('Неверный пароль');
  }

}