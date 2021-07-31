const express = require('express');
const { request } = require('http');
const Datastore = require('nedb');
const app = express();

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, () =>  console.log("listening at 3000"));

app.use(express.json());
const database = new Datastore({filename: 'tasks.db', autoload: true});
// database.ensureIndex({ fieldName: 'index', unique: true }, function (err) {
// });

app.get('/info', (req, res) => {
    database.find({}).sort({ index : 1 }).exec(function(err, data) {
        if(err) {
            console.log(err);;
        }
        res.json(data);
    });
})

app.post('/', (request, response) => {
    let req = request.body;
    database.insert(req);
    response.json(req);
})

app.post('/delete', (request, response) => {
    //let index = request.body.index;
    let element = request.body.element;
    database.remove( {"taskname": element}, {}, function(err, number){
        if(err){console.log(err)}
        database.loadDatabase();
    });
    response.json({element})
})


app.post('/cross', (request, response) => {
    //let index = request.body.index;
    let element = request.body.element;
    database.find()
    database.update({"taskname":element}, {$set: {"style":"line-through"}}, {}, function(){
        console.log(element)
        response.json({element});
        database.loadDatabase();
    })
})

// function parseit(value){
//     let index = parseInt(value)
//     database.remove( {"index": index}, {}, function(err, number){
//         if(err){console.log(err)}
//         database.loadDatabase();
//         console.log(index)
//     });
// };