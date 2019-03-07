var auth = require('./auth');
var router = require('express').Router();
var app = express();
var config = require('../config.js')[app.get('env')];

// Controller that handles interface with Square transaction api. 
// On the client side a nonce is generated that is associated with a payment request (credit card)
// This nonce is used here to complete the charge using Suqare's transaction API
router.post('/process-payment', function(req,res,next){
	var request_params = req.body;

	var idempotency_key = require('crypto').randomBytes(64).toString('hex');

	// Charge the customer's card
	var transactions_api = new squareConnect.TransactionsApi();
	var request_body = {
		card_nonce: request_params.nonce,
		amount_money: {
			amount: 100, // $1.00 charge
			currency: 'USD'
		},
		idempotency_key: idempotency_key
	};
	transactions_api.charge(config.squareLocationId, request_body).then(function(data) {
		/*
		var json= JSON.stringify(data);
		res.render('process-payment', {
			'title': 'Payment Successful',
			'result': json
		}); */
		return res.json(data);
	}, function(error) {
		/*
		res.render('process-payment', {
			'title': 'Payment Failure',
			'result': error.response.text
		}
		*/		
		return next(error);
	   }
	);

});

module.exports = router;
