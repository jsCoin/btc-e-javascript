/**
 * BTC-e JavaScript Trading API
 * https://btc-e.com/api/documentation
 *
 * Author: jsCoin
 * BTC : 151vumzopVBZMV9CtswFiumQBbEHcULPnG
 * LTC : Laoq3qsLvQFCnnbfcFGpQyjy5kcK58bpen
 *
 * Dependencies:
 *   jQuery - http://jquery.com/
 *   CryptoJS - http://code.google.com/p/crypto-js/
 *   CryptoJS HMAC SHA512 rollup -
 *     http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/hmac-sha512.js
 **/

/**
 * On object instantiation the getInfo method should be called to initialize
 * member variables.
 */
function API(key,secret,startNonce){
  self.key = key;
  self.secret = secret;
  self.headers = {
    Key : self.key,
    Sign : ''
  };
  this.lastNonce = startNonce;
}
API.prototype.key;
API.prototype.secret;
API.prototype.url = 'https://btc-e.com/tapi';
API.prototype.headers;
API.prototype.funds;
API.prototype.openOrders;
API.prototype.rights;
API.prototype.transactionCount;
/**
 * Send the request to the server asynchronously.
 */
API.prototype.send = function(params, success){
    this.lastNonce = this.lastNonce+1;
    localStorage['lastNonce'] = this.lastNonce;
    params.nonce = this.lastNonce;
    var query = $.param(params);
    self.headers.sign = CryptoJS.HmacSHA512(query,self.secret).toString();
   $.ajax({
       async : true,
       type : 'POST',
       url : this.url,
       headers : self.headers,
       dataType : 'json',
       data : params,
       success : success
    });
};

/**
 * Retrieve account information and API key permissions.
 */
API.prototype.getInfo = function(callback){
  var self = this;
    var params = {
      method : "getInfo",
    };
    var success = function(data,text){
        if(data.success===1){
          self.funds = data.return.funds;
          self.openOrders = data.return.open_orders;
          self.rights = data.return.rights;
          self.transactionCount = data.return.transaction_count;
          if(callback)
            callback(data.return);
        }else{
          if(callback)
            console.log(data);
            callback(data.error);
        }
    };
    this.send(params, success);
};

/**
 * Retrieve your transaction history. There are 7 possible parameters for this
 * function instead of having a terrible method signature this will take an
 * object of the desired parameters.
 * 
 * @param paramObj -
 *            object containing 0 or members
 * 
 * NOTE: Possible argument members are:
 * from,count,from_id,end_id,order,since,end Refer to BTC-e documentation for
 * parameter explanation.
 */
API.prototype.transHistory = function(paramObj,callback){
  var params = {
    method : "TransHistory"
  };
  $.extend(params,paramObj);
  var success = function(data,text){
      if(data.success===1){
        callback(data.return);
      }else{
        callback(data.error);
      }
    };
  this.send(params, success);
};
/**
 * Retrieve your trade history. There are eight possible parameters for this
 * function instead of having a terrible method signature this will take an
 * object of the desired parameters.
 * 
 * @param paramObj -
 *            object containing 0 or members
 * 
 * NOTE: Possible argument members are:
 * pair,from,count,from_id,end_id,order,since,end Refer to BTC-e documentation
 * for parameter explanation.
 */
API.prototype.tradeHistory = function(paramObj,callback){
  var params = {
      method : "TradeHistory"
    };
    $.extend(params,paramObj);
    var success = function(data,text){
        if(data.success===1){
          callback(data.return);
        }else{
          callback(data.error);
        }
    };
    this.send(params,success);
};
/**
 * Retrieve your open order list. There are nine possible parameters for this
 * function instead of having a terrible method signature this will take an
 * object of the desired parameters.
 * 
 * @param paramObj -
 *            object containing 0 or members
 * 
 * NOTE: Possible argument members are:
 * pair,active,from,count,from_id,end_id,order,since,end Refer to BTC-e
 * documentation for parameter explanation.
 */
API.prototype.orderList = function(paramObj,callback){
  var params = {
      method : "OrderList"
    };
    $.extend(params,paramObj);
    var success = function(data,text){
        if(data.success===1){
          callback(data.return);
        }else{
          callback(data.error);
        }
      };
      this.send(params,success);
};
/**
 * Create a new trade. All parameters are required.
 * 
 * @param pair -
 *            currency pair in form btc_usd
 * @param type -
 *            buy or sell
 * @param rate -
 *            the price you would like to trade at
 * @param rate -
 *            how many coins you want
 * @return order stats or error
 */
API.prototype.trade = function(pair,type,rate,amount,callback){
  var self = this;
  var params = {
      method : "Trade",
      pair : pair,
      type : type,
      rate : rate,
      amount : amount
    };
    var success = function(data,text){
        if(data.success===1){
          self.funds = data.return.funds;
          callback(data.return);
        }else{
          callback(data.error);
        }
      };
      this.send(params,success);
};
/**
 * Cancel the argument order.
 * 
 * @param order_id -
 *            order id of the desired order
 */
API.prototype.cancelOrder = function(order_id,callback){
  var self = this;
  var params = {
      method : "CancelOrder",
      order_id : order_id
    };
    var success = function(data,text){
        if(data.success===1){
          self.funds = data.return.funds;
          callback(data.return)
        }else{
          calback(data.error);
        }
      };
      this.send(params,success);
};

// ********************** Public API **************************
/*
 * Quick implementation for Public API for completeness.
 */
API.prototype.fee = function(pair,callback){
  $.ajax({
    async : true,
    type : 'GET',
    url : 'https://btc-e.com/api/2/'+pair+'/fee',
    success : function(data){
      callback(data);
    }
  });
};
API.prototype.ticker = function(pair,callback){
  $.ajax({
       async : true,
       type : 'GET',
       url : 'https://btc-e.com/api/2/'+pair+'/ticker',
       dataType : 'json',
       success : function(data){
        if(data!==undefined){
          callback(pair,data);
        }
       }
    });
};
API.prototype.trades = function(pair,callback){
$.ajax({
       async : true,
       type : 'GET',
       url : 'https://btc-e.com/api/2/'+pair+'/trades',
       dataType : 'json',
       success : function(data){
         callback(data);
       }
    });
};
API.prototype.depth = function(pair,callback){
$.ajax({
       async : true,
       type : 'GET',
       url : 'https://btc-e.com/api/2/'+pair+'/depth',
       dataType : 'json',
       success : function(data){
         callback(data);
       }
    });
};
