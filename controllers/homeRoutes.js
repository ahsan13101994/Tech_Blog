const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/',withAuth, async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [{model:Comment}],
      });
      const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
    loggedIn: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
  
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
