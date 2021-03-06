var auth = require('./auth');
var router = require('express').Router();

var config = require('../config.js')[process.env.NODE_ENV];

// Controller that handles interface with Square's checkout API.
// On the client side an order is generated and then passed to the controller  (Currently no order details is passed in.
// A contrived order is created and sent to the checkout api .. but hopefully this will change in the future so that
// the client's order is captured and then sent to Square's checkoput)

 router.post('/process-checkout', function(req,res,next){
 
  var idempotency_key = require('crypto').randomBytes(64).toString('hex');
  var request_body = req.body;
  request_body.idempotency_key = idempotency_key;
  
  var checkout_api = new squareConnect.CheckoutApi();
	
  checkout_api.createCheckout(config.squareLocationId, request_body).then(function(data) {
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
