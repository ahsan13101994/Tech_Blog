const router = require('express').Router();
const { Post } = require('../../models');

router.post('/', async (req, res) => {
      try {
        const postData = await Post.create({
            post_title: req.body.post_title,
            post_content: req.body.post_content,
            user_id: req.session.user_id
        });
        res.status(200).json(postData);
      } catch (err) {
        res.status(400).json(err);
      }
  });

module.exports = router;