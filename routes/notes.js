const express = require("express");
// const { body } = require("express-validator");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { validationResult, body } = require("express-validator");

//Routes ->1 : Get all notes using: Get "fetchallnotes"

router.get("/fetchallnotes", fetchuser, async (req, resp) => {
  try {
    const notes = await Notes.find({ user: req.user._id });
    resp.json(notes);
  } catch (error) {
    console.error(error.message);
    resp.status(500).send("Enternal error");
  }
});

//Routes ->2 : Add all notes using: post "api/notes/addnotes"

router.post(
  "/addnotes",
  [
    body("title", "please enter valide title").isLength({ min: 5 }),
    body("description", "title must be 5 charactor").isLength({ min: 5 }),
  ],
  fetchuser,
  async (req, resp) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() });
      }

      const note = Notes({
        title,
        description,
        tag,
        user: Notes._id,
      });

      const savenotes = await note.save();

      resp.json(savenotes);
    } catch (error) {
      console.error(error.message);
      resp.status(500).send("Enternal error cant add notes");
    }
  }
);

//Routes ->3 : Update in existing notes using: post "api/notes/updatenotes" login required

router.put("/updatenotes/:_id", fetchuser, async (req, resp) => {
  const { title, description, tag } = req.body;
  //New object create

  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find the note to be updated and update it
  const note = await Notes.findByIdAndUpdate(
    req.params._id,
    { $set: newNote },
    { new: true }
  );
  resp.json(note);
});
// resp.json(note);

//Routes ->3 : Delete in existing notes using: delete "api/notes/updatenotes" login required

router.delete("/deletenotes/:_id", fetchuser, async (req, resp) => {
  const { title, description, tag } = req.body;
  //find notes to be delete and delete
  let note = await Notes.findByIdAndDelete(req.params._id);

  // resp.json("delete notes success", note);
  resp.send("deleted");
});
module.exports = router;
