const { Userinfo } = require('../../models/all-models')
const app = require('../../index')
const dayjs = require('dayjs')
const { allConstants, MESSAGE } = require('../../constants/constant')

module.exports = function (app) {
    //free trial 15 days login
    app.post('/register', async (req, res) => {
        const { days } = req.query
        const { email, companyName, contactPerson, employeeCount, mobile, city } = req.body
        let data = await Userinfo.create({
            email,
            companyName,
            contactPerson,
            mobile,
            city,
            employeeCount,
            trialDays: days ? Number(days) : 5
            // subscription_End:Date.now()+ Number(req.params.days)*24*60*60*1000


        })

        //EMAIL SENT logic

        res.status(201).json(
            {
                message: "Response submitted succesfully",
                data: data
            }
        )


    })
    app.get('/all', async (req, res) => {
        let { search, pages, sort, limit, fromDate, endDate } = req.query
        let condition = {}
        //query by dates ranges //by default latest //plan purchased // plan pendings //soon plan over
    
        if (!pages) {
            pages = 1
        }
        if (!limit) {
            limit = 3
        }
        if (search) {
            condition.$or = [
                {
                    "email": { $regex: new RegExp(search.trim(), "i") }
                },
                {
                    "companyName": { $regex: new RegExp(search.trim(), "i") }
                },
                {
                    "subscription": { $regex: new RegExp(search.trim(), "i") }
                },


            ]
        }
        let result = await Userinfo.find(condition).limit(limit).skip((pages - 1) * limit)
        // const dateDiff = Math.abs(new Date(result.subscription_End.toISOString().slice(0, 10)) - new Date(dayjs(Date.now()).toISOString().slice(0, 10))) /
        //     (1000 * 60 * 60 * 24) +
        //     1;
        let result1 = await Userinfo.findAnd({subscription_Start :{$gte: dayjs(Date.now())}})
        let totalrecords = await Userinfo.find(condition).count()

        res.send({ total: totalrecords, result: result, kt:result1 })
        console.log(limit, pages)

    })

    app.get('/register/:id', async (req, res) => {
        try {
            const { id } = req.params
            let data = await Userinfo.findOne({ _id: id })

            return res.status(200).json({
                message: "Data fetch successfully",
                data: data
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: "Internal server error"
            })
        }

    })
    app.put('/register/:id', async (req, res) => {
        try {
            const { id } = req.params
            const { subscription } = req.body

            let result = await Userinfo.findById(id)


            result["subscription_Start"] = Date.now()
            result["subscription_End"] = dayjs(Date.now()) + (Number(result.trialDays) - 1) * 24 * 60 * 60 * 1000
            const dateDiff =
                Math.abs(new Date(result.subscription_End.toISOString().slice(0, 10)) - new Date(dayjs(Date.now()).toISOString().slice(0, 10))) /
                (1000 * 60 * 60 * 24) +
                1;


            result["subscription"] = subscription || allConstants.TRIAL
            result["packageStatus"] = allConstants.ACTIVE
            result["DayLeft"] = dateDiff
            await result.save()


            //EMAIL SENT logic

            return res.status(201).json({
                message: "Updated successful",
                data: result

            })

        }
        catch (error) {
            console.log(error)
            res.status(500).json({
                message: MESSAGE.ERROR_INTERNAL
            }
            )
        }
    })



}