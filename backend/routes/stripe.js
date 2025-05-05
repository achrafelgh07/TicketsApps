const express = require('express');
const Stripe= require('stripe');
const router = express.Router();

const stripe = Stripe('sk_test_51RLUWJCWsIDMw35kF0wejtEXjx6BJ3F2LnhE0ZCPQdrqcUyVWE46kxbglhMQXEDqgO0nEN0sM1yphWG1yjKek6TC00bUSrmBeD');

router.post('/create-payment-intent', async(req, res)=> {
    const {amount } = req.body;

    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'mad',
            payment_method_types: ['card'],
        });

        res.send({ clientSecret: paymentIntent.client_secret });

    }catch(err){
        res.status(400).send({ error: err.message});
    }
});

module.exports = router;