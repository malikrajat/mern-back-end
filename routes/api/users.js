const express = require("express");
const router = express.Router();

// @router  GET api/users/test
// @desc    Tests user router
// @access  public

router.get("/test", (req, res) => {
  res.json({
    msg: "Users works"
  });
});
module.exports = router;
