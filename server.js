const express = require("express");
const mongoose = require("mongoose");
const profile = require("./routes/api/profile");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const app = express();
const db = require("./config/keys").mongoURI;
app.get("/", (req, res, next) => {
  res.send("Hello");
});
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
const port = process.env.PORT || 5000;

// DB connect
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    res => {
      console.log("MangoDb Connect");

      // Start server
      app.listen(port, () => {
        console.log(`server running on port ${port}`);
      });
    },
    er => {
      console.log(er);
    }
  )
  .catch(er => {
    console.log(er);
  });
