const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const dbUserData = require('./userData.json');
const dbPostData = require('./postData.json');
const dbCommentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(dbUserData, {
    individualHooks: true,
    returning: true,
  });

  await Post.bulkCreate(dbPostData);

  await Comment.bulkCreate(dbCommentData);

  process.exit(0);
};

seedDatabase();