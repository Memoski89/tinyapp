const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// pretty self explantory but this function will be used to generate a random id
const generateRandomString = function () {
  let randomString = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
const emailChecker = function (item) {
  for (const keys in users) {
    if (users[keys].email === item) {
      return true;
    }
  }
  return false;
};
const passwordChecker = function (email, password) {
  for (const keys in users) {
    if (users[keys].email === email && users[keys].password === password) {
      return true;
    }
  }
  return false;
};
const getUserId = function (email, password) {
  for (const key in users) {
    if (users[key].email === email && users[key].password === password) {
      return key;
    }
  }
};
// this is to test
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// this is also a test
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let userId = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
  res.redirect(`/urls/${shortUrl}`); // Respond with 'Ok' (we will replace this)
});

app.get("/register", (req, res) => {
  console.log("hello");
  let userId = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  // console.log(templateVars.user);
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  // console.log(JSON.stringify(req.body));
  let newEmail = req.body.email;
  let newPassword = req.body.password;
  let randomId = generateRandomString();

  if (newEmail === "" || newPassword === "") {
    res.send("404 please insert an actual email/password");
  } else if (emailChecker(newEmail)) {
    res.send("404 email already exist try again");
  } else {
    const newuser = {
      id: randomId,
      email: newEmail,
      password: newPassword,
    };

    users[randomId] = newuser;
    res.cookie("user_id", randomId);
    // console.log(users);
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  let userId = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render("urls_login", templateVars);
});
app.post("/login", (req, res) => {
  if (!emailChecker(req.body.email)) {
    res.send("403 email does not exist");
  }
  if (passwordChecker(req.body.email, req.body.password)) {
    let exactKey = getUserId(req.body.email, req.body.password);
    console.log("label", exactKey);

    // console.log('here')
    res.cookie("user_id", exactKey);
    res.redirect(`/urls`);
  } else {
    res.send("404 wrong password");
  }
});
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/urls`);
});

app.get("/urls/new", (req, res) => {
  let userId = req.cookies["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render("urls_new", templateVars);
});

app.post("/urls/update/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;

  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL", (req, res) => {
  let shorturl = req.params.shortURL;
  let longurl = req.body.longURL;
  urlDatabase[shorturl] = longurl;
  res.redirect("/urls");
});
app.post("/urls/delete/:keys", (req, res) => {
  const shortUrl = req.params.keys;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  let userId = req.cookies["user_id"];
  let shorturl = req.params.shortURL;
  const longurl = urlDatabase[shorturl];
  const templateVars = {
    shortURL: shorturl,
    longURL: longurl,
    user: users[userId],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const link = urlDatabase[req.params.shortURL];
  if (link.startsWith("http://")) {
    res.redirect(link);
  } else {
    res.redirect(`http://${link}`);
  }
});
