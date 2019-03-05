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

// Get List of catalog items from Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-listcatalog) 
// The parameter represents what type of Catalog entries to list.  It could be a single type such as ITEM or it could be
// a comma separated list of types.  A sample invocation of this api follows 
// GET https://connect.squareup.com/v2/catalog/list?types=category,tax
// Code modelled after example found here https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#listCatalog
router.get('/list_catalog', function(req, res, next) {
	// Set the app and location ids for sqpaymentform.js to use
	let queryTypes = req.query.types;
	if (typeof types != 'undefined') { // types not specified as query param
	   return res.sendStatus(400);
	}
	
		
	var catalog_api = new squareConnect.CatalogApi();
	var opts = { 
	 'cursor': "", // String | The pagination cursor returned in the previous response. Leave unset for an initial request. See [Paginating results](#paginatingresults) for more information.
  	 'types': queryTypes // String | An optional case-insensitive, comma-separated list of object types to retrieve, for example `ITEM,ITEM_VARIATION,CATEGORY`.  The legal values are taken from the [CatalogObjectType](#type-catalogobjecttype) enumeration, namely `\"ITEM\"`, `\"ITEM_VARIATION\"`, `\"CATEGORY\"`, `\"DISCOUNT\"`, `\"TAX\"`, `\"MODIFIER\"`, or `\"MODIFIER_LIST\"`.
	};
	
	// List catalog entries
	catalog_api.listCatalog(opts).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
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
