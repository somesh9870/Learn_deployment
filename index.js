const express = require("express");
const connection = require("./db");
const auth = require("./middlewares/auth.middleware");
const notesRouter = require("./routes/note.routes");
const userRouter = require("./routes/user.routes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use(auth);
app.use("/notes", notesRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
  console.log(`server is running at ${process.env.port}`);
});
