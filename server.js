//-------------------------------------------
//  Tyler Hedegard
//  10/27/2015
//  Thinkful.com Node JS Shopping List Server
//-------------------------------------------

var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(index) {
    this.items.splice(index,1);
};

Storage.prototype.findIndex = function(id) {
    var index = null;
    for (var i=0; i< this.items.length; i++) {
        if (this.items[i].id == id) {
            var item = this.items[i];
            index = i;
            break;
        }
    }
    return index;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    //if id is not valid return json error message
    //else delete item[id] with status 200 (OK)
    var id = req.params.id;
    var index = storage.findIndex(id);
    if (index === null) {
        return res.sendStatus(400);
    }
    else {
        var item = storage.items[index];
        storage.delete(index);
        res.status(200).json(item);
    }
});

app.put('/items/:id', jsonParser, function(req,res) {
    //If successful, your endpoint should return the edited, with the appropriate status code.
    //If a non-existent ID is supplied, your endpoint should create a new item using the ID supplied.
    var id = req.params.id;
    var index = storage.findIndex(id);
    if (index === null) {
        var item = storage.add(req.body.name);
        res.status(201).json(item);
    }
    else {
        var item = req.body;
        storage.items[index] = item;
        res.status(200).json(item);
    }
});

app.listen(process.env.PORT || 8080);