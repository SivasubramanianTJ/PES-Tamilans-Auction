import multer from "multer";

console.log("UPLOAD MIDDLEWARE LOADED");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log("DESTINATION");
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    console.log("FILENAME");
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
});