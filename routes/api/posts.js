const express = require("express");
const router = express.Router();

// @router  GET api/posts/test
// @desc    Tests post router
// @access  public

router.get("/test", (req, res, next) => {
  res.json({
    msg: "Posts works"
  });
});
module.exports = router;
