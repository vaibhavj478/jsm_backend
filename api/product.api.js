const Category = require("../models/category.model");

const Product = require("../models/product.model");


// create only catgory by name and store ancestor with level 
const createCat = async (req, res) => {

    try {

        if (req.body.category) {
            let cat = await Category.findOne({ name: req.body.category });
            if (cat) {
                return res.status(200).json({ success: false, msg: "Already Present" });
            }
        }

        if (req.body?.parent) {
            let parent = await Category.findOne({ name: req.body.parent });

            if (!parent) {
                return res.status(200).json({ success: false, msg: "Parent category not found" });
            }

            const newCat = new Category({
                name: req.body.category,
                level: parent.level + 1,
                ancestors: `${parent.ancestors} ${req.body.category}`
            });

            parent.children.push(newCat._id);

            await newCat.save();
            await parent.save();
        } else {
            const newCat = new Category({
                name: req.body.category,
                level: 1,
                ancestors: req.body.category,
            });

            await newCat.save();
        }

        // Return success response
        res.status(201).json({ success: true, msg: "Category created successfully" });

    } catch (error) {
        // Return error response
        res.status(500).json({ success: false, error: error.message });
    }
};

// Recursive function to populate children
const populateChildrenRecursively = async (category) => {
    // await category.populate('children').execPopulate();
    await Category.populate(category, { path: 'children', select: '-createdAt -updatedAt', });
    for (const child of category.children) {
        await populateChildrenRecursively(child);
    }
};


// Function to get all categories with level 1 and populate children recursively
const getCategoriesWithLevelOne = async () => {
    try {
        //   const topLevelCategories = await Category.find({ level: 1 }).populate('children').exec();

        const topLevelCategories = await Category.find({ level: 1 }, "-createdAt -updatedAt").populate('children').exec();

        for (const category of topLevelCategories) {
            await populateChildrenRecursively(category);
        }

        return topLevelCategories;
    } catch (error) {
        throw error;
    }
};


const getCat = async (req, res) => {

    try {
        let data = await getCategoriesWithLevelOne()

        res.status(200).send({ success: true, "category": data });

    } catch (error) {
        // Return error response
        res.status(500).json({ success: false, error: error.message });
    }
}

const getCatLine = async (req, res) => {
    try {
        let data = await Category.find({}, '-createdAt -updatedAt -children')
        res.status(200).send({ success: true, "category": data });
    } catch (error) {
        // Return error response
        res.status(500).json({ success: false, error: error.message });
    }

}

const delCat = async (req, res) => {
    try {

        const category = await Category.findOneAndUpdate(
            { 'children': req.params.id },
            { $pull: { 'children': req.params.id } },
            { new: true }
        );

        if (category) {
            console.log(`Removed child with ID ${req.params.id} from category.`);
        } else {
            console.log(`Category or child not found.`);
        }

        const cat = await Category.findByIdAndDelete(req.params.id)

        res.status(200).send({ success: true, msg: "delete successfully", cat });

    } catch (error) {
        // Return error response
        res.status(500).json({ success: false, error: error.message });
    }

}


// get single category   
const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;

        // Validate that the name parameter is provided
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        // Find the category by name
        const category = await Category.findOne({ name }, "-createdAt -updatedAt -children -__v").populate({
            path: 'products',
            select: '-createdAt -updatedAt -__v'
        });

        // If the category is not found, return a 404 response
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Return the found category
        return res.status(200).json({
                success: false,
                category
            });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error fetching category by name:", error);

        // Return a 500 response in case of server error
        return res.status(500).json({ message: "Server error" });
    }
}

const updateCategoryBasicByName = async (req, res) => {
    try {
        const { name } = req.params;
        const { title, nickname, description } = req.body;

        // Validate request body
        if (!title || !nickname || !description) {
            return res.status(400).send({ success: true, message: "Title, nickname, and description are required." });
        }

        // Find the category by name
        // const category = await Category.findOne({ name } ,"-createdAt -updatedAt -children");
        const category = await Category.findOne({ name }, "-createdAt -updatedAt -children").populate('products');

        if (!category) {
            return res.status(404).send({ success: true, message: "Category not found." });
        }

        // Update the category
        category.title = title;
        category.nickname = nickname;
        category.description = description;

        // Save the updated category
        await category.save();

        // Return the updated category
        return res.status(200).send({ success: true, category });
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Server error." });
    }
};

const updateCategoryBannerByName = async (req, res) => {

    try {
        const { name } = req.params;
        const { bannerType, bannerUrl } = req.body;

        // Validate request body
        if (!bannerType || !bannerUrl) {
            return res.status(400).send({ success: true, message: "Banner Type, , and banner url are required." });
        }

        // Find the category by name
        const category = await Category.findOne({ name }, "-createdAt -updatedAt -children").populate('products');

        if (!category) {
            return res.status(404).send({ success: true, message: "Category not found." });
        }

        // Update the category
        category.bannerType = bannerType;
        category.bannerUrl = bannerUrl;

        // Save the updated category
        await category.save();

        // Return the updated category
        return res.status(200).send({ success: true, category });

    } catch (error) {
        console.log(error.message);
    }

}


const updateCategoryMenusName = async (req, res) => {

    try {
        console.log(req.body);
        const { name } = req.params;
        const {
            menus
        } = req.body;

        // Find the category by name
        // const category = await Category.findOne({ name } ,"-createdAt -updatedAt -children");
        const category = await Category.findOne({ name }, "-createdAt -updatedAt -children")

        if (!category) {
            return res.status(404).send({ success: false, message: "Category not found." });
        }
        // Update the category
        category.menus = menus;

        // Save the updated category
        await category.save();

        // Return the updated category
        return res.status(200).send({ success: true, category });

    } catch (error) {
        console.log(error.message);
    }



}


// Imp need to change 
const createProdSaveCategoryByName = async (req, res) => {

    try {

        console.log(req.body);
        const { name } = req.params;

        const {
            title,
            subtitle,
            price,
            discountPrice,
            desc1,
            desc2,
            desc3,
            notes,
            isActive,
            isBuyable,
            rating,
            media
        } = req.body;


        // Validate the presence of necessary fields
        if (!title || !price || !isActive) {
            return res.status(400).send({
                success: false,
                message: "Title, price, and isActive are required fields.",
            });
        }


        // Find the category by name
        // const category = await Category.findOne({ name } ,"-createdAt -updatedAt -children");
        const category = await Category.findOne({ name }, "-createdAt -updatedAt -children")


        if (!category) {
            return res.status(404).send({ success: false, message: "Category not found." });
        }

        const newProduct = new Product({
            title,
            subtitle,
            price,
            discountPrice,
            desc1,
            desc2,
            desc3,
            notes,
            isActive,
            isBuyable,
            media,
            rating,
            category: category._id,

        });

        // Save the new product
        const savedProduct = await newProduct.save();

        // Add the product ID to the category's products array and save the category
        category.products.push(savedProduct._id);
        await category.save();



        // Populate the products in the category
        const populatedCategory = await Category.findById(category._id, "-createdAt -updatedAt -children").populate('products');
        //await Category.findOne({ name }, "-createdAt -updatedAt -children").populate('products');
        res.status(201).send({
            success: true,
            message: "Product added successfully.",
            category: populatedCategory,
        });

    } catch (error) {
        console.error(`Error : ${error.message}`);
    }

}

const deleteProd = async (req, res) => {

    try {
        const { productId } = req.params;
        // Find the product to get the associated category ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).send({ success: false, message: "Product not found." });
        }
        // Get the category ID from the product
        const categoryId = product.category;
        // Delete the product
        await Product.findByIdAndDelete(productId);
        // Remove the product ID from the category's products array
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { $pull: { products: productId } },
            { new: true } // Return the updated category document + 
        ).populate('products'); // Populate products to return the updated category with product details
        console.log(updatedCategory);
        if (!updatedCategory) {
            return res.status(200).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Product deleted successfully.",
            category: updatedCategory
        });

    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).send({ success: false, message: "An error occurred while deleting the product." });
    }

}
const statusToggleProd = async (req, res) => {

    try {
        const { productId } = req.params;
        // Find the product to get the associated category ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(200).send({ success: false, message: "Product not found." });
        }
        // Get the category ID from the product
        const categoryId = product.category;
        // Delete the product

        // isActive :{ ['active', 'inactive']}
        if (product.isActive == "active") {
            product.isActive = "inactive"
        } else {
            product.isActive = "active"
        }


        await product.save();
        // Remove the product ID from the category's products array
        const category = await Category.findOne({ '_id': categoryId }, "-createdAt -updatedAt -children").populate('products'); // Populate products to return the updated category with product details

        console.log(category);
        if (!category) {
            return res.status(200).send({ success: false, message: "Category not found." });
        }

        res.status(200).send({
            success: true,
            message: "Update Status.",
            category: category
        });

    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).send({ success: false, message: "An error occurred while deleting the product." });
    }

}


module.exports = {
    createCat,
    getCat,
    getCatLine,
    delCat,
    createProdSaveCategoryByName,
    getCategoryByName,
    updateCategoryBasicByName,
    updateCategoryBannerByName,
    updateCategoryMenusName,

    deleteProd,
    statusToggleProd,
}