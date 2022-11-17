const { reset } = require('nodemon');
const jwt = require('jsonwebtoken');
require('../models/database');
const User = require('../models/User');
const Role = require('../models/Role');
const Client = require('../models/Client');

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const users = await User.find({});
    res.render('index', { title: 'F&D - Homepage', users });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * GET /login
 * login
 */
exports.login = async (req, res) => {
  try {
    res.render('login', { title: 'F&D - Login' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
/**
 * POST
 * login on post
 */

exports.loginOnPost = async (req, res) => {
  try {
    var email = req.body.email;
    var pass = req.body.password;
    var user = await User.findOne({
      _email: email,
      _pass: pass,
    })
      .then((data) => {
        if (data) {
          var token = jwt.sign({ _id: data._id }, 'mk');
          res.cookie('token', token, {
            maxAge: 604800000,
          });
          res.redirect('/login');
          console.log('OK');
        }
      })
      .catch((err) => {});
  } catch (error) {
    res.redirect('/login');
  }
};

/**
 * GET /register
 * register
 */
exports.register = async (req, res) => {
  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoRegisterObj = req.flash('infoRegister');
    res.render('register', { title: 'F&D - Register', infoErrorsObj, infoRegisterObj });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

/**
 * POST /register
 * register on post
 */
exports.registerOnPost = async (req, res) => {
  try {
    var email = req.body.email;
    var pass = req.body.password;
    var name = req.body.name;
    var gender = req.body.gender;
    var address = req.body.address;
    User.findOne({
      email: email,
    }).then((data) => {
      if (data) {
        req.flash('infoErrors', 'Register failed, Email existed');
        res.redirect('/register');
        console.log('Loi');
      } else {
        User.create({
          email: email,
          pass: pass,
          role: 0,
        });
        Client.create({
          email: email,
          name: name,
          gender: gender,
          address: address,
        });
        req.flash('infoRegister', 'Register Success');
        res.redirect('/register');
        console.log('OK');
      }
    });
  } catch (error) {
    req.flash('infoErrors', 'Register failed');
    res.redirect('/register');
    console.log('Sever Error');
  }
};

//insert for the first time
async function insertDymmyUserData() {
  try {
    await User.insertMany([
      {
        email: 'ttphong071016@gmail.com',
        pass: '123123',
        role: 2,
      },
    ]);
  } catch (error) {
    console.log('err', +error);
  }
}
//insert for the first time
async function insertDymmyClientData() {
  try {
    await Client.insertMany([
      {
        email: 'tranphonglq@gmail.com',
        name: 'Tran Thanh Phong',
        gender: 'male',
        address: 'Linh Trung, Thu Duc, Ho Chi Minh City',
        avatar_link: './uploads/God.jpg',
      },
    ]);
  } catch (error) {
    console.log('err1', error);
  }
}

// insertDymmyUserData();
// insertDymmyClientData();

/**
 * GET /clients
 * clients view
 */
exports.clients = async (req, res) => {
  try {
    console.log(req.data);
    res.render('index', { layout: './layouts/client', title: 'F&D - Clients' });
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};

// /**
//  * GET /shiper
//  * clients view
//  */
//  exports.clients = async (req, res) => {
//   try {
//     console.log(req.data);
//     res.render('index', { title: 'F&D - Register' });
//   } catch (error) {
//     res.status(500).send({ message: error.message || 'Error Occured' });
//   }
// };

/**
 * GET /admin
 * admin view
 */
exports.admin = async (req, res) => {
  try {
    res.json('ok');
  } catch (error) {
    res.status(500).send({ message: error.message || 'Error Occured' });
  }
};
