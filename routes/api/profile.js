const express = require("express");
const router = express.Router();

// @router  GET api/profile/test
// @desc    Tests profile router
// @access  public

router.get("/test", (req, res, next) => {
  res.json({
    msg: "Profile works"
  });
});
module.exports = router;
