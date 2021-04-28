const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route       POST 
// @description authenticate user and get route
// @access      Public
router.post(
    "/",
    [
      check("email", "Please check email is valid").isEmail(),
      check("password", "Password is required").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        // See if user exit
  
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid creds" }] });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res
            .status(400)
            .json({ errors: [{ msg: "Invalid creds" }] });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(payload, config.get("jwtSecret"), {expiresIn:360000}, (err, token)=>{
          if(err){
              throw err;
          }
          else{
              res.json({token});
          }
        });
      } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
      }
    }
  );
// @route       GET 
// @description Auth get route
// @access      Public
router.get('/',auth, async (req,res) => {
    try{
        const users = await User.findById(req.user.id).select('-password');
        res.json(users);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
