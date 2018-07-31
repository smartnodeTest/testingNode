const User = require('../models/user');
const mongoose = require('mongoose');
var async = require('async');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const ModelUser = require('../models/user.model');
const ModelDevice = require('../models/device.model');
const ModelScene = require('../models/scene.model');
const ModelSceneSwitch = require('../models/sceneSwitch.model');
const ModelSwitch = require('../models/switch.model');
const ModelGroup = require('../models/group.model');

//= =======================================
// User Routes
//= =======================================
exports.fetchInitialData = function (req, res, next) {

console.log("FETCHHHH")
console.log(req.user.email)

	var myObjectId = mongoose.Types.ObjectId(req.user._id);          
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

};



exports.syncAppData = function (req, res, next) {

    var arrayDevices;
    var arrayGroups;
    var arraySwitches;
    var arrayScenes;
 	var arraySceneSwitches ;
 	
 	 var arrayToStoreDevices = []
 	var arrayToStoreGroups = []
 	var arrayToStoreSwitches = []
 	var arrayToStoreScenes = []
 	var arrayToStoreSceneSwitches = []

if(req.headers["mobile"] == "Android"){

	console.log("Req from Android");

    arrayDevices = JSON.parse(req.body.deviceData);
   	arrayGroups = JSON.parse(req.body.groupData);
   	arraySwitches = JSON.parse(req.body.switchData);
   	arrayScenes = JSON.parse(req.body.sceneData);
	arraySceneSwitches = JSON.parse(req.body.sceneSwitchData);
}else{

	console.log("Req from iOS");

    arrayDevices = (req.body.deviceData);
    arrayGroups = (req.body.groupData);
    arraySwitches = (req.body.switchData);
    arrayScenes = (req.body.sceneData);
 	arraySceneSwitches = (req.body.sceneSwitchData);
}

 	
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
                    assignedUser : req.user._id
                });
        arrayToStoreDevices.push(newDevice)
    }
    
    for(var i = 0 ; i < arrayGroups.length ; i++){
        var newGroup = new ModelGroup({
                    GroupName: arrayGroups[i].groupName,
                    GroupImage: arrayGroups[i].groupIconName,
                    assignedUser : req.user._id
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
                    assignedUser : req.user._id
                });
        arrayToStoreSwitches.push(newSwitch)
    }

	for(var i = 0 ; i < arrayScenes.length ; i++){
        var newScene = new ModelScene({
                    SceneName: arrayScenes[i].sceneName,
                    SceneForGroup: arrayScenes[i].sceneGroup,
                    assignedUser : req.user._id
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
                    assignedUser : req.user._id
                });
        arrayToStoreSceneSwitches.push(newSceneSwitch)
    }

	var myObjectId = mongoose.Types.ObjectId(req.user._id);       
	
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
            res.status(200).json({
            	status : 'SUCCESS'
            });
        }
    });
};


