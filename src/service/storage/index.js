const cloudinary = require("cloudinary");
const { CLOUD_NAME, API_KEY, API_SECRET } = require("../../config/index");
const streamifier = require("streamifier");

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({
      folder: "post"
    },
    (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const upload = async (files) => {
  const results = [];
  for (const file of files) {
    const result = await streamUpload(file);
    results.push(result.url);
  }
  return results;
};

const uploadSingle = async (file) => {
  const result = await streamUpload(file);
  return result.url;
};

module.exports.upload = upload;
module.exports.uploadSingle = uploadSingle;
