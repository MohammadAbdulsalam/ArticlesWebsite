const http = require('http'); // The main server package
const fs = require('fs'); // The file system package, used to deal with files
var mysql = require('mysql');
var formidable = require('formidable');

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000; 

var mysqlConnection = mysql.createConnection({
  host: "sql7.freemysqlhosting.net",
  port: "3306",
  user: "sql7583536",
  password: "Ea2NPn5yD1",
  database: "sql7583536",
  multipleStatements: true,
});

const server = http.createServer((request, response) => {
  let url = request.url;

  if (url === "/") {
    mysqlConnection.query("SELECT * FROM article", (err, rows, fields) => {
      if (!err) {
        let res = `
          <!DOCTYPE html>
          <html>
            <head>
                <title>Articles</title>
                <style>
                  /* Start Variables */
                  :root {
                      --primary-color : #071e26;
                      --primary-color1 : #0a416b;
                      --secondry-color: rgb(0, 115, 222);
                      --duration: 0.5s;
                  }
                  /* End Variables */
                  /* Start Global Rules */
                  * {
                      -webkit-box-sizing: border-box;
                      -moz-box-sizing: border-box;
                      box-sizing: border-box;
                  }
                  html {
                      scroll-behavior: smooth;
                  }
                  body {
                      font-family: Arial, Helvetica, sans-serif ;
                      margin: 0;
                      padding: 0;
                      background-color: var(--primary-color);
                  }
                  a {
                      text-decoration: none;
                  }
                  .container {
                      padding-left: 15px;
                      padding-right: 15px;
                      margin-left: auto;
                      margin-right: auto;
                  }
                  /* Small */
                  @media (min-width: 768px) {
                      .container {
                          width: 750px;
                      }
                  }
                  /* Medium */
                  @media (min-width: 992px) {
                      .container {
                          width: 970px;
                      }
                  }
                  /* Large */
                  @media (min-width: 1200px) {
                      .container {
                          width: 1170px;
                      }
                  }
                  /* End Global Rules */
                  
                  /* Start Header */
                  header {
                      background-color: var(--primary-color);
                      width: 100%;
                  }
                  header .container {
                      display: flex;
                      justify-content: center;
                  }
                  header .container h1 {
                      color: var(--secondry-color);
                  }
                  /* End Header */
                  /* Start Section */
                  section {
                      background-image: url(pages/imgs/articles.jpg);
                      background-repeat: no-repeat;
                      background-size: cover;
                      background-position: center;
                      background-attachment: fixed;
                      position: relative;
                      z-index: 2;
                  }
                  section::before {
                      content: "";
                      background-color: rgb( 0 0 0 / 70%);
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: 100%;
                      z-index: -1;
                  }
                  section .container {
                      display: flex;
                      padding: 140px 0;
                      align-items: center;
                      flex-direction: column;
                  }
                  
                  section .container ul {
                      list-style: none;
                  }
                  section .container ul li {
                      padding: 20px;
                      text-align: center;
                      font-size: 20px;
                  }
                  section .container ul li:last-child {
                    margin-top: 50px;
                    border-top: 5px solid var(--secondry-color);
                  }
                  section .container ul li a {
                      border: 2px solid var(--primary-color1);
                      padding: 5px;
                      background-color:var(--secondry-color);
                  }
                  section .container div {
                      padding: 20px;
                      text-align: center;
                  }
                  section .container div a:first-child {
                      display: none;
                  }
                  section .container div a {
                      border: 2px solid var(--primary-color1);
                      padding: 5px;
                      background-color:var(--secondry-color);
                  }
                  /* End Section */
                  /* Start Footer */
                  footer {
                      background-color: var(--primary-color);
                      width: 100%;
                  }
                  footer .container {
                      display: flex;
                      padding: 5px 0;
                      justify-content: center;
                  }
                  footer .container a:first-child { 
                      display: none;
                  }
                  footer .container p {
                      color: var(--primary-color1);
                      font-weight: 700;
                  }
                  footer .container p span {
                      color: var(--secondry-color);
                      font-weight: 700;
                  
                  }
                  /* End Footer */
                </style>
            </head>
            <body>
              <header>
                <div class="container">
                    <h1>Articles</h1>
                </div>
              </header>
              <section>
                <div class="container">
                  <ul>
          `;
        for (var i = 0; i < rows.length; i++) {
          res +=
                    "<li><a href='/article/" +
                    rows[i].id +
                    "'>" + 
                    rows[i].title +
                    "</a></li>" 
        }
        res += `<li><a href='/add'>Add New Article</a></li></ul>
                </div>
              </section>
              <footer>
                <div class="container">
                    <p>Made With &lt;3 By <span>MohammadAbdulsalam</span> </p>
                </div>
              </footer>
            </body>
          </html>`;
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.end(res);
      } else {
        console.log(err);
      }
    });
  }else if(url.startsWith("/article/")) {
    let split_url = url.split("/")
    let user_id = split_url[split_url.length - 1]
    console.log(user_id);
    let sql = "SELECT * FROM article WHERE id = ?"
    mysqlConnection.query(sql,user_id, (err, rows, fields) => {
      if (!err) {
        let res = `
          <!DOCTYPE html>
          <html>
            <head>
                <title>Article Info</title>
                <style>
                  /* Start Variables */
                  :root {
                      --primary-color: #071e26;
                      --primary-color1: #0a416b;
                      --secondry-color: rgb(0, 115, 222);
                      --duration: 0.5s;
                  }
                  
                  /* End Variables */
                  /* Start Global Rules */
                  * {
                      -webkit-box-sizing: border-box;
                      -moz-box-sizing: border-box;
                      box-sizing: border-box;
                  }
                  
                  html {
                      scroll-behavior: smooth;
                  }
                  
                  body {
                      font-family: Arial, Helvetica, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: var(--primary-color);
                  }
                  
                  a {
                      text-decoration: none;
                  }
                  
                  .container {
                      padding-left: 15px;
                      padding-right: 15px;
                      margin-left: auto;
                      margin-right: auto;
                  }
                  
                  /* Small */
                  @media (min-width: 768px) {
                      .container {
                          width: 750px;
                      }
                  }
                  
                  /* Medium */
                  @media (min-width: 992px) {
                      .container {
                          width: 970px;
                      }
                  }
                  
                  /* Large */
                  @media (min-width: 1200px) {
                      .container {
                          width: 1170px;
                      }
                  }
                  
                  /* End Global Rules */
                  
                  /* Start Header */
                  header {
                      background-color: var(--primary-color);
                      width: 100%;
                  }
                  
                  header .container {
                      display: flex;
                      justify-content: center;
                  }
                  
                  header .container h1 {
                      color: var(--secondry-color);
                  }
                  
                  /* End Header */
                  /* Start Section */
                  section {
                      background-image: url(pages/imgs/articles.jpg);
                      background-repeat: no-repeat;
                      background-size: cover;
                      background-position: center;
                      background-attachment: fixed;
                      position: relative;
                      z-index: 2;
                  }
                  
                  section::before {
                      content: "";
                      background-color: rgb(0 0 0 / 70%);
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: 100%;
                      z-index: -1;
                  }
                  
                  section .container {
                      display: flex;
                      align-items: centre;
                      flex-direction: column;
                  }
                  
                  section .container div {
                      text-align: center;
                  }
                  
                  section .container div h1 {
                      color: var(--primary-color1);
                      font-size: xx-large;
                      text-transform: uppercase;
                  }
                  
                  section .container div:first-child h2 {
                      color: var(--secondry-color);
                  }
                  
                  section .container div h2 {
                      color: var(--primary-color1);
                  }
                  
                  section .container div h5 {
                      color: var(--secondry-color);
                  }
                  
                  section .container div p {
                      color: var(--secondry-color);
                  }
                  
                  section .container ul li a {
                      border: 2px solid var(--primary-color1);
                      padding: 5px;
                      background-color: var(--secondry-color);
                  }
                  
                  /* section .container div a:first-child {
                      display: none;
                  } */
                  section .container div a {
                      border: 2px solid var(--primary-color1);
                      padding: 5px;
                      background-color: var(--secondry-color);
                  }
                  
                  /* End Section */
                  /* Start Form */
                  .form {
                      background-image: url(pages/imgs/articles.jpg);
                      background-repeat: no-repeat;
                      background-size: cover;
                      background-position: center;
                      background-attachment: fixed;
                      position: relative;
                      z-index: 2;
                  }
                  
                  .form::before {
                      content: "";
                      background-color: rgb(0 0 0 / 70%);
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: 100%;
                      z-index: -1;
                  }
                  
                  .form .container {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                  }
                  
                  .form .container form {
                      border: 5px solid var(--primary-color1);
                      margin: 25px 0;
                      padding: 10px;
                      border-bottom-right-radius: 25px;
                      border-top-left-radius: 25px;
                      color: var(--secondry-color);
                      font-size: larger;
                      font-weight: 600;
                      letter-spacing: 1px;
                  }
                  
                  .form .container form div {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 15px;
                  }
                  
                  .form .container form div:not(:nth-child(4)) label::after {
                      content: "*";
                      color: red;
                  }
                  
                  .form .container form div input {
                      margin-left: 10px;
                  }
                  
                  .form .container form .saveButton {
                      display: flex;
                      justify-content: center;
                  }
                  
                  .form .container form .saveButton button {
                      margin-top: 10px;
                      color: var(--secondry-color);
                      padding: 5px 25px;
                      background-color: var(--primary-color);
                      border: none;
                      border-radius: 25px;
                      transition: var(--duration);
                      font-size: large;
                      font-weight: 500;
                      letter-spacing: 1px;
                  }
                  
                  .form .container form .saveButton button:hover {
                      background-color: var(--primary-color1);
                      transition: var(--duration);
                  }
                  
                  .form .container form h6 {
                      padding-left: 15px;
                      margin: 0;
                  }
                  
                  .form .container form h6::before {
                      content: "*";
                      color: red;
                      padding-right: 5px;
                  }
                  
                  /* End Form */
                  /* Start Footer */
                  footer {
                      background-color: var(--primary-color);
                      width: 100%;
                  }
                  
                  footer .container {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 5px 0;
                  }
                  
                  /* footer .container a:first-child { 
                      display: none;
                  } */
                  
                  footer .container a {
                      padding: 5px;
                      border: 1px solid var(--primary-color1);
                      color: var(--primary-color);
                      background-color: var(--secondry-color);
                      font-size: large;
                      font-weight: 500;
                      transition: var(--duration);
                  }
                  
                  footer .container a:hover {
                      color: var(--secondry-color);
                      background-color: var(--primary-color1);
                  }
                  
                  footer .container p {
                      color: var(--primary-color1);
                      font-weight: 700;
                  }
                  
                  footer .container p span {
                      color: var(--secondry-color);
                      font-weight: 700;
                  
                  }
                  
                  /* End Footer */
                </style>
            </head>
            <body>
              <header>
                <div class="container">
                    <h1>Article Info</h1>
                </div>
              </header>
              <section>
                <div class="container">`
                    for (var i = 0; i < rows.length; i++) {
                      res+="<div class='title'><h1>Title</h1><h2>" +
                        rows[i].title +
                        "</h2></div><div class='authors'><h2>Authors:</h2>                        <h5>" +
                        rows[i].authors +
                        "</h5></div><div class='abstract'><h2>Abstract:</h2>                        <p>" +
                        rows[i].abstract +
                        "</p></div><div class='link'><a href='" +
                        rows[i].link +
                        "'>Download</a><div/>"+
                          `</div>
                      </section>
                      <section class="form"><div class="container">`
                      res+="<form action='/article_action/delete/" + rows[i].id + `' method="post">
                        <div class="authenCode">
                          <label for="code">Authentication Code</label>
                          <input type="text" name="code" id="code" required>
                        </div>
                        <div class="saveButton">
                          <button type="submit">delete</button>
                        </div>
                        </form>`
                        res+="<form action='/article_action2/edit/" + rows[i].id + `'method="post">
                        <div class="saveButton">
                          <button type="submit">Edit</button>
                        </div>
                        </form></div>
                      `
                    }
                    res+=`</section>
                    <footer>
                    <div class="container">
                        <a href="/">Return Home Page</a>
                        <p>Made With &lt;3 By <span>MohammadAbdulsalam</span> </p>
                    </div>
                    </footer>
                    </body>
                  </html>`
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.end(res);
      } else {
        console.log(err);
      }
    });
  }else if(url === "/add") {
    response.writeHead(200, {'Content-Type': 'text/html'});
    // Sending an HTML file as a response
    fs.readFile('pages/add.html', null, function (error, data) {
      if (error) {
        response.writeHead(404);
        response.write('Whoops! Page not found!');
      }else {
        response.write(data);
      }
      response.end();
    });
  }else if(url === '/add_handler'){
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      let query = "INSERT INTO article (title, authors, abstract, link) VALUES (?, ?, ?, ?);";
      let values_to_insert = [
        fields.title,
        fields.authors,
        fields.abstract,
        fields.link
      ]
      let sql = "SELECT * FROM authentication_code WHERE code =?"
      console.log(fields.code);
      mysqlConnection.query(sql ,fields.code, (err, rows) => {
          for (var i = 0; i < rows.length; i++) {
            console.log(rows[i].code);
              mysqlConnection.query(query, values_to_insert, (err, rows) => {
                if (err) throw err;
                else{
                  console.log("Inserted Successfully")
            }});
          }
      });
      redirect_user(response, '/add')

    });}
  else if (url.startsWith("/article_action/delete/")){
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
    let query = 'DELETE FROM article WHERE id=';
    let split_url = url.split("/")
    let user_id = split_url[split_url.length - 1] //getting the user ID to delete
    console.log(user_id);
    let sql = "SELECT * FROM authentication_code WHERE code =?"
    mysqlConnection.query(sql, fields.code, (err, rows) => {
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].code);
        mysqlConnection.query( 'DELETE FROM article WHERE id=' + user_id, (err, rows) => {
          if (err){
            throw err
          }else {
            console.log("Deleted Successfully")
          }
          });
      }
    })
    redirect_user(response, '/')
  });
  }else if (url.startsWith("/article_action2/edit/")){
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
    let split_url = url.split("/")
    let user_id = split_url[split_url.length - 1]
    console.log(user_id);
    let sql = "SELECT * FROM article WHERE id = ?"
    mysqlConnection.query(sql,user_id, (err, rows, fields) => {
      if (!err) {
        let res = `
          <!DOCTYPE html>
          <html>
            <head>
                <title>Article Info</title>
                <style>
                  /* Start Variables */
                  :root {
                      --primary-color : #071e26;
                      --primary-color1 : #0a416b;
                      --secondry-color: rgb(0, 115, 222);
                      --duration: 0.5s;
                  }
                  /* End Variables */
                  /* Start Global Rules */
                  * {
                      -webkit-box-sizing: border-box;
                      -moz-box-sizing: border-box;
                      box-sizing: border-box;
                  }
                  html {
                      scroll-behavior: smooth;
                  }
                  body {
                      font-family: Arial, Helvetica, sans-serif ;
                      margin: 0;
                      padding: 0;
                      background-color: var(--primary-color);
                  }
                  a {
                      text-decoration: none;
                  }
                  .container {
                      padding-left: 15px;
                      padding-right: 15px;
                      margin-left: auto;
                      margin-right: auto;
                  }
                  /* Small */
                  @media (min-width: 768px) {
                      .container {
                          width: 750px;
                      }
                  }
                  /* Medium */
                  @media (min-width: 992px) {
                      .container {
                          width: 970px;
                      }
                  }
                  /* Large */
                  @media (min-width: 1200px) {
                      .container {
                          width: 1170px;
                      }
                  }
                  /* End Global Rules */
                  
                  /* Start Header */
                  header {
                      background-color: var(--primary-color);
                      width: 100%;
                  }
                  header .container {
                      display: flex;
                      justify-content: center;
                  }
                  header .container h1 {
                      color: var(--secondry-color);
                  }
                  /* End Header */
                  /* Start Form */
                  .form {
                      background-image: url(pages/imgs/articles.jpg);
                      background-repeat: no-repeat;
                      background-size: cover;
                      background-position: center;
                      background-attachment: fixed;
                      position: relative;
                      z-index: 2;
                  }
                  .form::before {
                      content: "";
                      background-color: rgb( 0 0 0 / 70%);
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      height: 100%;
                      z-index: -1;
                  }
                  .form .container {
                      display: flex;
                      justify-content: center;
                      padding: 140px 0;
                  }
                  .form .container form {
                      border: 5px solid var(--primary-color1);
                      margin: 25px 0;
                      padding: 10px;
                      border-bottom-right-radius: 25px;
                      border-top-left-radius: 25px;
                      color: var(--secondry-color);
                      font-size: larger;
                      font-weight: 600;
                      letter-spacing: 1px;
                  }
                  .form .container form div {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 15px;
                  }
                  .form .container form div:not(:nth-child(4)) label::after {
                      content: "*";
                      color: red;
                  }
                  .form .container form div input {
                      margin-left: 10px;
                  }
                  .form .container form .saveButton {
                      display: flex;
                      justify-content: center;
                  }
                  .form .container form .saveButton button{
                      margin-top: 10px;
                      color: var(--secondry-color);
                      padding: 5px 25px;
                      background-color: var(--primary-color);
                      border: none;
                      border-radius: 25px;
                      transition: var(--duration);
                      font-size: large;
                      font-weight: 500;
                      letter-spacing: 1px;
                  }
                  .form .container form .saveButton button:hover{
                      background-color: var(--primary-color1);
                      transition: var(--duration);
                  }
                  .form .container form h6 {
                      padding-left:15px;
                      margin: 0;
                  }
                  .form .container form h6::before {
                      content: "*";
                      color: red;
                      padding-right: 5px;
                  }
                  /* End Form */
                  /* Start Footer */
                  footer {
                      background-color: var(--primary-color);
                      width: 100%;
                  }
                  footer .container {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 5px 0;
                  }
                  footer .container a {
                      padding: 5px;
                      border: 1px solid var(--primary-color1);
                      color: var(--primary-color);
                      background-color: var(--secondry-color);
                      font-size: large;
                      font-weight: 500;
                      transition: var(--duration);
                  }
                  footer .container a:hover {
                      color: var(--secondry-color);
                      background-color: var(--primary-color1);
                  }
                  footer .container p {
                      color: var(--primary-color1);
                      font-weight: 700;
                  }
                  footer .container p span {
                      color: var(--secondry-color);
                      font-weight: 700;
                  
                  }
                  /* End Footer */
              </style>
            </head>
            <body>
              <header>
                <div class="container">
                    <h1>Article Info</h1>
                </div>
              </header>
              <section class="form">
                <div class="container">`
                    for (var i = 0; i < rows.length; i++) {
                    res+="<form action='/article_action/edit/update/" + rows[i].id + "' method='post'>"+
                    "<div class='artTitle'>"+
                      "<label for='title'>Title</label>"+
                      "<input type='text' name='title' id='title' value='"+rows[i].title+"' required>"+
                    "</div>"+
                    "<div class='authName'>"+
                      "<label for='authors'>Authors</label>"+
                      "<input type='text' name='authors' id='authors' value='"+rows[i].authors+"' required>"+
                    "</div>"+
                    "<div class='abStract'>"+
                      "<label for='abstract'>Abstract</label>"+
                      "<input type='text' name='abstract' id='abstract' value='"+rows[i].abstract+"' required>"+
                    "</div>"+
                    "<div class='urlLink'>"+
                      "<label for='link'>Link</label>"+
                      "<input type='text' name='link' id='link' value='"+rows[i].link+"'>"+
                    "</div>"+
                    "<div class='authenCode'>"+
                      "<label for='code'>Authentication Code</label>"+
                      "<input type='text' name='code' id='code' required>"+
                    "</div>"+
                    "<div class='saveButton'>"+
                      "<button type='submit'>Update</button>"+
                    "</div>"+
                    "<h6>Fill Required</h6>"+
                    "</form>"
                    }
                    res+=`</div></section>
                      <footer>
                      <div class="container">
                          <a href="/">Return Home Page</a>
                          <p>Made With &lt;3 By <span>MohammadAbdulsalam</span> </p>
                      </div>
                      </footer>
                    </body>
                  </html>`
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.end(res);
      } else {
        console.log(err);
      }
    })});
  }
  else if (url.startsWith("/article_action/edit/update/")) {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      let res;
    let query = 'UPDATE article SET title = ?,authors=?,abstract=?,link=? WHERE id = ';
    let values_to_insert = [
      fields.title,
      fields.authors,
      fields.abstract,
      fields.link,
    ]
    let split_url = url.split("/")
    let user_id = split_url[split_url.length - 1] //getting the user ID to delete
    console.log(user_id);
    let sql = "SELECT * FROM authentication_code WHERE code =?"
    mysqlConnection.query(sql, fields.code, (err, rows) => {
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].code);
        mysqlConnection.query( query + user_id,values_to_insert, (err, rows) => {
          if (err){
            throw err
          }else {
            console.log("Updated Successfully")
          }
          });
      }
    })
    redirect_user(response, '/')
  });
  }
  else { // If the user entered a page that doesn't exist, send the 'page not found' response
    send_failed_msg(response, 404)
  }
});


function send_failed_msg(response, code){
  response.statusCode = code;
  response.setHeader('Content-Type', 'text/html');
  response.end(`<div style="color: red;">Whoops! An error occurred!</div>
                <div><a href="/">Return home</a></div>`);
}

function redirect_user(response, location){
  response.statusCode = 302;
  response.setHeader('Location', location);
  response.end()
}

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
