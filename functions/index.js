const functions = require("firebase-functions");
const lib = require("./lib");
const formidable = require("formidable");
const util = require("util");
const superagent = require("superagent");
var fs = require("fs");
const cors = require("cors")({ origin: true });
const sha1 = require("sha1");
const cloudinary = require("cloudinary");

exports.uploadImage = functions.https.onRequest((request, response) => {
  //request includes file and form fields - to read it we are using formidable
  cors(request, response, () => {
    // by default cant request an endpt outside of domain
    //cors is a middleware that turns on the header to allow cross origins
    //grabs the response and adds header that says 'allow origin *'
    const form = new formidable.IncomingForm(); //formidable pulls out the fields and the files

    form.parse(request, function(err, fields, files) {
      const image = fs.createReadStream(files.file.path);
      //cloudName, url, timestamp, uploadPreset will all be packaged into the upload request
      const cloudName = "noorulain"; //uniquely identifies account

      //Constant string for uploading resource type can be many. image/pdf/video
      const url =
        "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";

      //Requires a timestamp in seconds, so it's necessary to divide by 1000
      const timestamp = Date.now() / 1000;

      //Found in settings as well
      const uploadPreset = "pvfhdtk2";

      //Next create a parameter string
      //Everything is in key:value pairs - it is a url param
      const paramStr =
        "timestamp=" +
        timestamp +
        "&upload_preset=" +
        uploadPreset +
        "ZoD3Vr3GEPRLq3dZdZCaiJbuwCY";

      //Next encrypt using sha1 encryption --sha1 is a function
      //This converts paramStr to sha1 signature --encrypted str is what goes to cloudinary
      //It is their form of security
      const signature = sha1(paramStr);

      //Prepare JSON with params
      const params = {
        api_key: "493184569883823",
        timestamp: timestamp,
        upload_preset: "pvfhdtk2",
        signature: signature
      };

      //********************READY TO UPLOAD FILE USING ABOVE INFORMATION **********************/
      //Superagent documentation:
      //https://visionmedia.github.io/superagent/

      let uploadRequest = superagent.post(url); //Request made
      //Cloudinary requirement to name the file 'file'
      //Key has to be file and the value is an image
      uploadRequest.attach("file", image); // Upload file, attach is specific to superagent

      //For every upload request, we are sending the key:value from params; loop created in the event we decide to allow users to upload multiple images.
      Object.keys(params).forEach(key => {
        uploadRequest.field(key, params[key]); //Rield is specific to superagent
      });

      uploadRequest.end((err, resp) => {
        //'end' sends the request
        if (err) {
          response.status(500).send(err);
        }
        response.json(resp); //resp.body.text
      });
    });
  });
});

exports.uploadCanvas = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    // by default cant request an endpt outside of domain
    //cors is a middleware that turns on the header to allow cross origins
    //grabs the response and adds header that says 'allow origin *'
    const form = new formidable.IncomingForm(); //formidable pulls out the fields and the files
    form.parse(request, function(err, fields, files) {
      //console.log(fields.file);
      //const image = fs.createReadStream(fields.file);
      const field = fields.file;
      const image = field;

      cloudinary.config({
        cloud_name: "noorulain",
        api_key: "493184569883823",
        api_secret: "ZoD3Vr3GEPRLq3dZdZCaiJbuwCY"
      });

      cloudinary.v2.uploader.upload(image, function(error, result) {
        response.json(result.url);
      });
    });
  });
});
