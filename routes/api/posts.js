const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const post = require("../../models/Posts");
const router = express.Router();

//post mode
const Post = require("../../models/Posts");

//profile model
const Profile = require("../../models/Profile");

//validation
const validatePostInput = require("../../validation/post");

// @router  GET api/posts/test
// @desc    Tests post router
// @access  public

router.get("/test", (req, res, next) => {
  res.json({
    msg: "Posts works"
  });
});

// @router  POST api/posts
// @desc    Create post
// @access  public

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { error, isValid } = validatePostInput(req.body);
    //check validation
    if (isValid) {
      return res.status(404).json(error);
    }

    const newPost = new post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @router  GET api/posts
// @desc    Get posts
// @access  public

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    error = {};
    Post.find()
      .sort({ date: -1 })
      .then(post => {
        if (!post) {
          error.npPost = "There is no post avalaible.";
          res.status(404).json(error);
        }
        res.json(post);
      })
      .catch(err => res.json(err));
  }
);

// @router  GET api/posts/:id
// @desc    Get posts by id
// @access  public

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    error = {};
    Post.findById(req.params.id)
      .then(post => {
        if (!post) {
          error.npPost = "There is no post avalaible.";
          res.status(404).json(error);
        }
        res.json(post);
      })
      .catch(err => res.json(err));
  }
);

// @router  DELETE api/posts/:id
// @desc    Delete posts by id
// @access  public

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    error = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            //check for post owner
            if (post.user.toString() !== req.user.id) {
              error.notauthorized = "User is not authorized";
              return res.status(401).json(error);
            }
            //Delete
            post.remove().then(() => res.json({ success: true }));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No Post Found." })
          );
      })
      .catch(err => res.json(err));
  }
);

// @router  POST api/posts/like/:id
// @desc    Like post
// @access  public

router.post(
  "like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    error = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            if (
              post.likes.filter(like => like.user.id.toString() === req.user.id)
                .length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyLiked: " User alreay liked the post" });
            }
            //add user id to likes array
            post.likes.unshift({ user: req.user.id });
            post.save().then(post => res.json(post));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No Post Found." })
          );
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
