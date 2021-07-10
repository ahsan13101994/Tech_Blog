const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
//get all the users
router.get("/", (req, res) => {
  User.findAll({
    attributes: ["id", "username", "email", "password"], 
    include: [
      {
        model: Post,
        as: "posts",
        attributes: ["id", "title", "body"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "comment_text", "post_id"],
      },
    ],
  }) 
    .then((dbUserData) => {
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//get user by id
router.get("/:id", (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "username", "email", "password"], 
    include: [
      {
        model: Post,
        as: "posts",
        attributes: ["id", "title", "body"],
      },
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "comment_text", "post_id"],
      },
    ],
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No User found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//add user
router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then((dbUserData) => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id; 
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json(dbUserData);
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//log in the user
router.post("/login", (req, res) => {

  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((dbUserData) => {
      
      if (!dbUserData) {
        res.status(400).json({ message: "User " });
        return;
      }
      const validPassword = dbUserData.checkPassword(req.body.password);

     
      if (!validPassword) {
        res.status(400).json({ message: "Incorrect Password!" });
        return;
      }

      //save session
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json({ user: dbUserData, message: "You are now logged in!" });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update user
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No User found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one dish without serializing data
router.get('/user/:id', async (req, res) => {
  try {
    const dbUserData = await User.findByPk(req.params.id);
    console.log(dbUserData)
    res.render('user', dbUserData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Log out the user
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      // end the session
      res.status(204).end();
    });
  } else {
    res.status(404).end(); // if there was no session
  }
});
module.exports = router;