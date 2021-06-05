const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// @route       POST api/posts
// @description Create post
// @access      Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET api/posts
// @description Get all post
// @access      Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET api/posts/:postId
// @description Get post by post id
// @access      Private

router.get("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(posts);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route       Delete api/posts/:postId
// @description Get post by post id
// @access      Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: "Post not found" });
    }
    // Check make sure user who is deleting owns the post

    if (posts.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user not authorized" });
    }
    await posts.remove();
    res.json({ msg: "Post removed" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route       Put api/posts/like/:id
// @description Like a post
// @access      Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    // check if the post has been already liked
    if (
      posts.likes.filter((like) => like.user.toString() == req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "post already liked" });
    }
    posts.likes.unshift({ user: req.user.id });
    await posts.save();
    res.json(posts.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route       Put api/posts/unlike/:id
// @description Like a post
// @access      Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);

    // check if the post has been already liked
    if (
      posts.likes.filter((like) => like.user.toString() == req.user.id)
        .length == 0
    ) {
      return res.status(400).json({ msg: "post has not yet been liked" });
    }
    // Get to remove index
    const removeIndex = posts.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    posts.likes.splice(removeIndex, 1);
    await posts.save();
    res.json(posts.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST api/posts/comment/:id
// @description Comment on a post
// @access      Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       Delete api/posts/comment/:id/:comment_id
// @description Get post by post id
// @access      Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );
  
      await post.save();
  
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  });

module.exports = router;
