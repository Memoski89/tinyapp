const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = { shortURL: shorturl, longURL: longurl };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  console.log(urlDatabase); // Log the POST request body to the console
  res.redirect(`/urls/${shortUrl}`); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  const link = urlDatabase[req.params.shortURL];

  res.redirect(`http://${link}`);

  //   console.log(x)

  // // if(link === )
});
