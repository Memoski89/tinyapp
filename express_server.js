const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

function generateRandomString() {
  let randomString = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
}
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  // const templateVars = {
  //   username: req.cookies["username"],
  //   // ... any other vars
  // };
  // res.render("urls_index", templateVars);

  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});
app.post("/urls/update/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;

  res.redirect(`/urls/${shortUrl}`);
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);

  console.log(req.body.username);
  // console.log(req);
  res.redirect(`/urls`);
});
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL", (req, res) => {
  let shorturl = req.params.shortURL;
  let longurl = req.body.longURL;
  urlDatabase[shorturl] = longurl;
  res.redirect("/urls");
});
app.post("/urls/delete/:keys", (req, res) => {
  // const idontknow = req.body.information
  // console.log(idontknow)
  const shortUrl = req.params.keys;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
  // console.log(req.params.keys)

  // let shorturl =req.params.shortURL
  // let key = urlDatabase[shorturl]

  // console.log("delete")

  // res.redirect("/urls")
});

app.get("/urls/:shortURL", (req, res) => {
  let shorturl = req.params.shortURL;
  const longurl = urlDatabase[shorturl];
  const templateVars = {
    shortURL: shorturl,
    longURL: longurl,
    username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  console.log(req.body); // Log the POST request body to the console
  /* console.log(urlDatabase); */ res.redirect(`/urls/${shortUrl}`); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  const link = urlDatabase[req.params.shortURL];

  res.redirect(`http://${link}`);

  //   console.log(x)

  // // if(link === )
});
