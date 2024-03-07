const { BlogPost, Admin, AuditLog } = require('../models');
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');


const userSignUp = async (req, res) => {
  const { name, password, email, isAdmin } = req.body;
  console.log(req.body);
  try {
    const existingUser = await Admin.findOne({ where: { [Op.or]: [{ Name: name }, { email: email }] } });

    if (existingUser) {
      req.flash('error', 'Username is already taken. Please choose a different one.');
      return res.redirect('/signup');
    }
    bcrypt.hash(password, 10).then((hash) => {
      const newUser = Admin.create({
        Name: name,
        password: hash,
        email: email,
        isAdmin: isAdmin === 'true',
      }).then((newUser) => {
        req.session.user = newUser;
        res.locals.session = req.session;
        res.redirect('/');
      });
      // req.session.user = newUser;
      // res.locals.session = req.session;
      // res.redirect('/');
    });
  } catch (error) {
    {
      console.error('Error during user signup:', error);
      req.flash('error', "Something went wrong. Try Again");
      return res.redirect('/signup');
    }
  }
};

const userLogIn = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  const admin = await Admin.findOne({ where: { email: email } });

  if (!admin) {
    req.flash('error', "User Doesn't Exist");
    return res.redirect('/login')
  };

  bcrypt.compare(password, admin.password).then((match) => {
    if (!match) {
      req.flash('error', "Wrong Name And Password Combination");
      return res.redirect('/login');
    }
    req.session.user = admin;
    //   console.log(req.session.user);
    //   console.log("Admin LOGGED IN!!!");
    res.locals.session = req.session;
    //   console.log(req.session.user.dataValues.email);
    //   console.log(res.locals.session);
    res.redirect('/');
  });
}
const userLogOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.locals.session = null;
      res.redirect('/');
    }
  });

}
const getAllUser = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.render('EditUser', { users: admins });
  } catch (error) {
    console.error('Error fetching all admins:', error);
    throw error;
  }
}
const editUser = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const action = req.query.action;

    if (action === 'delete') {
      await admin.destroy();
      return res.redirect('/allusers');
    } else if (action === 'toggle') {
      const updatedAdmin = await admin.update({ isAdmin: !admin.isAdmin });
      return res.redirect('/allusers');
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error managing admin:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
module.exports = {
  userSignUp,
  userLogIn,
  userLogOut,
  getAllUser,
  editUser,
}