var express = require('express');
var router = express.Router();
var util = require('util');

var app = express();
var config = require('.././config.js')[app.get('env')];

/* GET home page. */
router.get('/', function(req, res, next) {
	// Set the app and location ids for sqpaymentform.js to use
	res.render('index', {
		'title': 'Make Payment',
		'square_application_id': config.squareApplicationId,
		'square_location_id': config.squareLocationId
	});
});

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

// Controller that handles interface with Square's checkout API.
// On the client side an order is generated and then passed to the controller  (Currently no order details is passed in.
// A contrived order is created and sent to the checkout api .. but hopefully this will change in the future so that
// the client's order is captured and then sent to Square's checkoput)

 router.post('/process-checkout', function(req,res,next){
 
  var idempotency_key = require('crypto').randomBytes(64).toString('hex');
  var request_body = {
      idempotency_key: idempotency_key,
      order: {
        reference_id: 'reference_id',
        line_items: [
          {
            name: 'Printed T Shirt',
            quantity: '2',
            base_price_money: {amount: 1500, currency: 'USD'},
            discounts: [
              {
                name: '7% off previous season item',
                percentage: '7'
              },
              {
                name: '$3 off Customer Discount',
                amount_money: {amount: 300, currency: 'USD'}
              }
            ]
          },
          {
            name: 'Slim Jeans',
            quantity: '1',
            base_price_money: {amount: 2500, currency: 'USD'}
          },
          {
            name: 'Woven Sweater',
            quantity: '3',
            base_price_money: {amount: 3500, currency: 'USD'},
            discounts: [
              {
                name: '$11 off Customer Discount',
                amount_money: {amount: 1100, currency: 'USD'}
              },
              {
                name: 'Fair Trade Tax',
                percentage: '5'
              }
            ]
          },
        ],
        discounts: [
          {
            name: "Father's day 12% OFF",
            percentage: '12'
          },
          {
            name: 'Global Sales $55 OFF',
            amount_money: {amount: 5500, currency: 'USD'}
          }
        ],
        taxes: [
          {
            name: 'Sales Tax',
            type: 'ADDITIVE',
            percentage: '8.5'
          }
        ]
      },
      ask_for_shipping_address: true,
      merchant_support_email: 'merchant+support@website.com',
      pre_populate_buyer_email: 'example@email.com',
      pre_populate_shipping_address: {
        address_line_1: '1455 Market St',
        address_line_2: 'Suite 600',
        locality: 'San Francisco',
        administrative_district_level_1: 'CA',
        postal_code: '94103',
        country: 'US',
        first_name: 'Jane',
        last_name: 'Doe'
      }
      // redirect_url: 'https://www.example.com/checkout-order-confirm'
    }; // end definition of request body 

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
