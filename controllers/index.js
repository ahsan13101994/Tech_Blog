const router = require("express").Router();
const homeRoutes = require("./home-routes");
const commentRoutes = require("./api/commentRoutes");
const userRoutes = require("./api/userRoutes");
const postRoutes = require("./api/postRoutes");
//set up the route useage
router.use("/", homeRoutes);
router.use("/api/comments", commentRoutes);
router.use("/api/users", userRoutes);
router.use("/api/posts", postRoutes);
module.exports = router;