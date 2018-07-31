var config = module.exports;

config.db = {
  //  mongodb : 'mongodb://localhost/jwtauthh' // 127.0.0.1:27017/node-server
	mongodb : 'mongodb://dhruv:No1canstopme@ds159651.mlab.com:59651/heroku_ww00nz2j' 
}

config.jwt = {
    secret: 'vdtsmartnodevdt' 
};

config.server = {
    port: PORT = process.env.PORT || 5000
};


config.OAuth2credentials = {
  client: {
    id: '281111111991',
    secret: 'dhruvparthbrindadishaverticalsmartnode'
  },
  auth: {
    tokenHost: 'https://api.oauth.com'
  }
};