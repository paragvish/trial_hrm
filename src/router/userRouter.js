const {Userinfo  }= require('../../models/all-models')
const app = require('../../index')
module.exports =function(app) {
    //free trial 15 days login
    app.post('/details', async (req, res) => {

        const { email, companyName, contactPerson, mobile, city } = req.body
        let data = await Userinfo.create({
            email,
            companyName,
            contactPerson,
            mobile,
            city,
            subscription: "trial",
            subscription_End:Date.now()+ 15*24*60*60*1000


        })

        res.status(201).json(
            { message: "Response submitted succesfully" }
        )


    })

app.get('/', async (req,res)=>{})


}