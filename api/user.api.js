




const User = require("../models/user.model");




const searchUser = async (req, res) => {

    try {

        let { name, fatherName, post, number, villageName } = req.body
        let queryArr = []

        // console.log(req.body);
        if (!name) {
            return res.status(200).send({ success: false, msg: "Name is required" })
        } else {
            // queryArr.push({ name })
            queryArr.push({ name: { $regex: new RegExp(name, 'i') } })
        }

        if (fatherName) {
            queryArr.push({ fatherName: { $regex: new RegExp(fatherName, 'i') } })
        }

        if (post) {
            queryArr.push({ post: { $regex: new RegExp(post, 'i') } })
        }

        if (villageName) {
            queryArr.push({ villageName: { $regex: new RegExp(villageName, 'i') } })
        }
        
        if (number) {
            queryArr.push({ number: { $regex: new RegExp(number, 'i') } })
        }

        // Build the MongoDB query dynamically
        const query = {
            $and: queryArr
        };


        // Find users that match any of the specified fields and get the total count
        const [matchingUsers, totalCount] = await Promise.all([
            User.find(query, '-bills -role -createdAt -updatedAt'),
            User.countDocuments(query),
        ]);
        // Get the total count of users



        res.status(200).send({
            success: true,
            matchingUsers,
            totalCount

        })

    } catch (error) {
        res.status(500).send({
            success: true,
            msg: error.message
        });

    }
}

const createUser = async (req, res) => {
    try {

        let { name, fatherName, post, number, villageName } = req.body

        if (!name) {
            name = "none";
        }

        if (!fatherName) {
            fatherName = "none";
        }

        if (!post) {
            post = "none";
        }

        if (!villageName) {
            villageName = "none";
        }

        if (!number) {
            number = "none";
        }

        // Find users that match any of the specified fields
        const matchingUsers = await User.findOne({ name, fatherName, post, number, villageName });

        if (matchingUsers) {

            return res.status(200).send({
                success: true,
                msg: "already present"
            });
        }

        const user = new User({ name, fatherName, post, number, villageName })

        await user.save();

        res.status(200).send({
            success: true,
            matchingUsers,
            user
        })

    } catch (error) {
        res.status(500).send({
            success: true,
            msg: error.message
        })

    }
}

const getUsers = async (req, res) => {

    try {

        const users = await User.find({}, '-createdAt -updatedAt');

        // Get the total count of users
        const totalCount = await User.countDocuments();

        res.status(200).send({
            success: true,
            users,
            totalCount,
            msg: "get all users"
        });


    } catch (error) {

        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}




module.exports = {
    createUser,
    getUsers,
    searchUser
}