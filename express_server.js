const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

let getUrlspecfic = function (userId) {
  let result = {};
  for (let t in urlDatabase) {
    if (urlDatabase[t].userID === userId) {
      result[t] = urlDatabase[t].longURL;
    }
  }
  return result;
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
    console.log(users[keys].password);
    if (
      users[keys].email === email &&
      bcrypt.compareSync(password, users[keys].password)
    ) {
      return true;
    }
  }
  return false;
};
const getUserId = function (email, password) {
  for (const key in users) {
    if (
      users[key].email === email &&
      bcrypt.compareSync(password, users[key].password)
    ) {
      return key;
    }
  }
};
let getUserByEmail = function(email, database){
  for(const key in database){
     if(database[key].email === email){
       return database[key]
     }
  }return null
}


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
  let userId = req.session["user_id"];
  let value = getUrlspecfic(userId);
  let templateVars = { urls: value, user: users[userId] };
  if (userId === null) {
    res.redirect("/register");
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

app.get("/register", (req, res) => {



  const templateVars = { user: null };
  
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {

  let newEmail = req.body.email;
  let newPassword = req.body.password;
  let randomId = generateRandomString();
  let hashedPassword = bcrypt.hashSync(newPassword, 10);

  if (newEmail === "" || newPassword === "") {
    res.send("404 please insert an actual email/password");
  } else if (emailChecker(newEmail)) {
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

app.get("/login", (req, res) => {
  let userId = req.session["user_id"];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render("urls_login", templateVars);
});
app.post("/login", (req, res) => {
  if (!emailChecker(req.body.email)) {
    res.send("403 email does not exist");
  }
  if (passwordChecker(req.body.email, req.body.password)) {
    let exactKey = getUserId(req.body.email, req.body.password);
    req.session["user_id"] = exactKey;
    res.redirect(`/urls`);
  } else {
    res.send("404 wrong password");
  }
});
app.post("/logout", (req, res) => {
  
  req.session["user_id"] = null;
  res.redirect(`/urls`);
});

app.get("/urls/new", (req, res) => {
  
  let userId = req.session["user_id"];
  const templateVars = { user: users[userId] };
  if (userId === null) {
    res.send("404 please login");
  }
  res.render("urls_new", templateVars);
});

app.post("/urls/update/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;

  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL", (req, res) => {
  let shorturl = req.params.shortURL;
  let longurl = req.body.longURL;
  let idValue = req.session["user_id"];
  let result = { longURL: longurl, userID: idValue };
  urlDatabase[shorturl] = result;
  res.redirect("/urls");
});
app.post("/urls/delete/:keys", (req, res) => {
  
  let userId = req.session["user_id"];
  if (!getUrlspecfic(userId)) {
    res.redirect("/login");
  }
  const shortUrl = req.params.keys;
  delete urlDatabase[shortUrl];

  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  
  let userId = req.session["user_id"];
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
  let userId = req.session["user_id"];
  let usersUrl = getUrlspecfic(userId);
  const link = usersUrl[req.params.shortURL];

  if (link.startsWith("http://")) {
    res.redirect(link);
  } else {
    res.redirect(`http://${link}`);
  }
});
