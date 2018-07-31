const express = require('express');
const passport = require('passport');
const passportfb = require('passport-facebook-token');
var FacebookTokenStrategy = require('passport-facebook-token');

var ModelUser = require('./models/user.model');
const config = require('./config/config');
const jwt = require('jsonwebtoken');

const DataController = require('./controllers/data');
const AuthenticationController = require('./controllers/authentication');
const oauth = require("./oauth");
var registration = require("./registration")

//const user = require('./routes/user.route');
//const sync = require('./routes/sync.route');

const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireEmailLogin = passport.authenticate('local', { session: false });
const requireFBLogin = passport.authenticate('facebook-token', { session: false });

module.exports = function (app) {
  // Initializing route groups
  	const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    dataRoutes = express.Router(),
    oAuthRoutes = express.Router();
    
    
    app.set('views', __dirname + '/views')
	app.set('view engine', 'pug')
    
    // Set url for API group routes
	app.use('/', apiRoutes);
	
//   = ========================
//   Auth Routes
//   = ========================

    apiRoutes.use('/auth', authRoutes);
    
    authRoutes.post('/signup',AuthenticationController.register);
    authRoutes.post('/signin', requireEmailLogin, AuthenticationController.login);
   // authRoutes.post('/facebook/token',AuthenticationController.register);
    
    
    function generateToken(user) {
  return jwt.sign({_id: user}, config.jwt.secret, {
    expiresIn: 604800 // in seconds
  });
}
    
    
    authRoutes.post('/facebook/token',requireFBLogin,
  		function (req, res) {
    	// do something with req.user
    	console.log("HIIIIIIIIIII");
    	
    	if(req.user){
    	res.status(200).json({
			token: generateToken(req.user._id),
    		status: 'SUCCESS',
    		user : req.user
      	});
    	}else{
    	
    	res.status(500).json({
            error: err,
            status: 'FAIL'
         	});
    	}
    	
    //	res.send(req.user? 200 : 401);
  	});

  	

//   = ========================
//   User Routes
//   = ========================

	apiRoutes.use('/sync', dataRoutes);
	
	dataRoutes.post('/allData', requireAuth, DataController.syncAppData);
	dataRoutes.get('/fetchData', requireAuth, DataController.fetchInitialData);

	apiRoutes.use('/oAuth',oAuthRoutes);

	oAuthRoutes.get('/authorization', function(req, res) { res.render('login', {clientId : req.query.clientId, redirectUri: req.query.redirectUri, responseType: req.query.responseType}) })
	oAuthRoutes.post('/authorization', requireEmailLogin, function(req, res) {
    	//It is not essential for the flow to redirect here, it would also be possible to call this directly
    	res.redirect('/authorization?response_type=' + req.body.responseType + '&client_id=' + req.body.clientId + '&redirect_uri=' + req.body.redirectUri)
  	})
  	
  	apiRoutes.get('/authorization', oauth.authorization)
	apiRoutes.post('/decision', oauth.decision)
	
	oAuthRoutes.post('/token', oauth.token)
	apiRoutes.get('/restricted', passport.authenticate('accessToken', { session: false }), function (req, res) {
    res.send("Yay, you successfully accessed the restricted resource!")
	})
	

apiRoutes.get('/client/registration', function(req, res) { res.render('clientRegistration') })
apiRoutes.post('/client/registration', registration.registerClient)




//   = ========================
//   Auth Routes
//   = ========================
// 
//   Set auth routes as subgroup/middleware to apiRoutes
//   apiRoutes.use('/auth', authRoutes);
// 
//   Registration route
  // authRoutes.post('/registerUser', AuthenticationController.register);
// 
//   Login route
//   authRoutes.post('/login', requireLogin, AuthenticationController.login);
// 
//   Password reset request route (generate/send token)
//   authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);
// 
//   Password reset route (change password using token)
//   authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);
// 
//   = ========================
//   User Routes
//   = ========================
// 
//   Set user routes as a subgroup/middleware to apiRoutes
//   apiRoutes.use('/user', userRoutes);
// 
//   View user profile route
//   userRoutes.get('/:userId', requireAuth, UserController.viewProfile);
// 
//   Test protected route
//   apiRoutes.get('/protected', requireAuth, (req, res) => {
//     res.send({ content: 'The protected test route is functional!' });
//   });
// 
//   apiRoutes.get('/admins-only', requireAuth, AuthenticationController.roleAuthorization(ROLE_ADMIN), (req, res) => {
//     res.send({ content: 'Admin dashboard is working.' });
//   });
// 
//   = ========================
//   Chat Routes
//   = ========================
// 
//   Set chat routes as a subgroup/middleware to apiRoutes
//   apiRoutes.use('/chat', chatRoutes);
// 
//   View messages to and from authenticated user
//   chatRoutes.get('/', requireAuth, ChatController.getConversations);
// 
//   Retrieve single conversation
//   chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);
// 
//   Send reply in conversation
//   chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);
// 
//   Start new conversation
//   chatRoutes.post('/new/:recipient', requireAuth, ChatController.newConversation);
// 
//   = ========================
//   Payment Routes
//   = ========================
//   apiRoutes.use('/pay', payRoutes);
// 
//   Webhook endpoint for Stripe
//   payRoutes.post('/webhook-notify', StripeController.webhook);
// 
//   Create customer and subscription
//   payRoutes.post('/customer', requireAuth, StripeController.createSubscription);
// 
//   Update customer object and billing information
//   payRoutes.put('/customer', requireAuth, StripeController.updateCustomerBillingInfo);
// 
//   Delete subscription from customer
//   payRoutes.delete('/subscription', requireAuth, StripeController.deleteSubscription);
// 
//   Upgrade or downgrade subscription
//   payRoutes.put('/subscription', requireAuth, StripeController.changeSubscription);
// 
//   Fetch customer information
//   payRoutes.get('/customer', requireAuth, StripeController.getCustomer);
// 
//   = ========================
//   Communication Routes
//   = ========================
//   apiRoutes.use('/communication', communicationRoutes);
// 
//   Send email from contact form
//   communicationRoutes.post('/contact', CommunicationController.sendContactForm);


};
