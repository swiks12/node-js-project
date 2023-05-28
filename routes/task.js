const express = require("express");
const Task = require("../models/task");
const checkAuth = require("../Middleware/checkAuth");

const router = express.Router();

router.get("/", checkAuth, async (req, res) => {
  if (req.query.id) {
    const task = await Task.findById(req.query.id);
    if (task) res.send(task);
    else res.status(404).send({ message: "Task not found" });
  } else {
    Task.find()
      .then((task) => res.send(task))
      .catch((err) => res.send({ error: err.message }));
  }
});

router.get("/:username", checkAuth, async (req, res) => {

  const usernameFromUrl = req.params.username;
// 646e2af9cc72c3c14c4c94e4
  if (req.params.username) {

    const task = await Task.find({username: usernameFromUrl});
    if (task) res.send(task);
    else res.status(404).send({ message: "Task not found" });
  } else {
    Task.find()
      .then((task) => res.send(task))
      .catch((err) => res.send({ error: err.message }));
  }
});


router.post("/", async (req, res) => {
    try {
      const task = await Task.create(req.body);
      res.send({ message: "Task added successfully", task });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });


  router.put("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      res.send({
        message: "Task Updated Successfully",
        task,
      });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      console.log(req.params.id);
      const task = await Task.findByIdAndDelete(req.params.id);
      res.send({ message: "Task deleted success", task: task });
    } catch (e) {
      res.send({ error: e.message });
    }
  });
  module.exports = router;