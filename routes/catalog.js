var auth = require('./auth');
var router = require('express').Router();

var config = require('../config.js')[process.env.NODE_ENV];

//***
// Update functions

// Update item tax for object in Square (refer to 
// https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-updateitemtaxes
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/update-item-taxes
/* {
  "item_ids": [
    "H42BRLUJ5KTZTTMPVSLFAACQ",
    "2JXOBJIHCWBQ4NZ3RIXQGJA6"
  ],
  "taxes_to_enable": [
    "4WRCNHCJZDVLSNDQ35PP6YAD"
  ],
  "taxes_to_disable": [
    "AQCEGCEBBQONINDOHRGZISEX"
  ]
}
*/
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#updateitemtaxes
router.post('/update-item-taxes', auth.required, function(req,res,next){
	var catalog_api = new squareConnect.CatalogApi();
	
	//console.log("User from token is..."+JSON.stringify(req.payload));
	
	if (req.payload.username!="TommyCat") {
	  return res.sendStatus(403);
	}
	
	
	// Add catalog object
	catalog_api.updateItemTaxes(req.body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

// Update item modifier lists (for example sweetner or milk choices) for object in Square (refer to 
// https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-updateitemmodifierlists
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/update-item-modifier-lists
/* {
  "item_ids": [
    "H42BRLUJ5KTZTTMPVSLFAACQ",
    "2JXOBJIHCWBQ4NZ3RIXQGJA6"
  ],
  "modifier_lists_to_enable": [
    "H42BRLUJ5KTZTTMPVSLFAACQ",
    "2JXOBJIHCWBQ4NZ3RIXQGJA6"
  ],
  "modifier_lists_to_disable": [
    "7WRC16CJZDVLSNDQ35PP6YAD"
  ]
}
*/
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#updateitemmodifierlists
router.post('/update-item-modifier-lists', auth.required, function(req,res,next){
	var catalog_api = new squareConnect.CatalogApi();
	
	//console.log("User from token is..."+JSON.stringify(req.payload));
	
	if (req.payload.username!="TommyCat") {
	  return res.sendStatus(403);
	}
	
	
	// Add catalog object
	catalog_api.updateItemModifierLists(req.body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

//***
// Delete functions

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
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#batchdeletecatalogobjects
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

//***
// Retrieval functions (includes search)

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

// Search for objects in catalog stored on Square (refer to 
// https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-searchcatalogobjects
//
// Search supports many query types such as: CatalogQuerySortedAttribute, CatalogQueryExact, CatalogQueryRange, 
// CatalogQueryText, CatalogQueryItemsForTax, and CatalogQueryItemsForModifierList.
//
// You can find documentation of how to set up the query by starting here 
// https://docs.connect.squareup.com/api/connect/v2#type-catalogquery
// For example a prefix query is documented here https://docs.connect.squareup.com/api/connect/v2#type-catalogqueryprefix
//
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/search
/* {
  "object_types": [
    "ITEM"
  ],
  "query": {
    "prefix_query": {
      "attribute_name": "name",
      "attribute_prefix": "tea"
    }
  },
  "limit": 100
}
*/
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#searchcatalogobjects
router.post('/search', function(req,res,next){
	// console.log("Incoming request to search..."+JSON.stringify(req.body));
	var catalog_api = new squareConnect.CatalogApi();
	
	// Retrieve a batch of catalog objects	
	catalog_api.searchCatalogObjects(req.body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

// Batch retrieve catalog object from Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-batchretrievecatalogobjects
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/batch-retrieve
/* {
  	"object_ids": [
	  "W62UWFY35CWMYGVWK6TWJDNI",
	  "AA27W3M2GGTF3H6AVPNB77CK"
	],
	"include_related_objects": true
  }
*/
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#batchretrievecatalogobjects
router.post('/batch-retrieve', function(req,res,next){
	var catalog_api = new squareConnect.CatalogApi();
	
	// Retrieve a batch of catalog objects	
	catalog_api.batchRetrieveCatalogObjects(req.body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

//***
// Add functions

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

// Add a batch of catalog object to Square (refer to https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-batchupsertcatalogobjects
// A sample invocation of this api follows 
// POST https://connect.squareup.com/v2/catalog/batch-upsert
/* {
  "idempotency_key": "789ff020-f723-43a9-b4b5-43b5dc1fa3dc",
  "batches": [
    {
      "objects": [
        {
          "type": "ITEM",
          "id": "#Tea",
          "present_at_all_locations": true,
          "item_data": {
            "name": "Tea",
            "description": "Hot Leaf Juice",
            "category_id": "#Beverages",
            "tax_ids": [
              "#SalesTax"
            ],
            "variations": [
              {
                "type": "ITEM_VARIATION",
                "id": "#Tea_Mug",
                "present_at_all_locations": true,
                "item_variation_data": {
                  "item_id": "#Tea",
                  "name": "Mug",
                  "pricing_type": "FIXED_PRICING",
                  "price_money": {
                    "amount": 150,
                    "currency": "USD"
                  }
                }
              }
            ]
          }
        },
        {
          "type": "ITEM",
          "id": "#Coffee",
          "present_at_all_locations": true,
          "item_data": {
            "name": "Coffee",
            "description": "Hot Bean Juice",
            "category_id": "#Beverages",
            "tax_ids": [
              "#SalesTax"
            ],
            "variations": [
              {
                "type": "ITEM_VARIATION",
                "id": "#Coffee_Regular",
                "present_at_all_locations": true,
                "item_variation_data": {
                  "item_id": "#Coffee",
                  "name": "Regular",
                  "pricing_type": "FIXED_PRICING",
                  "price_money": {
                    "amount": 250,
                    "currency": "USD"
                  }
                }
              },
              {
                "type": "ITEM_VARIATION",
                "id": "#Coffee_Large",
                "present_at_all_locations": true,
                "item_variation_data": {
                  "item_id": "#Coffee",
                  "name": "Large",
                  "pricing_type": "FIXED_PRICING",
                  "price_money": {
                    "amount": 350,
                    "currency": "USD"
                  }
                }
              }
            ]
          }
        },
        {
          "type": "CATEGORY",
          "id": "#Beverages",
          "present_at_all_locations": true,
          "category_data": {
            "name": "Beverages"
          }
        },
        {
          "type": "TAX",
          "id": "#SalesTax",
          "present_at_all_locations": true,
          "tax_data": {
            "name": "Sales Tax",
            "calculation_phase": "TAX_SUBTOTAL_PHASE",
            "inclusion_type": "ADDITIVE",
            "percentage": "5.0",
            "applies_to_custom_amounts": true,
            "enabled": true
          }
        }
      ]
    }
  ]
}
*/
// Code modelled after example found here 
// https://github.com/square/connect-javascript-sdk/blob/master/docs/CatalogApi.md#batchupsertcatalogobjects
router.post('/batch-upsert', auth.required, function(req,res,next){
	var idempotency_key = require('crypto').randomBytes(64).toString('hex');
	var request_body = req.body;
  	request_body.idempotency_key = idempotency_key;
	
	var catalog_api = new squareConnect.CatalogApi();
	
	//console.log("User from token is..."+JSON.stringify(req.payload));
	
	if (req.payload.username!="TommyCat") {
	  return res.sendStatus(403);
	}
	
	
	// Add a batch of catalog objects to Square
	//console.log("Incoming request to batchUpsert..."+JSON.stringify(req.body))
	catalog_api.batchUpsertCatalogObjects(request_body).then(function(data) {
  	      return res.json(data);
	}, function(error) {
  	     return next(error);
	});
	
});

module.exports = router;
