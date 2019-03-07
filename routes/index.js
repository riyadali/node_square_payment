var express = require('express');
var router = express.Router();
var auth = require('./auth');

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
