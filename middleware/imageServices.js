const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// models
const Category = require("../models/category.model");

const Product = require("../models/product.model");

dotenv.config()

const PORT = process.env.PORT || 8000

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        
        // Check if directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it does not exist
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Initialize multer with the storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


// Define the upload route
//app.post('/upload', upload.single('file'),

const uploadCB = async (req, res) => {
    try {
        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Endpoint to get the list of image URLs
//app.get('/images', 
// const getImages = async (req, res) => {
//     fs.readdir('uploads/', (err, files) => {
//         if (err) {
//             return res.status(500).json({ message: 'Unable to scan directory', error: err });
//         }
//         const imageUrls = files.map(file => `http://localhost:${PORT}/uploads/${file}`);
//         res.status(200).json({
//             success: true,
//             images: imageUrls
//         });
//     });

// }

const getImages = async (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to scan directory', error: err });
        }
        
        // Use the base URL from the request headers
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrls = files.map(file => `${baseUrl}/uploads/${file}`);
        
        res.status(200).json({
            success: true,
            images: imageUrls
        });
    });
};


const delImages = async (req, res) => {
    try {
        // Find the category with the given bannerUrl
        //   const category = await Category.findOne({ bannerUrl: req.body.url });
        const categories = await Category.find({ bannerUrl: req.body.url });
        let usedName = []
        if (categories.length > 0) {
            // If category is found, send the name back as a response
            const categoryNames = categories.map(category => category.name);
            usedName = [...usedName, ...categoryNames]
        }

        const products = await Product.find({ "media.picUrl": req.body.url })
            .populate('category', 'name') // Populate the 'category' field with only the 'name'
            .select('title category'); // Select only the 'title' and 'category' fields

        if (products.length > 0) {
            const productNames = products.map(product => (`${product.title}- ${product.category.name}`));
            usedName = [...usedName, ...productNames]
        }

        if(usedName.length > 0){
            res.status(200).send({
                success: false,
                url: req.body.url,
                data: usedName,
                message: "File not deleted"
            });
            return
        }
      

        /////////
            console.log(req.body.url.split('/')[req.body.url.split('/').length -1])

        // Construct the full path to the file in the uploads directory
        const filePath = path.join(__dirname, 'uploads', req.body.url.split('/')[req.body.url.split('/').length -1]);
        console.log(filePath)
        // Check if the file exists
        fs.access('uploads/', fs.constants.F_OK, (err) => {
            if (err) {
                // If the file does not exist, send a 404 status with an appropriate message
                return res.status(404).send({   success: false,
                    url: req.body.url,
                    data: usedName, message: 'File not found' });
            }

            // If the file exists, delete it
            fs.unlink(`uploads/${req.body.url.split('/')[req.body.url.split('/').length -1]}`, (err) => {
                if (err) {
                    // Handle any errors that occur during the deletion process
                    return res.status(200).json({ 
                        success: false,
                        url: req.body.url,
                        data: usedName,
                        error: 'An error occurred while deleting the file' });
                }

                // Send a success message if the file was deleted successfully
                // res.json({ message: 'File deleted successfully' });
                res.status(200).send({
                    success: true,
                    url: req.body.url,
                    data: usedName,
                    message: 'File deleted successfully'
                });
            });
        });






        ////////
    } catch (error) {
        console.log(error.message);
    }

}






module.exports = {
    uploadCB,
    upload,
    getImages,
    delImages
}