

const Category = require("../models/category.model");

const Product = require("../models/product.model");



const updateProdTitle = async (req, res) => {

    try {

        const { productId } = req.params;
        const {
            title,
            subtitle
        } = req.body || undefined

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).send({ success: false, message: "Product not found." });
        }

        product.title = title
        product.subtitle = subtitle

        await product.save();

        // Get the category ID from the product
        const categoryId = product.category;
        // Remove the product ID from the category's products array
        const category = await Category.findOne({ '_id': categoryId }, "-createdAt -updatedAt -children").populate('products'); // Populate products to return the updated category with product details

    
        if (!category) {
            return res.status(200).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Update Titles.",
            category: category
        });

    } catch (error) {
        console.log(error.message);
    }


}

const updateProdPrice = async (req, res) => {

    try {

        const { productId } = req.params;
        const {
            isBuyable,
            price,
            discountPrice ,
            rating ,
        } = req.body || undefined

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).send({ success: false, message: "Product not found." });
        }

        product.isBuyable = isBuyable
        product.price = price
        product.discountPrice = discountPrice
        product.rating = rating

        await product.save();

        // Get the category ID from the product
        const categoryId = product.category;
        // Remove the product ID from the category's products array
        const category = await Category.findOne({ '_id': categoryId }, "-createdAt -updatedAt -children").populate('products'); // Populate products to return the updated category with product details
    
        if (!category) {
            return res.status(200).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Update Price.",
            category: category
        });

    } catch (error) {
        console.log(error.message);
    }


}
const updateProdDesc = async (req, res) => {

    try {

        const { productId } = req.params;
        const {
            desc1 ,
            desc2,
            desc3,
            notes,
        } = req.body || undefined

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).send({ success: false, message: "Product not found." });
        }

        product.desc1 = desc1
        product.desc2 = desc2
        product.desc3 = desc3
        product.notes = notes

        await product.save();

        // Get the category ID from the product
        const categoryId = product.category;
        // Remove the product ID from the category's products array
        const category = await Category.findOne({ '_id': categoryId }, "-createdAt -updatedAt -children").populate('products'); // Populate products to return the updated category with product details
    
        if (!category) {
            return res.status(200).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Update Desc.",
            category: category
        });

    } catch (error) {
        console.log(error.message);
    }


}
const updateProdMedia = async (req, res) => {

    try {

        const { productId } = req.params;
        const { media } = req.body || undefined

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).send({ success: false, message: "Product not found." });
        }

        product.media = media

        await product.save();

        // Get the category ID from the product
        const categoryId = product.category;
        // Remove the product ID from the category's products array
        const category = await Category.findOne({ '_id': categoryId }, "-createdAt -updatedAt -children").populate('products'); // Populate products to return the updated category with product details
    
        if (!category) {
            return res.status(200).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Update Media.",
            category: category
        });

    } catch (error) {
        console.log(error.message);
    }


}



module.exports = {
    updateProdTitle , 
    updateProdPrice, 
    updateProdDesc,
    updateProdMedia
}