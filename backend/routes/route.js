// const {createWifi,getWifi}=require("../controller/wifiController");
const { searchWifi } = require('../controller/searchController');
const { registerUser, getUser, loginUser, editUser, updateUser } = require('../controller/userController');
const { createWifi,getWifi, editWifi, updateWifi, deleteWifi, getSingleWifi} = require('../controller/wifiController');

const express=require("express");
const router=express.Router();
router.get('/search', searchWifi );


router.post("/wifi/create", createWifi);
router.get("/wifis", getWifi);
router.get("/wifi/single/:id", getSingleWifi);
router.get("/wifi/edit/:id", editWifi);
router.get("/wifi/update/:id", updateWifi);
router.get("/wifi/delete/:id", deleteWifi);


// router.get("/wifi/search/:q", searchWifi);



router.post("/user/register", registerUser);
router.get("/user/details", getUser);
router.post("/user/login", loginUser );
router.get("/user/edit/:id", editUser );
router.post("/user/update/:id", updateUser );
  

// console.log(router)
console.log(createWifi)

module.exports=router;