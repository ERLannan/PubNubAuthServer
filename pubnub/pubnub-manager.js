var PubNub = require('pubnub');

const { publish, subscribe, secret } = require('../config/keys');
const pubnub = new PubNub({
  publishKey: publish,
  subscribeKey: subscribe,
  secretKey: secret
});

pnManager = {
  init: () => {
    pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
          var publishConfig = {
            channel: 'global_channel',
            message: {
              text: 'Server started'
            }
          };
          pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
          });
        }
      },
      message: function(msg) {
        console.log(msg.message.text);
      }
    });
    pubnub.subscribe({
      channels: ['global_channel']
    });
  },
  authorizeToken: jwtToken => {
    console.log(jwtToken);
    pubnub.grant(
      {
        channels: ['global_channel'],
        // channelGroups: [cg1, cg2],
        authKeys: [jwtToken],
        ttl: 1440, // 0 for infinite
        read: true, // false to disallow
        write: true, // false to disallow
        manage: false // false to disallow
      },
      function(status) {
        // handle state setting response
        console.log(status);
      }
    );
  }
};

module.exports = pnManager;
