const Bill = require("../models/bill.model");

const User = require("../models/user.model");


const   moment  =  require("moment");


const createBill = async (req, res) => {
    try {
        console.log(req.body)

        let { name, fatherName, post, number, villageName, id } = req.body.customer

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
        if (id == "") {
            const matchingUsers = await User.findOne({ name, fatherName, post, number, villageName });

            if (matchingUsers) {

                return res.status(200).send({
                    success: false,
                    msg: "Customer Is Already Present"
                });
            }
        }


        let user = null

        if (id != "") {


            const matchingUsers = await User.findOne({ name, fatherName, post, number, villageName });

            if (matchingUsers && id != matchingUsers._id) {

                return res.status(200).send({
                    success: false,
                    msg: "Can't Update Customer"
                });
            }


            user = await User.findById({ _id: id });

            // await user.save();
        } else {

            user = new User({ name, fatherName, post, number, villageName })

            // await user.save();
        }

        const bill = new Bill({ products: req.body.products, totalAmount: req.body.totalAmount, createdAt: req.body.createdAt, paid: req.body.paid })

        if (Number(bill.paid) > 0) {
            bill.installment.push({ amount: Number(bill.paid) });
        }

        bill.customer = user._id

        await bill.save();

        user.bills.push(bill._id);

        await user.save();


        res.status(200).send(({
            success: true,
            msg: "Bill is Added",
            bill,
            user
        }));

    } catch (error) {

        console.log(error.message);
    }

}


const getBillByCoustomers = async (req, res) => {
    try {

        console.log(req.body)
        res.send(({
            success: true,
            data: req.body
        }));

    } catch (error) {

    }
}


const getAllBillsByFilter = async (req, res) => {
    try {

        console.log(req.body)
        res.send(({
            success: true,
            data: req.body
        }));

    } catch (error) {

    }
}


const getBillById = async (req, res) => {

    try {
        console.log(req.params);
        let bill  = await Bill.findById(req.params.id);

        if(!bill){
           return res.status(200).send(({
                success: false,
                msg:"Bill not found"
            }));
        }

        res.status(200).send(({
            success: true,
            bill
        }));

    } catch (error) {

        console.log(error)
        if (error.name === 'CastError') {
        return  res.status(200).send({
                success:false,
                msg: "Invaild Bill Id"  
                });
        }

        res.status(200).send({
        success:false,
        msg: error.message  
        });
    }

}

const setBillDateById =  async (req, res) => {

    try {
        // console.log(req.params);
        console.log(req.body);

        console.log(moment().utcOffset("+05:30").format())
        console.log(moment().utcOffset("+05:30").format('HH:mm:ss'))
        console.log(moment(req.body.billDate.split("T")[0]+"T"+moment().utcOffset("+05:30").format('HH:mm:ss')+'+05:30').utcOffset("+05:30").format())

        let bill  = await Bill.findById(req.params.id);

        if(!bill){
           return res.status(200).send(({
                success: false,
                msg:"Bill not found"
            }));
        }


        bill.createdAt =  moment(req.body.billDate.split("T")[0]+"T"+moment().utcOffset("+05:30").format('HH:mm:ss')+'+05:30').utcOffset("+05:30").format()

        await bill.save()

        res.status(200).send(({
            success: true,
             msg: "Date is updated",
             bill
        }));

    } catch (error) {

        console.log(error)
        if (error.name === 'CastError') {
        return  res.status(200).send({
                success:false,
                msg: "Invaild Bill Id"  
                });
        }

        res.status(200).send({
        success:false,
        msg: error.message  
        });
    }

}

const delBill = async (req, res) => {

    try {

        console.log(req.parmes);


        res.send(({
            success: true,
            data: req.parmes
        }));

    } catch (error) {

        res.send(({
            success: false,
            msg: error.message
        }));
    }

}

const allBills = async (req, res) => {


    try {
            console.log(req.body);

        let query = [];
        const regex = new RegExp(`${req.body.text}`, "i"); // "i" for case-insensitive matching
        
        if (req.body.text) {
            query = [
                { "customer.name": { $regex: regex } },
                { "customer.fatherName": { $regex: regex } },
                { "customer.post": { $regex: regex } },
                { "customer.number": { $regex: regex } },
                { "customer.villageName": { $regex: regex } },
            ];
        }
        
        // console.log(query);
        
        let matchStage = {};
        if (query.length > 0) {
            matchStage = { $match: { $or: query } };
        } else {
            matchStage = { $match: { } }; // No query conditions if query is empty
        }
        
        let bills = await Bill.aggregate([
            { $addFields: { productsCount: { $size: "$products" } } },
            { $unset: "products" },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: "$customer" },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    totalAmount: 1,
                    paid: 1,
                    totalAmount: 1,
                    installment: 1,
                    productsCount: 1,
                    "customer.name": 1,
                    "customer.fatherName": 1,
                    "customer.post": 1,
                    "customer.number": 1,
                    "customer.villageName": 1,
                }
            },
            matchStage
        ]);
        
        // if (query.length > 0) {
        //     bills = await bills.append();
        // }
        



        bills = bills.filter((el, ind) => {
            // console.log(   new Date(req.body.from) , new Date(el.createdAt)  ,  new Date(req.body.to) )
            if (new Date(req.body.from) <= new Date(el.createdAt) && new Date(el.createdAt) <= new Date(req.body.to)) {
                return el
            }
        })


        res.status(200).send({
            success: true,
            data: bills
        })




    } catch (error) {

        res.status(500).send(({
            success: false,
            msg: error.message
        }));
    }
}


module.exports = {
    createBill,
    getBillById,
    setBillDateById,
    getAllBillsByFilter,
    getBillByCoustomers,
    delBill,

    allBills
}




// await Bill.find(query).populate({
//     path: "customer",
//     select: "_id name fatherName post number villageName" // Add the field names you want to retrieve
// }).sort({ createdAt: -1 });

// await Bill.aggregate([
//     { $match: query }, // Match your query criteria here
//     { $addFields: { productsCount: { $size: "$products" } } }, // Add a new field with the length of the products array
//     { $unset: "products" }, // Remove the products array if you don't need it anymore
//     { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
//     { $lookup: { from: "customers", localField: "customer", foreignField: "_id", as: "customer" } },
//     { $unwind: "$customer" }, // Unwind the customer array if it's an array
//     { $project: { _id: 1, createdAt: 1, customer: 1, productsCount: 1 } } // Project the fields you need
// ]);