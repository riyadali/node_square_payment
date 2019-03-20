// from this link https://stackoverflow.com/questions/36962601/node-js-how-to-use-environment-variables-in-json-file
let secret = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
module.exports = { 
            "secret": secret,
            "sandbox": {    
                "squareApplicationId": process.env.APPLICATION_ID_SANDBOX,
                "squareAccessToken": process.env.ACCESS_TOKEN_SANDBOX,
                "squareLocationId": process.env.LOCATION_ID_SANDBOX
            },  
            "production": {     
                "squareApplicationId": process.env.APPLICATION_ID_PROD,
                "squareAccessToken": process.env.ACCESS_TOKEN_PROD,
                "squareLocationId": process.env.LOCATION_ID_PROD
            }
};
