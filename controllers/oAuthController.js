exports.renderLoginPage = function (req, res, next) {

    console.log("FETCHHHH")

    res.render('login', {clientId : req.query.client_id, redirectUri: req.query.redirect_uri, responseType: req.query.response_type,state: req.query.state, scope: req.query.scope}) 
    

};

exports.confirmAuthorization = function(req,res,next){
    console.log("Post /authorization !! " )

    res.redirect('/oAuth/confirmAuthorization?response_type=' + req.body.responseType + '&client_id=' + 
    req.body.clientId + '&redirect_uri=' + req.body.redirectUri + '&scope=' + req.body.scope + '&state=' + req.body.state )
}