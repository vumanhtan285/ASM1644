const express = require('express')
const hbs = require('hbs')
const session = require('express-session')

var app = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'asdadsaswetgergs',
    cookie: {maxAge : 60000}
}))

app.set('view engine','hbs')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://vumanhtan285:vumanhtan123@cluster0.iqsl6.mongodb.net/test";

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extend:false}));

app.use(express.static('public'))

const dbhandle = require('./databaseHandle')

app.post('/search', async (req,res)=>{
    const searchbox = req.body.txtName;
    const results = await dbhandle.searchProduct(searchbox,"Product")
    res.render('allProduct',{model:results})
})

app.post('/update', async (req,res)=>{
    var id = req.body.id;
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newvalue = {$set : {name:nameInput, price:priceInput}};
    var ObjectID = require('mongodb').ObjectID;
    var condition = {"_id" : ObjectID(id)};

    var client = await MongoClient.connect(url);
    var dbo = client.db("VuManhTan");
    await dbo.collection("Product").updateOne(condition,newvalue);
    res.redirect('/view');
})

notDelete = ['IP','SS'];

app.get('/delete', async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client = await MongoClient.connect(url);
    const dbo = client.db("VuManhTan");
    const productdelete = await dbo.collection("Product").findOne(condition);
    const index = notDelete.findIndex((e)=>e==productdelete.name);
    if (index!=-1){
        res.end('Cannot delete')
    }
    else{
        await dbo.collection("Product").deleteOne(condition);
        res.redirect('/view');
    }

})

app.get('/edit', async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectID(id)};

    const client = await MongoClient.connect(url);
    const dbo = client.db("VuManhTan");
    const productedit = await dbo.collection("Product").findOne(condition);
    res.render('edit',{product:productedit})
})

app.get('/view', async (req,res)=>{
    const results = await dbhandle.searchProduct('',"Product")
    var userNamee = 'Not logged in';
    if(req.session.userName){
        userNamee = req.session.userName;
    }
    res.render('allProduct',{model:results,userName:userNamee})
})

app.post('/doInsert', async (req,res)=>{
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice; 
    var newProduct = {name:nameInput, price:priceInput, size:{length:20, weight:10}}
    await dbhandle.insertProduct(newProduct,"Product");
    res.render('index')
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.post('/doRegister', async(req,res)=>{
    const userinput = req.body.txtUsername;
    const passinput = req.body.txtPassword;
    const newuser = {username:userinput,password:passinput};
    await dbhandle.insertProduct(newuser,"Users");
    res.redirect('/')
})

app.post('/login', async (req,res)=>{
    const userinput = req.body.txtUsername;
    const passinput = req.body.txtPassword;
    const found = await dbhandle.checkUser(userinput,passinput);
    if(found){
        res.render('index',{loginUser:userinput})
        req.session.userName = nameinput;
    }
    else{
        res.render('index',{errorLogin:"Login failed!"})
    }
})

app.get('/insert',(req,res)=>{
    res.render('insert')
})

app.get('/',(req,res)=>{
    var userNamee = 'Login first, please !';
    if(req.session.userName){
        userNamee = req.session.userName;
    }
    res.render('index',{loginUser:userNamee})
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Server is running at: ' + PORT);