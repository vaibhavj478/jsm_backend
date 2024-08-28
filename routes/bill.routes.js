const express = require("express");

const { createBill,
    getBillById,
    getAllBillsByFilter,
    getBillByCoustomers,
    delBill, 
    allBills , 
    setBillDateById
} = require("../api/bill.api");



const billRoute = express.Router();

// creating the prodType
billRoute.post("/create-bill", createBill);
billRoute.get("/get-by-bill/:id", getBillById);
billRoute.post("/set-bill-date/:id", setBillDateById);
billRoute.post("/get-all-bill", allBills );
billRoute.delete("/del-bill/:id", delBill);
billRoute.get("/get-all-bills-by-filter", getAllBillsByFilter);
billRoute.get("/get-bill-by-coustomers", getBillByCoustomers);

module.exports = billRoute;