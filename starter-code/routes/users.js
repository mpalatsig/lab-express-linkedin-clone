const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', (req, res, next) => {
   User.find({}, (err, users) => {
     console.log(users);
     if (err) {
         next();
         return err;
       } else {
         res.render('users', {users: users});
       }
   });
 });


//edit user with id
router.get('/profile/:userId/edit', (req, res, next) => {
  if (req.session.currentUser._id === req.params.userId) {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        next();
        return err;
      }
      res.render('profile/edit', {
        user: user
      });
    });
  } else {
    res.redirect('/');
  }
});


router.post('/profile/:userId', (req, res, next) => {
  let {
    email,
    summary,
    imageUrl,
    company,
    jobTitle
  } = req.body;
  let edits = {
    email,
    summary,
    imageUrl,
    company,
    jobTitle
  };
  User.findByIdAndUpdate(req.params.userId, edits, (err, user) => {
    console.log(user);
    if (err) {
      next();
      return err;
    }
    res.redirect(`/users/profile/${user._id}`);
  });
});


router.get('/profile/:userId', function(req, res, next) {
  console.log(req.params.userId);
  console.log(req.session.currentUser._id);
  if (req.session.currentUser._id === req.params.userId) {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        next();
        return err;
      }
      res.render('profile/show', {
        user: user,
        session: req.session.currentUser,
        profile: false
      });
    });
  } else if (req.session !== undefined) {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        next();
        return err;
      }
      res.render('profile/show', {
        user: user,
        session: req.session.currentUser,
        profile: true,
      });
    });
  } else {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        next();
        return err;
      }
      res.render('profile/show', {
        user: user,
        session: req.session.currentUser,
        profile: false,
      });
    });
  }
});



module.exports = router;
