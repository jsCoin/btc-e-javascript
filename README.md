btc-e-javascript
================

BTC-e public and private API JavaScript implementation
https://btc-e.com/api/documentation

Author: jsCoin
BTC : 151vumzopVBZMV9CtswFiumQBbEHcULPnG
LTC : Laoq3qsLvQFCnnbfcFGpQyjy5kcK58bpen

Dependencies: 
  jQuery - http://jquery.com/
  CryptoJS - http://code.google.com/p/crypto-js/
  CryptoJS HMAC SHA512 rollup - http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/hmac-sha512.js

I am using this in a Chrome extension. The last nonce is being stored in localStorage. You will need to store the 
lastNonce somewhere else if you are going to use this outside of a chrome extension.

All requests are asynchronous. If you want to do something with the results you will need to pass a callback function.
