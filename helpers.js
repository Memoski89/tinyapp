let getUserByEmail = function(email, database){
  for(const key in database){
     if(database[key].email === email){
       return database[key]
     }
  }return null
}

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
    if (users[keys].email === email && bcrypt.compareSync(password, users[keys].password)) {
      return true;
    }
  }
  return false;
};

const getUserId = function (email, password) {
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


module.exports = {getUserByEmail, emailChecker, passwordChecker, getUserId, generateRandomString}
