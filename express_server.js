const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const {
  getUrlspecfic,
  emailChecker,
  passwordChecker,
  getUserId,
  generateRandomString,
} = require("./helpers");
const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "aJ48lW" },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls.json", (req, res) => {
  res.json(database);
});

// IF user is not recognized sent an error, else rendered urls_ index normally
app.get("/urls", (req, res) => {
  let userId = req.session["user_id"];
  let value = getUrlspecfic(userId, urlDatabase);
  let templateVars = { urls: value, user: users[userId] };
  if (!userId) {
    return res.send("Please login to see Urls");
  }

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();

  let userId = req.session["user_id"];
  let result = { longURL: req.body.longURL, userID: userId };
  urlDatabase[shortUrl] = result;

  res.redirect(`/urls/${shortUrl}`);
});
// registration page
app.get("/register", (req, res) => {
  const templateVars = { user: null };

  res.render("urls_register", templateVars);
});

// multiple checks to verfiy if a new email/existing email/ valid password
app.post("/register", (req, res) => {
  let newEmail = req.body.email;
  let newPassword = req.body.password;
  let randomId = generateRandomString();
  let hashedPassword = bcrypt.hashSync(newPassword, 10);

  if (newEmail === "" || newPassword === "") {
    res.send("404 please insert an actual email/password");
  } else if (emailChecker(newEmail, users)) {
    res.send("404 email already exist try again");
  } else {
    const newuser = {
      id: randomId,
      email: newEmail,
      password: hashedPassword,
    };

    users[randomId] = newuser;

    req.session["user_id"] = randomId;

    res.redirect("/urls");
  }
});

//login page
app.get("/login", (req, res) => {
  let userId = req.session["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render("urls_login", templateVars);
});
//checks to see if email exists or if password is valid then redirects to urls page
app.post("/login", (req, res) => {
  if (!emailChecker(req.body.email, users)) {
    return res.send("403 email does not exist");
  }
  if (passwordChecker(req.body.email, req.body.password, users)) {
    let exactKey = getUserId(req.body.email, req.body.password, users);
    req.session["user_id"] = exactKey;
    res.redirect(`/urls`);
  } else {
    res.send("404 wrong password");
  }
});
//when you logout redirects you to urls, but it should give you an error because persons who are not logged in cannot access urls
app.post("/logout", (req, res) => {
  req.session["user_id"] = null;
  res.redirect(`/urls`);
});
// if user is not logged in cannot access this new urls pag
app.get("/urls/new", (req, res) => {
  let userId = req.session["user_id"];
  const templateVars = { user: users[userId] };
  if (!userId) {
    return res.send("404 please login");
  }
  res.render("urls_new", templateVars);
});

// short urls page

app.post("/urls/update/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;

  res.redirect(`/urls/${shortUrl}`);
});
// once again another check if user is not logged in will send an error otherwise redirects to urls
app.post("/urls/:shortURL", (req, res) => {
  
  let userId = req.session["user_id"];
  if (!userId) {
    return res.send("Please login to see Urls");
  }
  let shorturl = req.params.shortURL;
  let longurl = req.body.longURL;
  let idValue = req.session["user_id"];
  let result = { longURL: longurl, userID: idValue };
  urlDatabase[shorturl] = result;
  res.redirect("/urls");
});

// deletes user created urls and if another user is logged on simultaneously it will send an error
app.post("/urls/delete/:keys", (req, res) => {
  const userId = req.session.user_id;
  const shortUrl = req.params.keys;

  // if short url exists in database && UserID matches current userID

  if (urlDatabase[shortUrl] && urlDatabase[shortUrl].userID !== userId) {
    return res.status(403).send("This url doesn't belong to you");
  }
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});
//another error message if user is not logged in and access this page
app.get("/urls/:shortURL", (req, res) => {

  let userId = req.session["user_id"];
  
  if (!userId) {
    return res.send("Please login to see Urls");
  }
  if(userId !==  urlDatabase[req.params.shortURL].userID){
    return res.send("These are not the urls you're looking for")
  }
  let shorturl = req.params.shortURL;
  const longurl = urlDatabase[shorturl];
  const templateVars = {
    shortURL: shorturl,
    longURL: longurl.longURL,
    user: users[userId],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const link = urlDatabase[req.params.shortURL].longURL;

  if (link.startsWith("http://")) {
    res.redirect(link);
  } else {
    res.redirect(`http://${link}`);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = users;
