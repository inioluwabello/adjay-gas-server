
const express = require("express");
const router = express.Router();
const fs = require('fs');

const multer = require('multer');
const path = require('path');


// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    req.filename = filename; // Save filename to request object
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Route for file upload
router.post('/image/upload', upload.single('file'), (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const filename = req.filename;
    res.status(200).json({ message: "Upload successful", filename });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Server error');
  }
});

router.get('/image/:imageName', (req, res) => {
  try {
    // Get the image name from the URL parameters
    const imageName = req.params.imageName;

    // Construct the path to the image file using the image name
    const imagePath = path.join(__dirname.replace("\\routes", ""), 'uploads', imageName);

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    // Read the image file
    const imageData = fs.readFileSync(imagePath);

    // Determine the content type based on the file extension
    const contentType = getImageContentType(imageName); // Implement getImageContentType to map file extensions to content types

    // Set the appropriate content type in the response header
    res.contentType(contentType);

    // Send the image data as the response
    res.send(imageData);
  } catch (error) {
    console.error('Error reading image file:', error);
    res.status(500).send('Server error');
  }
});

// Function to map file extensions to content types
function getImageContentType(imageName) {
  const extension = path.extname(imageName).toLowerCase();
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream'; // Default to binary data if content type is unknown
  }
}

module.exports = router;