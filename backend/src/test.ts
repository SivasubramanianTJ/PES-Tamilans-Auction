import express from "express";
import multer from "multer";

const app = express();

const upload = multer({
  dest: "uploads/",
});

app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    console.log(req.file);
    console.log(req.body);

    res.json({
      file: req.file,
      body: req.body,
    });
  }
);

app.listen(5000, () => {
  console.log("Running on 5000");
});