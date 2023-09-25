const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const validUsername = (req,res)=>{
    User.checkUsername(req.params.us,(err,data)=>{
        if(err){
            if(err.kind == "not_found"){
                res.send({
                    message: "Not Found: "+req.params.us,
                    valid: true
                });
            }
            else{
                res.status(500).sent({
                    message: "Error query: "+ req.params.us
                });
            }
        }else{
            res.send({record: data,valid: false});
        }
    })
};
const createNewUser = (req,res)=>{
    if(!req.body){
        res.status(400).send({message: "Content can not be empty."});
    }
    const salt = bcrypt.genSaltSync(10);
    const userObj = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password,salt),
        img: req.body.img
    });
    User.create(userObj,(err,data)=>{
        if(err){
            res.status(500).send({message: err.message ||"Some error occured while creating"});
        }else res.send(data);
    });
};
const login = (req,res)=>{
    console.log("login con")
    if(!req.body){
        res.status(400).send({message: "Content can not be empty."});
    }
    const acc = new User({
        username: req.body.username,
        password: req.body.password
    });
    console.log("c: " + acc.username)
    User.loginModel(acc,(err,data)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send({message: "Not found "+req.body.username});
            }
            else if(err.kind == "invalid_pass"){
                res.status(401).send({message: "Invalid Password"});
            }else{
                res.status(500).send({message: "Query error."});
            }
        }else res.send(data);
    });
};
const getAllRecords = (req,res)=>{
    User.getAllRecords((err,data)=>{
        if(err){
            res.status(500).send({message: err.message || "Some error ocurred"});
        }else res.send(data);
    });
};

const updateUserCtrl = (req,res)=>{
    if(!req.body){
        res.status(400).send({message: "Content can not be empty."});
    }
    const data = {
        fullname: req.body.fullname,
        email: req.body.email,
        img: req.body.img
    };
    User.updateUser(req.params.id,data,(err,result)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send(
                    {message: "Not found user: "+ req.params.id}
                );
            }else {
                res.status(500).send(
                    {message: "Error update user: "+ req.params.id}
                );
            }
        }else {
            res.send(result);
        }
    });
};

const deleteUser = (req, res)=>{
    console.log("parameter: "+ req.params.id +
    ", "+ req.params.p1+
    ", "+req.params.p2);
    User.removeUser(req.params.id, (err,result)=>{
        if(err){
            if(err.kind == "not_found"){
                res.status(401).send(
                    {message: "Not found user: "+ req.params.id}
                );
            }
            else{
                res.status(500).send(
                    {message: "Error delete user: "+req.params.id}
                );
            }
        }else{
            res.send(result);
        }
    });
};

module.exports = {validUsername,
    createNewUser,
    login,
    getAllRecords,
    updateUserCtrl,
    deleteUser};