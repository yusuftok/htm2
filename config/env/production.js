'use strict';

module.exports = {
  //db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-prod',
//  db: 'mongodb://hatim2:hatim2@ds027744.mongolab.com:27744/heroku_h4zdsbzk',
    db: 'mongodb://localhost/mean-prod',
  /**
   * Database options that will be passed directly to mongoose.connect
   * Below are some examples.
   * See http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options
   * and http://mongoosejs.com/docs/connections.html for more information
   */
  dbOptions: {
    /*
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    },
    replset: {
      rs_name: 'myReplicaSet',
      poolSize: 5
    },
    db: {
      w: 1,
      numberOfRetries: 2
    }
    */
  },
//  hostname: 'https://hatim2.herokuapp.com',
  hostname: 'http://yusuftok.net/hatim2',
  app: {
    name: 'HATIM2'
  },
  logging: {
    format: 'combined'
  },
  strategies: {
    local: {
      enabled: true
    },
    landingPage: '/',
    facebook: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
      enabled: false
    },
    twitter: {
      clientID: 'CONSUMER_KEY',
      clientSecret: 'CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
      enabled: false
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      enabled: false
    },
    google: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      enabled: false
    },
    linkedin: {
      clientID: 'API_KEY',
      clientSecret: 'SECRET_KEY',
      callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
      enabled: false
    }
  },
  emailFrom: 'Yusuf Tok', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'Gmail',
    auth: {
      user: 'hatmiserif2@gmail.com',
      pass: 'h1a2t3i4m5'
    }
  },
  secret: 'SOME_TOKEN_SECRET'
};
