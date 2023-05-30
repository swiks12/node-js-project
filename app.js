const express = require("express");
const mongoose = require("mongoose");
const taskRouter = require("./routes/task");
const userRouter = require("./routes/user");
const multer = require("multer");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/DWIT")
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err.message));

app.use(express.json());//middleware to use in body

app.use("/api/task", taskRouter);
app.use("/api/user", userRouter);

const User = [];
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + file.originalname;
    req.filename = filename;
    cb(null, filename);
  },
});
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|docx|txt)$/)) {
    cb(new Error("Only image,pdf,text and word files!"), false);
  } else {
    cb(null, true);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.post("/upload", upload.array("file",3), (req, res) => {
  console.log(req.files);
  User.push({
    userid: req.body.userid,
    username: req.body.username,
    displayfile: req.files.map((file)=> file.filename),
  });
  res.send({
    msg: "File uploaded",
    User,
  });
});

app.listen(3000, () => console.log("Server running"));

//vivid dream - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDcyMTk5OTc2YzFmNTg0MGNlMjI1ZDUiLCJpYXQiOjE2ODUxOTkyNzAsImV4cCI6MTY4NTQ1ODQ3MH0.p3DEP8TiSETmuRm0AMLO8P345oXJRUFLe5IZsTYje9c