const models = require('../models');
const {
  AccountModel,
} = require('../models/Account');

const {
  Account,
} = models;
const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};
const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
let users = {
  username: "",
};
const login = (request, response) => {
  const req = request;
  const res = response;
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  if (!username || !password) {
    return res.status(400).json({
      error: 'RAWR! All fields are required!',
    });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username and/or password.',
      });
    }
    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({
      redirect: '/maker',
    });
  });
};
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'RAWR! All fields are required!',
    });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'RAWR! Passwords do not match!',
    });
  }
  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      users.username = accountData.username;
      return res.json({
        redirect: '/maker',
      });
    });
    savePromise.catch((err) => {
      console.log(err);
      if (err.coode === 11000) {
        return res.status(400).json({
          error: 'Username already in use!',
        });
      }
      return res.status(400).json({
        error: 'An error occurred.',
      });
    });
  });
};
const userList = (req, res) => {
  res.render('userList');
};
const getUsers = (req, res) => {
  res.json([{
    username: users.username,
  }]);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.userList = userList;
module.exports.getUsers = getUsers;
