const express = require("express");
const mongoose = require("mongoose");
const profile = require("./routes/api/profile");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const db = require("./config/keys").mongoURI;
const app = express();

// app.use(cors());
app.use(cors({ origin: true, credentials: true }));

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//passpoart middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//routing
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
