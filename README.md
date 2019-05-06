# Auth Server for PubNub apps

Node/Express server that uses Passport JWT for user registration and login. Mongo/Mogoose to store registered User data. Server grants read/write access to PubNub using the JWT Bearer token as the authkey. Grants are currently only to the channel 'global_channel'

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Dependencies

These are all included in the package.json and you only need to run npm install

```
bcryptjs : https://www.npmjs.com/package/bcrypt
body-parser : https://www.npmjs.com/package/body-parser
express : https://www.npmjs.com/package/express
gravatar : https://www.npmjs.com/package/gravatar
jsonwebtoken : https://www.npmjs.com/package/jsonwebtoken
mongoose : https://www.npmjs.com/package/mongoose
passport : https://www.npmjs.com/package/passport
pubnub : https://www.npmjs.com/package/pubnub
validator : https://www.npmjs.com/package/validator
```

### Installing

```
run npm install in the root directory
```

### Setup

You will need a PubNub account and keys with PubNub Access Manager enabled
To sign up go here: https://dashboard.pubnub.com/login

You will need MongoDB, I recommend using mLab www.mlab.com

- Create a new database
- Create a new database user

Once you have signed up for PubNub and have your database ready, you can edit the keys_dev.js file. You will need to add the following keys:

```
mongoURI: URI_TO_YOUR_MONGO_DB,
publish: PUBNUB_PUBLISH_KEY,
subscribe: PUBNUB_SUBSCRIPT_KEY,
secret: PUBNUB_SECRET_KEY
```

On your client in your login method you will receive a JWT Token in your response, you will need to use this token as your authkey when initializing PubNub on your client.

This example shows calling the api, receiving the token from the response, storing it to local storage,

```
.post('/api/users/login', userData)
.then(res => {
const { token } = res.data;
//store token to local storage
localStorage.setItem('jwtToken', token);
//set token to auth header
setAuthToken(token);
})
```

You can use jwt-decode to decode the token and access the user data
https://www.npmjs.com/package/jwt-decode
