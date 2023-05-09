const Express = require("express");
const BodyParser = require("body-parser");
const Cors = require("cors");
const Mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const { learnerModel } = require("./Model/learnerList");
const { userModel } = require("./Model/userList");
require("dotenv").config();

const app = Express();

app.use(BodyParser.urlencoded({extended:true}));
app.use(BodyParser.json());
app.use(Cors());

Mongoose.connect("mongodb+srv://vaisakh1996v:1996@learnertracker.gwoi5s2.mongodb.net/?retryWrites=true&w=majority",{useNewUrlParser:true});


//to post learner


app.post('/api/postData', (req,res)=>{
    let data =  new learnerModel(req.body)
    JWT.verify(req.body.token,"tracker",
    (error,decoded)=>{
        if (decoded && decoded.email) {
            data.save(req.body.token)
            console.log(req.body.token)
            res.json({ status: 'Data Saved', data: data });
        } else {
            res.json({status:"Unauthorized User"})
        }
        console.log(req.body.token)
    })  
})

// to post CSV


// to view learner
app.post('/api/viewData', async (req, res)=>{
    try {
        let data = await learnerModel.find();
        JWT.verify(req.body.token, "tracker", (error, decoded) => {
          if (error) {
            res.json({ status: "Token Verification Failed" });
          } else if (decoded && decoded.email) {
            res.json(data);
          } else {
            res.json({ status: "Unauthorized User" });
          }
        });
      } catch (error) {
        res.json({ status: "Server Error" });
      }
})


//to delete learner
app.post('/api/deleteData', async (req,res)=>{
    try {
        const decoded = JWT.verify(req.body.token, 'tracker');
        if (!decoded || !decoded.email) {
          res.status(401).json({status: 'Unauthorized',message: 'Invalid or missing token'});
          return;
        }
        const data = await learnerModel.findOneAndDelete({ learner_id : req.body.learner_id });
        if (data) {
          console.log(data)
          res.json({status: 'Data Deleted',data: data});
        } else {
          res.status(404).json({status: 'User not found'});
        }
      } catch (error) {
        res.status(500).json({status: 'Internal Server Error',error: error.message});
      }
});

// to update learner
app.post('/api/updateData/:id',async(req,res)=>{
    try {
        let data = await learnerModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        console.log("TOKEN : " + req.body.token);
        console.log("id : " + req.params.id)
        console.log("body : "+ JSON.stringify(req.body))
        const decoded = JWT.verify(req.body.token, "tracker");
        if (decoded && decoded.email) {
          console.log("data: "+ data);
          console.log(req.body.token);
          res.json({data, status: 'Data Saved'});
        } else {
          res.json({status: "Unauthorized User"});
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({status: 'Internal Server Error'});
      }}
)

// login

app.post('/api/login',async(req,res)=>{

    let email = req.body.email
    let password = req.body.password

    let user = await userModel.findOne({email : email})
    console.log(user)
    if(!user){
        res.json({status: "User not Found"})
        
    }
    try {

        if( user.password == password){
            console.log("going to generate")
            JWT.sign({email:email,id:user._id},"tracker",{expiresIn:"1d"},
            (error,token)=>{
                console.log("token generating")
                if (error) {
                    res.json({status:"Token not Generated"})
                } else {
                    res.json({status:"Login Successful",token:token,data:user})
                    console.log(token)
                }
            })
        }
        else{
            res.json({status:"Login Failed"})
        }
    } catch (error) {
        
    }
    
})


// only for TESTING !!!!!!

//signup
app.post('/api/signup',async(req,res)=>{
    let data = await new userModel(req.body)
    JWT.verify(req.body.token,"tracker",
    (error,decoded)=>{
        if (decoded && decoded.email) {
            data.save(req.body.token)
            console.log(req.body.token)
            res.json({ status: 'Data Saved', data: data });
        } else {
            res.json({status:"Unauthorized User"})
        }
        console.log(req.body.token)
    })  
})

// to view data for admin

app.post('/api/showUser', async (req, res) => {
    try {
      let data = await userModel.find();
      JWT.verify(req.body.token, "tracker", (error, decoded) => {
        if (error) {
          res.json({ status: "Token Verification Failed" });
        } else if (decoded && decoded.email) {
          res.json(data);
        } else {
          res.json({ status: "Unauthorized User" });
        }
      });
    } catch (error) {
      res.json({ status: "Server Error" });
    }
  });

// to add users

app.post('/api/enterUser', (req,res)=>{
    let data =  new userModel(req.body)
    JWT.verify(req.body.token,"tracker",
    (error,decoded)=>{
        if (decoded && decoded.email) {
            data.save(req.body.token)
            console.log(req.body.token)
            res.json({status : 'Data Saved'}) 
            res.json(data);
        } else {
            res.json({status:"Unauthorized User"})
        }
        console.log(req.body.token)
    })  
})

// to delete user

app.post('/api/deleteUser', async (req, res) => {
    try {
      // Verify JWT token
      const decoded = JWT.verify(req.body.token, 'tracker');
      if (!decoded || !decoded.email) {
        res.status(401).json({
          status: 'Unauthorized',
          message: 'Invalid or missing token'
        });
        return;
      }
  
      const data = await userModel.findOneAndDelete({ email: req.body.email });
      if (data) {
        console.log(data)
        res.json({
          status: 'Data Deleted',
          data: data
        });
      } else {
        res.status(404).json({
          status: 'User not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'Internal Server Error',
        error: error.message
      });
    }
  });


app.post('/api/updateUser/:id', async (req, res) => {
    try {
      let data = await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
      console.log("TOKEN : " + req.body.token);
      console.log("id : " + req.params.id)
      console.log("body : "+ JSON.stringify(req.body))
      const decoded = JWT.verify(req.body.token, "tracker");
      if (decoded && decoded.email) {
        console.log("data: "+ data);
        console.log(req.body.token);
        res.json({data, status: 'Data Saved'});
      } else {
        res.json({status: "Unauthorized User"});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({status: 'Internal Server Error'});
    }
  });
  
  
// to read CSV file
app.post('/api/postCsv', async (req, res) => {
  console.log(req.body)
  try {
    // Loop through the data array
    for (let i = 0; i < req.body.data.length; i++) {
      let data = new learnerModel(req.body.data[i])
      console.log("3")
      let decoded = await verifyJwt(req.body.token)
      console.log("4")
      if (decoded && decoded.email) {
        console.log("5")
        await data.save(req.body.token)
        console.log("inside backend")
        console.log(req.body.token)
        console.log("6")
      } else {
        res.json({ status: "Unauthorized User" })
        return
      }
      console.log(req.body.token)
    }
    res.json({ status: 'Data Saved' });
    console.log("7")
  } catch (error) {
    console.log(error)
    res.json({ status: "Error" })
  }
})

async function verifyJwt(token) {
  return new Promise((resolve, reject) => {
    JWT.verify(token, "tracker", (error, decoded) => {
      if (error) {
        reject(error)
      } else {
        resolve(decoded)
      }
  })
})
}
const path = require('path');
app.use( Express.static(path.join(__dirname, './build')));

app.get('*' , (req ,res)=>{ res.sendFile(path.join(__dirname, './build/index.html' ))});



app.listen(3001, ()=>{
    console.log("server up and Running.........|.|......")
})