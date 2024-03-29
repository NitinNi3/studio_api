const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

const serverName = process.env.SERVER_NAME || "https://test.api.choira.io/api/download/";

const auth = require("../util/authCheck");
const path = require('path');

const multer = require('multer');

var store = multer.diskStorage({
    destination:function(req,file,cb){
        const uploadDir = path.join(__dirname,'..', 'newFileUploads');
        cb(null,uploadDir);
    },
    filename:function(req,file,cb){
        var dt = new Date().getTime();
        var newOrignalName = dt+file.originalname.replace(/ /g, "");
        cb(null,newOrignalName)
    }
})

var upload1 = multer({storage:store}).single('newImage');

var upload2 = multer({storage:store}).array('newImages',10);

router.get('/download/:filename', function(req,res,next){
    
    filepath = path.join(__dirname,'../newFileUploads') +'/'+ req.params.filename;
    res.download(filepath, req.params.filename);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         _id:
 *           type: object
 *           description: The Auto-generated id of a post
 *         fullName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         latitude:
 *           type: string
 *         longitude:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         profileUrl:
 *           type: string
 *         gender:
 *           type: string
 *         userType:
 *           type: string
 *         deviceId:
 *           type: string
 *         favourites:
 *           type: array
 *         creationTimeStamp:
 *           type: date
 *
*/


/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User Signup / Create new user
 *     tags: [Users]
 *     requestBody:
 *       description: | 
 *          #
 *          Possible values for UserType => EMAIL, FACEBOOK, GOOGLE
 *          #
 *          NOTE : "password" field value must be empty string in case of FACEBOOK or GOOGLE
 *       fullName: string
 *       dateOfBirth: string
 *       email: string
 *       phone: string
 *       password: string
 *       userType: string
 *       deviceId: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *           example : 
 *             fullName: "samarth"
 *             dateOfBirth: "1997-07-23"
 *             email: "samarthchadda@gmail.com"
 *             phone: "9351999562"
 *             password: "sam123"
 *             userType: "EMAIL"
 *             deviceId: "1234"
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "Signup successful"
 *                 user : {}
 *                 token : "abcd123455322ghjdi"
 *       400:
 *         description: Bad Request, check request body
 *       409:
 *         description: Conflict Error, Email or phone already exists
 *       500:
 *         description: Internal server error
 */

router.post('/users/signup',controller.signupUser);


/**
 * @swagger
 * /users/login-otp:
 *   post:
 *     summary: Login to account using phoneNumber & OTP verification
 *     tags: [Users]
 *     requestBody:
 *       description: | 
 *          #
 *          Possible values for UserType => PhoneNumber
 *          #
 *       phoneNumber: string
 *       dateOfBirth: string
 *       userType: string
 *       deviceId: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *           example : 
 *             phoneNumber: "917021908949"
 *             userType: "EMAIL"
 *             deviceId: "df4bbe08-c80b-4fb1-b46c-5739ebe5f716"
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "OTP sent"
 *                 user : {}
 *                 token : "abcd123455322ghjdi"
 *       400:
 *         description: Bad Request, check request body
 *       409:
 *         description: Conflict Error, Email or phone already exists
 *       500:
 *         description: Internal server error
 */

 router.post('/users/login-otp',controller.loginUserOTP);
 router.post('/users/test-login-otp',controller.TestloginUserOTP);

 /**
 * @swagger
 * /users/send-signup-v2:
 *   post:
 *     summary: Send OTP to email and phone
 *     tags: [Users]
 *     requestBody:
 *       description : Match the OTP recieved in response, with the user entered OTP
 *       email: string
 *       phone: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *           example : 
 *             email: "samarthchadda@gmail.com"
 *             phone: "9351999562"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "OTP sent successfully"
 *                 otp : "123456"
 *       400:
 *         description: Bad Request, check request body
 *       409:
 *         description: Conflict Error, Email or phone already exists
 *       500:
 *         description: Internal server error
 */

router.post('/users/send-signup-v2',controller.signupUserV2);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User Login
 *     tags: [Users]
 *     requestBody:
 *       description: | 
 *          #
 *          Possible values for UserType => EMAIL, FACEBOOK, GOOGLE
 *          #
 *          NOTE : "password" field value must be empty string in case of FACEBOOK or GOOGLE
 *       email: string
 *       password: string
 *       userType: string
 *       deviceId: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *           example : 
 *             email: "samarthchadda@gmail.com"
 *             password: "sam123"
 *             userType: "EMAIL"
 *             deviceId: "1234"
 *     responses:
 *       200:
 *         description: Successfully Logged In
 *         content:
 *           application/json:
 *               
 *       400:
 *         description: Bad Request, check request body
 *       401:
 *         description: Authentication failed, Incorrect password
 *       404:
 *         description: User does not exists, incorrect email
 *       500:
 *         description: Internal server error
 */

router.post('/users/login',controller.loginUser);

/**
 * @swagger
 * /users/send-signup-otp:
 *   post:
 *     summary: Send OTP to email and phone
 *     tags: [Users]
 *     requestBody:
 *       description : Match the OTP recieved in response, with the user entered OTP
 *       email: string
 *       phone: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *           example : 
 *             email: "samarthchadda@gmail.com"
 *             phone: "9351999562"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "OTP sent successfully"
 *                 otp : "123456"
 *       400:
 *         description: Bad Request, check request body
 *       409:
 *         description: Conflict Error, Email or phone already exists
 *       500:
 *         description: Internal server error
 */

router.post('/users/send-signup-otp',controller.sendSignUpOtp);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in : query
 *         name: skip
 *         description: skipCount
 *         required: false
 *       - in : query
 *         name: limit
 *         description: limitCount
 *         required: false
 *     requestBody:
 *       description: | 
 *          #
 *          Skip and Limit are optional Query Params
 *          #
 *          (First admin login is needed to generate token, then use "AUTHORIZE" button above to validate)
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "All Users returned"
 *                 users : []
 *       401:
 *         description: Unauthorized, token required
 *       500:
 *         description: Some server error, enter valid mongo object ID
 */

// api/users                       --  Get all users
// api/users?skip=0&limit=50       --  Get particular range of users based on skip and limit
// router.get('/users',auth.isAdmin,controller.getAllUsers);
router.get('/users',controller.getAllUsers);

/**
 * @swagger
 * /users/{userId}/edit-location:
 *   post:
 *     summary: Edit location of USER after Signup
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: userId
 *         description: _id of USER
 *         required: true
 *     requestBody:
 *       description: | 
 *          #
 *          TOKEN is Required
 *          #
 *          (First login/Signup to generate token, then use "AUTHORIZE" button above to validate)
 *       latitude: string
 *       longitude: string
 *       city: string
 *       state: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *             required: true
 *           example : 
 *             latitude: "2.3455"
 *             longitude: "45.55322"
 *             city: "Jaipur"
 *             state: "Rajasthan"
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "User location updated successfully"
 *                 user : {}
 *                 token : "abcd123455322ghjdi"
 *       400:
 *         description: Bad Request, enter valid ID
 *       401:
 *         description: Unauthorized, token required
 *       404:
 *         description: No User exists, enter valid ID
 *       500:
 *         description: Some server error, enter valid mongo object ID
 */

router.post('/users/:userId/edit-location',auth.isUser,controller.addEditUserLocation);

/**
* @swagger
* /users/{userId}/edit-profile:
*   post:
*     summary: Edit profile details of USER
*     tags: [Users]
*     parameters:
*       - in : path
*         name: userId
*         description: _id of USER
*         required: true
*     requestBody:
*       description: | 
*          #
*          TOKEN is Required
*          #
*          (First login/Signup to generate token, then use "AUTHORIZE" button above to validate)
*          #
*          All fields in request body are MANDATORY
*       fullName: string
*       dateOfBirth: string
*       profileUrl: string
*       gender: string
*       content:
*         application/json:
*           schema:
*             id: string
*             required: true
*           example : 
*             fullName: "Samarth Chadda"
*             dateOfBirth: "2004-1-1"
*             profileUrl: "http://ec2-3-109-47-228.ap-south-1.compute.amazonaws.com/api/download/1662907324948resizeCategory1662712270910_1662712270910.jpeg"
*             gender: "male"
*     responses:
*       200:
*         description: User details updated successfully
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "User details updated successfully"
*                 user : {}
*                 token : "abcd123455322ghjdi"
*       400:
*         description: Bad Request, enter valid ID
*       401:
*         description: Unauthorized, token required
*       404:
*         description: No User exists, enter valid ID
*       500:
*         description: Some server error, enter valid mongo object ID
*/
router.post('/users/:userId/edit-profile',auth.isUser,controller.editUserProfile);

/**
 * @swagger
 * /users/send-email-otp:
 *   post:
 *     summary: Send OTP to email, for edit
 *     tags: [Users]
 *     requestBody:
 *       description : Match the OTP recieved in response, with the user entered OTP
 *       email: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *           example : 
 *             email: "samarthchadda@gmail.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "OTP sent successfully"
 *                 otp : "123456"
 *       400:
 *         description: Bad Request, check request body
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
*/
router.post('/users/send-email-otp',auth.isUser,controller.sendEmailOtpForEdit);

/**
* @swagger
* /users/{userId}/edit-email:
*   post:
*     summary: Edit email of USER
*     tags: [Users]
*     parameters:
*       - in : path
*         name: userId
*         description: _id of USER
*         required: true
*     requestBody:
*       description: | 
*          #
*          TOKEN is Required
*          #
*          (First login/Signup to generate token, then use "AUTHORIZE" button above to validate)
*          #
*          All fields in request body are MANDATORY
*       email: string
*       content:
*         application/json:
*           schema:
*             id: string
*             required: true
*           example : 
*             email: "samarthchadda@gmail.com"
*     responses:
*       200:
*         description: Email updated successfully
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "Email updated successfully"
*                 user : {}
*                 token : "abcd123455322ghjdi"
*       400:
*         description: Bad Request, enter valid ID
*       401:
*         description: Unauthorized, token required
*       404:
*         description: No User exists, enter valid ID
*       500:
*         description: Some server error, enter valid mongo object ID
*/
router.post('/users/:userId/edit-email',auth.isUser,controller.editUserEmail);

/**
* @swagger
* /users/send-phone-otp:
*   post:
*     summary: Send OTP to phone, for edit
*     tags: [Users]
*     requestBody:
*       description : Match the OTP recieved in response, with the user entered OTP
*       phone: string
*       content:
*         application/json:
*           schema:
*             id: string
*           example : 
*             phone: "9351999562"
*     responses:
*       200:
*         description: OTP sent successfully
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "OTP sent successfully"
*                 otp : "123456"
*       400:
*         description: Bad Request, check request body
*       409:
*         description: Phone already exists
*       500:
*         description: Internal server error
*/
router.post('/users/send-phone-otp',auth.isUser,controller.sendPhoneOtpForEdit);

/**
* @swagger
* /users/{userId}/edit-phone:
*   post:
*     summary: Edit phone of USER
*     tags: [Users]
*     parameters:
*       - in : path
*         name: userId
*         description: _id of USER
*         required: true
*     requestBody:
*       description: | 
*          #
*          TOKEN is Required
*          #
*          (First login/Signup to generate token, then use "AUTHORIZE" button above to validate)
*          #
*          All fields in request body are MANDATORY
*       phone: string
*       content:
*         application/json:
*           schema:
*             id: string
*             required: true
*           example : 
*             phone: "9351999562"
*     responses:
*       200:
*         description: Phone updated successfully
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "Phone updated successfully"
*                 user : {}
*                 token : "abcd123455322ghjdi"
*       400:
*         description: Bad Request, enter valid ID
*       401:
*         description: Unauthorized, token required
*       404:
*         description: No User exists, enter valid ID
*       500:
*         description: Some server error, enter valid mongo object ID
*/
router.post('/users/:userId/edit-phone',auth.isUser,controller.editUserPhone);

/**
* @swagger
* /users/{userId}/edit-password:
*   post:
*     summary: Edit password of USER
*     tags: [Users]
*     parameters:
*       - in : path
*         name: userId
*         description: _id of USER
*         required: true
*     requestBody:
*       description: | 
*          #
*          TOKEN is Required
*          #
*          (First login/Signup to generate token, then use "AUTHORIZE" button above to validate)
*          #
*          All fields in request body are MANDATORY
*       currentPassword: string
*       newPassword: string
*       content:
*         application/json:
*           schema:
*             id: string
*             required: true
*           example : 
*             currentPassword: "sam123"
*             newPassword: "samarth123"
*     responses:
*       200:
*         description: Password changed successfully
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "Password changed successfully"
*                 user : {}
*                 token : "abcd123455322ghjdi"
*       400:
*         description: Bad Request, enter valid ID
*       401:
*         description: Unauthorized, token required
*       404:
*         description: No User exists, enter valid ID
*       500:
*         description: Some server error, enter valid mongo object ID
*/
router.post('/users/:userId/edit-password',auth.isUser,controller.editUserPasswordDetails);

/**
 * @swagger
 * /users/send-forgot-pwd-otp:
 *   post:
 *     summary: Send OTP on email or phone for password reset validation
 *     tags: [Users]
 *     requestBody:
 *       description: |
 *          #
 *          Possible values for "identityType" are 0(email), and 1(phone)
 *       identity: string
 *       identityType: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *             required: true
 *           example : 
 *             identity: "samarthchadda@gmail.com"
 *             identityType: "0"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "OTP sent successfully"
 *                 otp : "123456"
 *       400:
 *         description: Bad Request, enter valid IdentityType
 *       404:
 *         description: No User exists, enter valid email or phone
 *       500:
 *         description: Some server error
 */

router.post('/users/send-forgot-pwd-otp',controller.sendForgotPasswordOtp);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       description: |
 *          #
 *          Possible values for "identityType" are 0(email), and 1(phone)
 *       identity: string
 *       identityType: string
 *       newPassword: string
 *       content:
 *         application/json:
 *           schema:
 *             id: string
 *             required: true
 *           example : 
 *             identity: "samarthchadda@gmail.com"
 *             identityType: "0"
 *             newPassword: "samarth123"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "Password updated successfully"
 *                 user : {}
 *       400:
 *         description: Bad Request, enter valid IdentityType
 *       404:
 *         description: No User exists, enter valid email or phone
 *       409:
 *         description: Conflict Error, New password must not be same as old password
 *       500:
 *         description: Some server error
 */

router.post('/users/change-password',controller.editUserPassword);

/**
 * @swagger
 * /users/toggle-favourite:
 *   post:
 *     summary: Add or Remove favourite studio
 *     tags: [Users]
 *     requestBody:
 *       description: |
 *          #
 *          TOKEN is required
 *       userId: string
 *       studioId: string
 *       content:
 *         application/json:
 *           schema:
 *             userId: string
 *           example : 
 *             userId: "62c7bf9832688b6c4442ee7b"
 *             studioId: "62c4e8805f9d4e0023327640"
 *     responses:
 *       200:
 *         description: Studio added to favourites
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "Studio added to favourites"
 *                 user : {}
 *                 allFavourites : []
 *       400:
 *         description: Bad Request, enter valid ID
 *       404:
 *         description: No User/Studio exists, enter ID
 *       500:
 *         description: Some server error
 */
router.post('/users/toggle-favourite',auth.isUser,controller.addRemoveUserFavourites);

/**
* @swagger
* /users/graph:
*   get:
*     summary: Get all user graph details
*     tags: [Users]
*     requestBody:
*       description: | 
*          #
*          TOKEN is Required
*          #
*          (ADMIN Token needed)
*     responses:
*       200:
*         description: All data returned
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "All data returned"
*                 allMonths : []
*                 allUserCounts : []
*                 allData : []
*       401:
*         description: Unauthorized, token required
*       500:
*         description: Some server error, enter valid mongo object ID
*/
router.get('/users/graph',auth.isAdmin,controller.getAllUsersGraphDetails);

/**
 * @swagger
 * /users/{userId}/favourites:
 *   get:
 *     summary: Get all favourite studios of particular User
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: userId
 *         description: _id of USER
 *         required: true
 *     requestBody:
 *       description: | 
 *          #
 *          TOKEN is Required
 *          #
 *          (First login/Signup to generate token, then use "AUTHORIZE" button above to validate)
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "All favourites returned"
 *                 favourites : []
 *       400:
 *         description: Bad Request, enter valid ID
 *       401:
 *         description: Unauthorized, token required
 *       404:
 *         description: No User exists, enter valid ID
 *       500:
 *         description: Some server error, enter valid mongo object ID
 */

router.get('/users/:userId/favourites',auth.isUser,controller.getAllFavourites);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Delete particular user (ADMIN token needed)
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: userId
 *         description: _id of USER
 *         required: true
 *     requestBody:
 *       description: | 
 *          #
 *          TOKEN is Required
 *          #
 *          (First admin login is needed to generate token, then use "AUTHORIZE" button above to validate)
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "User deleted successfully"
 *       400:
 *         description: Bad Request, enter valid ID
 *       401:
 *         description: Unauthorized, token required
 *       404:
 *         description: No User exists, enter valid ID
 *       500:
 *         description: Some server error, enter valid mongo object ID
 */

router.get('/users/:userId/delete',auth.isBoth,controller.deleteParticularUser);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get particular user details
 *     tags: [Users]
 *     parameters:
 *       - in : path
 *         name: userId
 *         description: _id of User
 *         required: true
 *     requestBody:
 *       description: | 
 *          #
 *          TOKEN is Required
 *     responses:
 *       200:
 *         description: User Exists
 *         content:
 *           application/json:
 *               example : 
 *                 status : true
 *                 message : "User Exists"
 *                 user : {}
 *       400:
 *         description: Bad Request, enter valid ID
 *       401:
 *         description: Unauthorized, token required
 *       404:
 *         description: No User exists, enter valid ID
 *       500:
 *         description: Some server error, enter valid mongo object ID
 */
 router.get('/users/:userId',controller.getParticularUserDetails);

/**
 * @swagger
 *
 * paths:
 *   /upload-single-image:
 *     post:
 *       summary: Upload files for processing
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 newImage:
 *                   type: file
 *                   multi: false
 *                   items:
 *                     type: string
 *                     format: binary
 *       responses:
 *         200:
 *           $ref: '#/components/responses/NoContent'
 */

//Upload media file
router.post('/upload-single-image',(req,res,next)=>{

    upload1(req,res,function(err){
        if(req.file!=null)
        {
            req.file.originalname = req.file.originalname.replace(/ /g, "");
            req.file.filename = req.file.filename.replace(/ /g, "");
        }
        else{
            console.log("No Image")
            req.file = {
                originalname:null,
                filename:null
            };
        }
           
        if(err)
        {
            return res.status(500).json({status:false,message:"Error Occured",error:err})
        }
        let newImage = serverName+req.file.filename;
        // console.log("new IMG:", newImage);
        return res.json({status:true,message:"Image Uploaded Successfully",imageUrl:newImage});
    })
});


/**
 * @swagger
 *
 * paths:
 *   /upload-multiple-images:
 *     post:
 *       summary: Upload multiple files for processing
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 newImages:
 *                   type: array
 *                   multi: true
 *                   items:
 *                     type: string
 *                     format: binary
 *       responses:
 *         200:
 *           $ref: '#/components/responses/NoContent'
 */

//Upload multiple files
router.post('/upload-multiple-images',(req,res,next)=>{

    upload2(req,res,function(err){
        if(err)
        {
            return res.json({status:false,message:"Error Occured",error:err})
        }

        let newImages = [];
        if(req.files.length !=0)
        {
            req.files.forEach(f => {
                f.originalname = f.originalname.replace(/ /g, "");
                f.filename = f.filename.replace(/ /g, "");
                newImages.push(serverName+f.filename);
            });
        }

        res.json({status:true,message:"Multiple Images Uploaded",images:newImages});
    })
   
});

/**
* @swagger
* /dashboard-counts:
*   get:
*     summary: Get all dashboard counts
*     requestBody:
*       description: |
*          #
*          First admin login is needed to generate token, then use "AUTHORIZE" button above to validate
*     responses:
*       200:
*         description: All counts returned
*         content:
*           application/json:
*               example : 
*                 status : true
*                 message : "All counts returned"
*                 users : 10
*                 studios : 10
*                 bookings : 10
*       401:
*         description: Unauthorized, token required
*       500:
*         description: Some server error, enter valid mongo object ID
*/
router.get('/dashboard-counts',controller.getAllDashboardCount);

router.get('/get-user-nearby-location',controller.getUserNearyByLocations)


module.exports = router;
