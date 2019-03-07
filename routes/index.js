var express = require('express');
var router = express.Router();
var auth = require('./auth');


/* GET home page. */
router.get('/', function(req, res, next) {
	// Set the app and location ids for sqpaymentform.js to use
	res.render('index', {
		'title': 'Make Payment',
		'square_application_id': config.squareApplicationId,
		'square_location_id': config.squareLocationId
	});
});

router.use('/transaction', require('./transaction'));
router.use('/checkout', require('./checkout'));
router.use('/catalog', require('./catalog'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
