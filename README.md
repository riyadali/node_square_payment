# node_square_payment
Interface into Square backend for processing credit card payment
Modelled after https://github.com/square/connect-api-examples/tree/master/connect-examples/v2/node_payment


# Payment processing example: Node JS

* Open `config.json` and fill in values for squareApplicationId & squareAccessToken & squareLocationId
with both your sandbox and production credentials.
<b>WARNING</b>: never upload `config.json` with your credentials/access_token.

* Open your terminal and type the following to install the packages:
```
npm install
```

* Then to run the server in production mode:
```
npm start
```
Or to run in sandbox mode:
```
npm test
```

* Open a browser and navigate to [localhost:3000](localhost:3000)

* [Testing using the API sandbox](https://docs.connect.squareup.com/articles/using-sandbox)
