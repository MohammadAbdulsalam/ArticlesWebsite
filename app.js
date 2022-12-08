const http = require('http'); // The main server package
const fs = require('fs'); // The file system package, used to deal with files
var mysql = require('mysql');
var formidable = require('formidable');

const hostname = "127.0.0.1";
const port = process.env.PORT || 3000; 

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "Articles",
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
                    rows[i].title 
                    "</a></li>" 
        }
        res += `</ul>
                </div>
              </section>
              <div>
                <a href="/add">Add New Article</a>
              </div>
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
            </head>
            <body>
              <header>
                <div class="container">
                    <h1>Article Info</h1>
                </div>
              </header>
              <section>
                <div class="container">
                  <table border="2px">
                    <tr>
                      <th> Title </th>
                      <th> Authors </th>
                      <th> Abstract </th>
                      <th> Link </th>
                    </tr>`
                    for (var i = 0; i < rows.length; i++) {
                      res+="<tr><td>" +
                        rows[i].title +
                        "</td><td>" +
                        rows[i].authors +
                        "</td><td>" +
                        rows[i].abstract +
                        "</td><td><a href='" +
                        rows[i].link +
                        "'>Download</a></td>"+
                        `</table>
                          </div>
                      </section>
                      <section>`
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
                        </form>
                      `
                    }
                    res+=`</section>
                    <a href="/">Return Home Page</a>
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
                  console.log(err)
            }});
          }
      });
      response.statusCode = 302; //Redirecting the user to the users page
      response.setHeader('Location', '/addarticle');
      response.end();
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
            console.log(err);
          }
          });
      }
    })
    response.statusCode = 302; //Redirecting the user to the users page
    response.setHeader('Location', '/');
    response.end();
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
                    "</form>"
                    }
                    res+=`</div></section>
                    <a href="/">Return Home Page</a></body>
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
            console.log(err);
          }
          });
      }
    })
    response.statusCode = 302; //Redirecting the user to the users page
    response.setHeader('Location', '/');
    response.end();
  });
  }
  else { // If the user entered a page that doesn't exist, send the 'page not found' response
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end(`<div style="color: red;">Whoops! Page not found!</div>
                  <div><a href="/">Return home</a></div>`);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
