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

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(function(req, res, next) {
  console.log("entered rawBody Middleware");
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
      function(err, string) {
        if (err) {
          return next(err);
        }
        req.rawBody = string;
        console.log("leaving rawBody Middleware");
        next();
      }
    );
  } else {
    next();
  }
});

app.post("/uploadImage", (req, res) => {
  console.log("entered base route");
  if (req.method === "POST") {
    // console.log(req);
    var busboy = new Busboy({ headers: req.headers });
    // This object will accumulate all the uploaded files, keyed by their name
    const uploads = {};

    // This callback will be invoked for each file uploaded
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      console.log("file event fired!!!", file);
      // Note that os.tmpdir() is an in-memory file system, so should only
      // be used for files small enough to fit in memory.
      const filepath = path.join(os.tmpdir(), fieldname);
      uploads[fieldname] = { file: filepath };
      file.pipe(fs.createWriteStream(filepath));
    });

    // This callback will be invoked after all uploaded files are saved.
    busboy.on("finish", () => {
      console.log("busboy finished");
      //assuming we have multiple files
      for (const name in uploads) {
        console.log("looping through uploads", name);
        const upload = uploads[name];
        const file = upload.file;
        console.log("got a file", file);
        cloudinary.config({
          cloud_name: "noorulain",
          api_key: "493184569883823",
          api_secret: "ZoD3Vr3GEPRLq3dZdZCaiJbuwCY"
        });

        cloudinary.v2.uploader.upload(file, function(error, result) {
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

app.post("/uploadCanvas", (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const uploads = {};
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log("file event fired!!!");
    // Note that os.tmpdir() is an in-memory file system, so should only
    // be used for files small enough to fit in memory.
    const filepath = path.join(os.tmpdir(), fieldname);
    uploads[fieldname] = { file: filepath };
    file.pipe(fs.createWriteStream(filepath));
  });
});

// app.post("/uploadCanvas", (request, response) => {
//   console.log("upload canvas");
//   // by default cant request an endpt outside of domain
//   //cors is a middleware that turns on the header to allow cross origins
//   //grabs the response and adds header that says 'allow origin *'
//   const form = new formidable.IncomingForm(); //formidable pulls out the fields and the files
//   form.parse(request, function(err, fields, files) {
//     console.log("!!", fields.file);
//     //const image = fs.createReadStream(fields.file);
//     const field = fields.file;
//     const image = field;

//     cloudinary.config({
//       cloud_name: "noorulain",
//       api_key: "493184569883823",
//       api_secret: "ZoD3Vr3GEPRLq3dZdZCaiJbuwCY"
//     });

//     cloudinary.v2.uploader.upload(image, function(error, result) {
//       response.json(result.url);
//     });
//   });
// });

exports.api = functions.https.onRequest(app);
