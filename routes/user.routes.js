const express = require("express");
const UserModel = require("../model/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

// Registration
userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      const user = new UserModel({ email, password: hash, username });
      await user.save();
      res.status(200).send({ message: "Registration done" });
    });

    // normal method without hashing password
    // const user = new UserModel(payload);
    // await user.save();
    // res.status(200).send({ message: "Registration done" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Login ( authentication )
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login successful!",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(401).send({ message: "Invalid credentials" });
        }
      });
    }
    // ? res.status(200).send({
    //     message: "Login successfully",
    //     token: jwt.sign({ name: "batman" }, "bruce"),
    //   })
    // : res
    //     .status(400)
    //     .send({ message: "No user found. Please check email or password" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Example how to use jwt verify

// userRouter.get("/details", async (req, res) => {
//   const token = req.headers.authorization;

//   jwt.verify(token, "bruce", (err, decoded) => {
//     decoded
//       ? res.status(200).send("User Details")
//       : res.status(401).send({ message: err.message });

//     // if (!decoded) {
//     //   res.status(401).send({ message: "Unauthorized" });
//     // } else {
//     //   res.status(200).send("User Details");
//     // }
//   });
// });

module.exports = userRouter;
