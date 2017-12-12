const functions = require("firebase-functions");
const lib = require("./lib");
const formidable = require("formidable");
const util = require("util");
const superagent = require("superagent");
var fs = require("fs");
const cors = require("cors")({ origin: true });
const sha1 = require("sha1");
const cloudinary = require("cloudinary");
const express = require("express");
const Busboy = require("busboy");
const getRawBody = require("raw-body");
const contentType = require("content-type");
const path = require("path");
const os = require("os");
const env = require("dotenv");

//format of keys stored on firebase fucnctions cli
// {
//   "cloudinary": {
//     "key": "xxxxxxxxx",
//     "secret": "xxxxxxxxxx",
//     "cloudname": 'xxx'
//   }
// }
const cloudinaryConfig = functions.config().cloudinary || {}; //local/production
if (Object.keys(cloudinaryConfig).length === 0) {
  //local env
  env.config();
  cloudinaryConfig.key = process.env.CLOUDINARY_KEY;
  cloudinaryConfig.secret = process.env.CLOUDINARY_SECRET;
  cloudinaryConfig.cloudname = process.env.CLOUDINARY_CLOUDNAME;
}

const app = express();

app.use(function (req, res, next) {
  //add headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(function (req, res, next) {
  if (
    req.rawBody === undefined &&
    req.method === "POST" &&
    req.headers["content-type"] !== undefined &&
    req.headers["content-type"].startsWith("multipart/form-data")
  ) {
    getRawBody(
      req,
      {
        length: req.headers["content-length"],
        limit: "10mb",
        encoding: contentType.parse(req).parameters.charset
      },
      function (err, string) {
        if (err) {
          return next(err);
        }
        req.rawBody = string;
        next();
      }
    );
  } else {
    next();
  }
});

app.post("/uploadImage", (req, res) => {
  if (req.method === "POST") {
    var busboy = new Busboy({ headers: req.headers });
    // This object will accumulate all the uploaded files, keyed by their name
    const uploads = {};

    // This callback will be invoked for each file uploaded
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      // os.tmpdir() is an in-memory file system, so should only
      // be used for files small enough to fit in memory.
      const filepath = path.join(os.tmpdir(), fieldname);
      uploads[fieldname] = { file: filepath };
      file.pipe(fs.createWriteStream(filepath));
    });

    // This callback will be invoked after all uploaded files are saved.
    busboy.on("finish", () => {
      //assuming we have multiple files
      for (const name in uploads) {
        const upload = uploads[name];
        const file = upload.file;
        cloudinary.config({
          cloud_name: cloudinaryConfig.cloudname,
          api_key: cloudinaryConfig.key,
          api_secret: cloudinaryConfig.secret
        });

        cloudinary.v2.uploader.upload(file, function (error, result) {
          if (error) console.log("ERROR ON UPLOAD", error);
          res.json(result);
        });
      }
    });

    // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
    // a callback when it's finished.
    busboy.end(req.rawBody, console.log);
  } else {
    // Client error - only support POST
    res.status(405).end();
  }
});
exports.api = functions.https.onRequest(app);
