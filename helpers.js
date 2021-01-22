const bcrypt = require("bcrypt");

let getUrlspecfic = function (userId, database) {
  let result = {};
  for (let t in database) {
    if (database[t].userID === userId) {
      result[t] = database[t].longURL;
    }
  }
  return result;
};

const emailChecker = function (item, users) {
  for (const keys in users) {
    if (users[keys].email === item) {
      return true;
    }
  }
  return false;
};
const getUserByEmail = function(email, database) {
  for(let user in database){
    if(database[user].email === email){
      return database[user];
    }

  }
  return undefined
};

const passwordChecker = function (email, password, users) {
  for (const keys in users) {
    if (users[keys].email === email && bcrypt.compareSync(password, users[keys].password)) {
      return true;
    }
  } return false;passwordChe
};
 



const getUserId = function (email, password, users) {
  for (const key in users) {
    if (users[key].email === email && bcrypt.compareSync(password, users[key].password)){
      return key;
    }
  }
};

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


module.exports = {getUrlspecfic, emailChecker, passwordChecker, getUserId, generateRandomString, getUserByEmail } /* emailChecker, passwordChecker, getUserId, generateRandomString */
