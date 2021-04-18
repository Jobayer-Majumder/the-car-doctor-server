const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const fileUpload = require('express-fileupload');


const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jobayer.eggfq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("theCarDoctor").collection("services");
    const orderCollection = client.db("theCarDoctor").collection("orders");
    const reviewCollection = client.db("theCarDoctor").collection("reviews");
    const adminCollection = client.db("theCarDoctor").collection("admins");

    app.get(`/services`, (req, res) => {
        serviceCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.get(`/serviceById/:id`, (req, res) => {
        const id = ObjectID(req.params.id);
        serviceCollection.find({_id : id})
        .toArray((err, document) => {
            res.send(document[0])
        })
    });

    app.delete('/deleteService/:id', (req, res) => {
        const serviceId = ObjectID(req.params.id);
        serviceCollection.deleteOne({ _id: serviceId })
          .then(result => {
            res.send(result.deletedCount > 0)
          })
      });


    app.post('/addService', (req, res) => {
        const service = req.body;
        serviceCollection.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.get(`/getOrders`, (req, res) => {
        orderCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });


    app.get(`/getBookings`, (req, res) => {
        const email = req.query.email;
        orderCollection.find({email : email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.post(`/addReview`, (req, res) => {
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    });


    app.get(`/getReviews`, (req, res) => {
        reviewCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.post(`/addAdmin`, (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get(`/findAdmin` , (req, res) => {
        const email = req.query.email;
        adminCollection.find({email: email})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    });

});


app.listen(process.env.PORT || port, () => console.log('listening port', port))