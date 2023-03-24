const express = require("express");
const NoteModel = require("../model/note.model");
const jwt = require("jsonwebtoken");

const notesRouter = express.Router();

notesRouter.get("/", async (req, res) => {
  let token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  try {
    if (decoded) {
      const userID = decoded.userID;
      const notes = await NoteModel.find({ userID: userID });
      res.status(200).send(notes);
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

notesRouter.post("/add", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ message: "A new note was created" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

notesRouter.patch("/update/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const payload = req.body;
  try {
    await NoteModel.findByIdAndUpdate({ _id: noteID }, payload);
    res.status(200).send({ message: "Note updated successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

notesRouter.delete("/delete/:noteID", async (req, res) => {
  const { noteID } = req.params;
  try {
    await NoteModel.findByIdAndDelete({ _id: noteID });
    res.status(200).send({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = notesRouter;
