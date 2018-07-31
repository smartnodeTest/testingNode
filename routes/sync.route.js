const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var async = require('async');

var bodyParser = require('body-parser');
var config = require('../config/config');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const ModelUser = require('../models/user.model');
const ModelDevice = require('../models/device.model');
const ModelScene = require('../models/scene.model');
const ModelSceneSwitch = require('../models/sceneSwitch.model');
const ModelSwitch = require('../models/switch.model');
const ModelGroup = require('../models/group.model');

var user_id;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.use('/', function (req, res, next) {
   // var token = req.body.userToken;
   // var token = req.headers['x-access-token'];
   
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
      //  req.token = bearerToken;
      
    console.log(bearerToken);
	console.log("---XXXX----");

        var token = bearerToken;
    }
   
    if (token){
         payload = jwt.decode(token,config.jwt.secret);
         user_id = payload._id
    }
    next();
});




// router.use('/', function (req, res, next) {
// 
// 	console.log(req.get('Authorization'));
// 	console.log(req.headers['x-access-token']);
// 	console.log("-----")
// 
//     next();
// });

// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),  
//     secretOrKey: config.get('authentication.token.secret'),
//     issuer: config.get('authentication.token.issuer'),
//     audience: config.get('authentication.token.audience')
// };
// 
// passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
//     const user = users.getUserById(parseInt(payload.sub));
//     if (user) {
//         return done(null, user, payload);
//     }
//     return done();
// }));

router.post('/allData', function (req, res, next) {

    var arrayDevices = JSON.parse(req.body.deviceData);
   	var arrayGroups = JSON.parse(req.body.groupData);
   	var arraySwitches = JSON.parse(req.body.switchData);
   	var arrayScenes = JSON.parse(req.body.sceneData);
	var arraySceneSwitches = JSON.parse(req.body.sceneSwitchData);
 	var arrayToStoreDevices = []
 	var arrayToStoreGroups = []
 	var arrayToStoreSwitches = []
 	var arrayToStoreScenes = []
 	var arrayToStoreSceneSwitches = []
 	
 	console.log(arrayDevices)
    console.log(arrayDevices.length)
		
	for(var i = 0 ; i < arrayDevices.length ; i++){
        var newDevice = new ModelDevice({
                    Name: arrayDevices[i].deviceName,
                    MainId: arrayDevices[i].deviceMainId,
                    OpenId: arrayDevices[i].deviceOpenId,
                    Token: arrayDevices[i].deviceToken,
                    HardwareType : arrayDevices[i].deviceHardwareType,
                    Type : arrayDevices[i].deviceUserType,
                    TotalSwitches: arrayDevices[i].deviceTotalSwitches,
                    assignedUser : user_id
                });
        arrayToStoreDevices.push(newDevice)
    }
    
    for(var i = 0 ; i < arrayGroups.length ; i++){
        var newGroup = new ModelGroup({
                    GroupName: arrayGroups[i].groupName,
                    GroupImage: arrayGroups[i].groupIconName,
                    assignedUser : user_id
                });
        arrayToStoreGroups.push(newGroup)
    }

	for(var i = 0 ; i < arraySwitches.length ; i++){
        var newSwitch = new ModelSwitch({
                    Name: arraySwitches[i].switchName,
                    BtnNmbr: arraySwitches[i].switchBtnNum,
                    DeviceName: arraySwitches[i].switchInDevice,
                    GroupName: arraySwitches[i].switchInGroup,
                    Isfav : arraySwitches[i].isFav,
                    IconName : arraySwitches[i].switchIconName,
                    NotificationState: arraySwitches[i].notificationState,
                    assignedUser : user_id
                });
        arrayToStoreSwitches.push(newSwitch)
    }

	for(var i = 0 ; i < arrayScenes.length ; i++){
        var newScene = new ModelScene({
                    SceneName: arrayScenes[i].sceneName,
                    SceneForGroup: arrayScenes[i].sceneGroup,
                    assignedUser : user_id
                });
        arrayToStoreScenes.push(newScene)
    }

	for(var i = 0 ; i < arraySceneSwitches.length ; i++){
        var newSceneSwitch = new ModelSceneSwitch({
                    Name: arraySceneSwitches[i].scnSwitchName,
                    BtnNmbr: arraySceneSwitches[i].scnSwitchBtnNum,
                    DeviceName: arraySceneSwitches[i].scnSwitchInDevice,
                    SceneName: arraySceneSwitches[i].scnSwitchInScene,
                    GroupName: arraySceneSwitches[i].scnSwitchInGroup,
                    State : arraySceneSwitches[i].scnSwitchState,
                    Type : arraySceneSwitches[i].scnSwitchType,
                    Checked: arraySceneSwitches[i].scnSwitchChecked,
                    assignedUser : user_id
                });
        arrayToStoreSceneSwitches.push(newSceneSwitch)
    }

	var myObjectId = mongoose.Types.ObjectId(user_id);       
	
    ModelDevice.deleteMany({"assignedUser": myObjectId}, function(err) {})
    ModelGroup.deleteMany({"assignedUser": myObjectId}, function(err) {})
    ModelSwitch.deleteMany({"assignedUser": myObjectId}, function(err) {})
    ModelScene.deleteMany({"assignedUser": myObjectId}, function(err) {})
    ModelSceneSwitch.deleteMany({"assignedUser": myObjectId}, function(err) {})

    ModelDevice.insertMany(arrayToStoreDevices,function (err, result) {
        if (err) 
        {
//             return res.status(500).json({
//                 status: 'FAIL',
//                 error: err
//             });
        }else{
//             res.status(201).json({
//             	obj: result,
//             	status : 'SUCCESS'
//             });
        }
    });
    
    ModelGroup.insertMany(arrayToStoreGroups,function (err, result) {
        if (err) 
        {
//             return res.status(500).json({
//                 status: 'FAIL',
//                 error: err
//             });
        }else{
         //    res.status(201).json({
//             	obj: result,
//             	status : 'SUCCESS'
//             });
        }
    });
    
    ModelSwitch.insertMany(arrayToStoreSwitches,function (err, result) {
        if (err) 
        {
//             return res.status(500).json({
//                 status: 'FAIL',
//                 error: err
//             });
        }else{
       //      res.status(201).json({
//             	obj: result,
//             	status : 'SUCCESS'
//             });
        }
    });
    
    ModelScene.insertMany(arrayToStoreScenes,function (err, result) {
        if (err) 
        {
//             return res.status(500).json({
//                 status: 'FAIL',
//                 error: err
//             });
        }else{
       //      res.status(201).json({
//             	obj: result,
//             	status : 'SUCCESS'
//             });
        }
    });
    
    ModelSceneSwitch.insertMany(arrayToStoreSceneSwitches,function (err, result) {
        if (err) 
        {
            return res.status(500).json({
                status: 'FAIL',
                error: err
            });
        }else{
            res.status(201).json({
            	obj: result,
            	status : 'SUCCESS'
            });
        }
    });
});

//router.post("/fetchData", passport.authenticate('jwt', { session: false }), function(req, res){
 // res.json({message: "Success! You can not see this without a token"});
//});

router.get('/fetchData', function (req, res, next) {

	console.log(user_id)

	var myObjectId = mongoose.Types.ObjectId(user_id);          
	var devicesFromServer = []
	var groupsFromServer = []
	var switchesFromServer = []
	var sceneSwitchesFromServer = []
	var scenesFromServer = []

	console.log("RECEIVED !! ") 
        
    async.parallel([
        function(callback) {
            ModelDevice.find({"assignedUser" : myObjectId }, function(err, devicesFromDB) {
            if (err){ 
                throw err;
            }else{          
      
                devicesFromServer = devicesFromDB
                callback();
                                
            }    
        }); 
        },
        function(callback) {
            ModelGroup.find({"assignedUser" : myObjectId }, function(err, groupsFromDB) {
            if (err){ 
                throw err;
            }else{       

				groupsFromServer = groupsFromDB
                callback();
                              
            }    
        });
        },
        function(callback) {
            ModelSwitch.find({"assignedUser" : myObjectId }, function(err, switchesFromDB) {
            if (err){ 
                throw err;
            }else{                
				
				switchesFromServer = switchesFromDB		
                callback();
                              
            }    
        });
        },
        function(callback) {
            ModelScene.find({"assignedUser" : myObjectId }, function(err, scenesFromDB) {
            if (err){ 
                throw err;
            }else{
            
				scenesFromServer = scenesFromDB				
                callback();
                
            }    
        });
        },
        function(callback) {
            ModelSceneSwitch.find({"assignedUser" : myObjectId }, function(err, sceneSwitchesFromDB) {
            if (err){ 
                throw err;
            }else{
            
				sceneSwitchesFromServer = sceneSwitchesFromDB				
                callback();
                
            }    
        });
        }
    ],
    function(err) { 
        if (err) return next(err);
        
        console.log(devicesFromServer)
        console.log(groupsFromServer)
        console.log(switchesFromServer)
        console.log(scenesFromServer)
        console.log(sceneSwitchesFromServer)
        
        
        res.status(200).json({
            status : "SUCCESS",
            devicesFromServer : devicesFromServer,
            groupsFromServer : groupsFromServer,
        	switchesFromServer : switchesFromServer,
            scenesFromServer : scenesFromServer,
            sceneSwitchesFromServer : sceneSwitchesFromServer
        }); 
    });
         
});


//             ModelUser_PlantSupervisor
//                 .findOne({ userId : userId })
//                 .populate('assignedMachines')
//                 .exec(function (err, supervisor)
//                 {
//                     console.log(supervisor)
//                     privateMachines = supervisor.assignedMachines;
//                     res.status(200).json({
//                         obj : privateMachines,
//                     });
//                 });

module.exports = router;