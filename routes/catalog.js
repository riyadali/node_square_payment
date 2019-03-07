var auth = require('./auth');
var router = require('express').Router();

var config = require('../config.js')[process.env.NODE_ENV];

// Delete catalog object from Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-deletecatalogobject
// A sample invocation of this api follows 
// DELETE https://connect.squareup.com/v2/catalog/object/{object_id}
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#deletecatalogobject
router.delete('/object/:id', auth.required, function(req, res, next) {
	
  	var catalog_api = new squareConnect.CatalogApi();
	
	if (req.payload.username!="TommyCat") {
	  return res.sendStatus(403);
	}
	
	// Delete catalog entry
	catalog_api.deleteCatalogObject(req.params.id).then(function(data) {
	      //console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
});

// Batch delete catalog object from Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-batchdeletecatalogobjects
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/batch-delete
/* {
  	"object_ids": [
	  "W62UWFY35CWMYGVWK6TWJDNI",
	  "AA27W3M2GGTF3H6AVPNB77CK"
	]    	
  }
*/
// Code modelled after example found here 
// https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-batchdeletecatalogobjects
router.post('/batch-delete', auth.required, function(req,res,next){
	var catalog_api = new squareConnect.CatalogApi();
	
	if (req.payload.username!="TommyCat") {
	  return res.sendStatus(403);
	}
	
	
	// Delete a batch of catalog objects
	//console.log("Incoming request to batchDelete..."+JSON.stringify(req.body))
	catalog_api.batchDeleteCatalogObjects(req.body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

// Get catalog object from Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-retrievecatalogobject
// A sample invocation of this api follows 
// GET https://connect.squareup.com/v2/catalog/object/{object_id}?include_related_objects=true
// Code modelled after example found here https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#retrievecatalogobject
router.get('/object/:id', function(req, res, next) {	
	let queryRelated = req.query.include_related_objects;
	var opts = { 	
  	 'includeRelatedObjects': false // defaults to not include related objects 
	};
	if (typeof queryRelated !== 'undefined') { // include_related not specified as query param
	   if (queryRelated === 'true') {
	     opts.includeRelatedObjects = true;
	   }
	}
		
		
	var catalog_api = new squareConnect.CatalogApi();
	
	
	// List catalog entries
	catalog_api.retrieveCatalogObject(req.params.id,opts).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

// Get List of catalog items from Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-listcatalog) 
// The parameter represents what type of Catalog entries to list.  It could be a single type such as ITEM or it could be
// a comma separated list of types.  A sample invocation of this api follows 
// GET https://connect.squareup.com/v2/catalog/list?types=category,tax
// Code modelled after example found here https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#listCatalog
router.get('/list-catalog', function(req, res, next) {	
	let queryTypes = req.query.types;
	//console.log("query string ..."+JSON.stringify(req.query));
	//console.log("type of query types"+typeof queryTypes);
	//console.log("type of junk"+typeof queryTes);
	if (typeof queryTypes === 'undefined') { // types not specified as query param
	   //console.log('sending response of 400');
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

// Add catalog object to Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-upsertcatalogobject
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/object
/* {
  	"idempotency_key": "af3d1afc-7212-4300-b463-0bfc5314a5ae",
  	"object": {
    		"type": "ITEM",
    		"id": "#Cocoa",
    		"item_data": {
			"name": "Cocoa",
      			"description": "Hot chocolate",
      			"abbreviation": "Ch"
    		}
  	}
  }
*/
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#upsertcatalogobject
router.post('/object', auth.required, function(req,res,next){
	var idempotency_key = require('crypto').randomBytes(64).toString('hex');
	var request_body = req.body;
  	request_body.idempotency_key = idempotency_key;
	
	var catalog_api = new squareConnect.CatalogApi();
	
	//console.log("User from token is..."+JSON.stringify(req.payload));
	
	if (req.payload.username!="TommyCat") {
	  return res.sendStatus(403);
	}
	
	
	// Add catalog object
	catalog_api.upsertCatalogObject(request_body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

module.exports = router;
