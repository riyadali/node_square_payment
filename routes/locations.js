var auth = require('./auth');
var router = require('express').Router();

//var config = require('../config.js')[process.env.NODE_ENV];

// API interface documented here https://docs.connect.squareup.com/api/connect/v2#navsection-locations
router.get('/', function(req, res, next) {

// in case list location by id is implemented
// router.get('/object/:id', function(req, res, next) {

  /*
	let queryRelated = req.query.include_related_objects;
	var opts = { 	
  	 'includeRelatedObjects': false // defaults to not include related objects 
	};
	if (typeof queryRelated !== 'undefined') { // include_related not specified as query param
	   if (queryRelated === 'true') {
	     opts.includeRelatedObjects = true;
	   }
	}
  */
		
		
	var locations_api = new squareConnect.LocationsApi();
	
	
	// List locations
	//catalog_api.retrieveCatalogObject(req.params.id,opts).then(function(data) {
  locations_api.listLocations().then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});
