const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const dbUrl = "mongodb+srv://varghese123:varghese123@cluster0-yqune.mongodb.net/<dbname>?retryWrites=true&w=majority"
//const dbUrl = "mongodb://localhost:27017";

app.use(bodyParser.json());
app.use(cors());

let studentData = [];
let mentorData = [];

app.get("/",(req,res)=>{
    mongoClient.connect(dbUrl,(err,client)=>{
        if(err) throw err;
        let db = client.db("myschoolDB");
        db.collection("students").find().toArray().then((data)=>{
            res.status(200).json(data);
        })
        .catch((error)=>{
            console.log(error);
        })
    })
})

app.post('/student', (req, res) => {
    if (req.body.name) {

        mongoClient.connect(dbUrl, (err, client) => {
            if (err) throw err;
            let db = client.db("myschoolDB");
            db.collection("students").insertOne(req.body, (err, data) => {
                if (err) throw err;
                client.close();
                res.status(200).json({
                    "message": "Student Added"
                });

            });
        });

    }else{
        res.status(400).json({
            "message": "Pls pass All information"
        });
    }
    
});

app.post('/mentor', (req, res) => {
    if (req.body.name) {
    mongoClient.connect(dbUrl, (err, client) => {
        if (err) throw err;
        let db = client.db("myschoolDB");
        db.collection("mentors").insertOne(req.body, (err, data) => {
            if (err) throw err;
            client.close();
            res.status(200).json({
                "message": "Mentor Added"
            });

        });
    });
    }else{
        res.status(400).json({
            "message": "Pls pass All information"
        });
    }
});
app.get('/mentorList',(req,res)=>{
    mongoClient.connect(dbUrl,(err,client)=>{
        if(err) throw err;
        let db = client.db("myschoolDB");
        db.collection("mentors").find().toArray().then((data)=>{
            res.status(200).json(data);
        })
        .catch((error)=>{
            console.log(error);
        })
    })
})

app.get("/student/:id",(req,res)=>{
    let objId = mongodb.ObjectID(req.params.id)
    mongoClient.connect(dbUrl,(err,client)=>{
        if(err) throw err;
        let db = client.db("myschoolDB");
        db.collection("students").findOne({_id : objId},(err,data)=>{
            if(err) throw err;
            client.close();
            res.status(200).json(data);
        })
    })
})

app.put("/student/:id",(req,res)=>{
    let objId = mongodb.ObjectID(req.params.id);
    mongoClient.connect(dbUrl,(err,client)=>{
        if(err) throw err;
        let db = client.db("myschoolDB");
        db.collection("students")
        .findOneAndUpdate({_id : objId},{$set:req.body})
        .then((data)=>{
            client.close();
            res.status(200).json(data);
        })
    })
})

app.post('/mentorUpdate', (req, res) => {
    res.json({
        "message":"update success"
    })
})


app.listen(process.env.PORT ||3000, ()=>{
    console.log("App started")
})