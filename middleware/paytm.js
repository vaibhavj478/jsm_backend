const Paytm = require('paytm-pg-node-sdk');



const getPayment = async(req,res)=>{

    try {

        console.log(Paytm);
        
    } catch (error) {
        console.log(error.message)
    }

}