const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

//Homepage
router.get('/',withAuth, async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [{model:Comment}],
      });
      const posts = postData.map((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
    logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
  
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

//

//serve up the single post page
router.get("/viewpost/:id", (req, res) => {
  //we need to get all posts
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "body", "user_id"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "comment_text", "user_id"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
      },
    ],
  })
    .then((dbPostData) => {
      //serialize data
      if (!dbPostData) {
        res.status(404).json({ message: "No Posts Available" });
        return;
      }
      const post = dbPostData.get({ plain: true }); // serialize all the posts
      console.log(post);
      const myPost = post.user_id == req.session.user_id;
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
        currentUser: myPost,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//serve up the dashboard
router.get("/dashboard", (req, res) => {
  //we need to get all posts
  console.log(req.session.user_id, " this is the session id");
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "body", "user_id"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["username"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "comment_text", "user_id"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
      },
    ],
  })
    .then((dbPostData) => {
      //serialize data
      if (!dbPostData) {
        res.status(404).json({ message: "No Posts Available" });
        return;
      }
      const posts = dbPostData.map((post) => post.get({ plain: true })); // serialize all the posts
      console.log(posts);
      res.render("dashboard", { posts, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/post", (req, res) => {
  res.render("create-post", { loggedIn: req.session.loggedIn });
});


//load the edit page

router.get("/edit/:id", (req, res) => {

  //    post_id: req.postID,

  res.render("edit-post", {
    loggedIn: req.session.loggedIn,
    post_id: req.params.id,
  });
});

module.exports = router;
