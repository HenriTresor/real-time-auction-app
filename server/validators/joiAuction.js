import Joi from "joi";

const auctionValidObject = Joi.object({
    itemName: Joi.string().min(3).max(30).required(),
    itemDescription: Joi.string().min(10).required(),
    itemImage: Joi.string(),
    seller: Joi.string().required(),
    startBid: Joi.number().required(),
    startDate: Joi.date().min(Date.now()).required(),
    endDate: Joi.date().required().when('startDate', {
        is: Joi.date().min(Date.now()).required(),
        then: Joi.date().min(Joi.ref('startDate')).required()
    })
})

export { auctionValidObject }