const path = require ('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app= express()
const port= 3000
const hostname='127.0.0.1'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload= require('express-fileupload')
const generateDate = require('./helpers/generateDate').generateDate
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')
//const MongoDbStore = require('connect-mongodb-session')
const methodOverride= require('method-override')







mongoose.connect('mongodb://127.0.0.1/node2_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})

app.use(expressSession(
    {
      secret: 'testotesto',
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ 
        mongoUrl: 'mongodb://localhost/node2'}),
      
    }));

/*const mongoStore= new connectMongo(expressSession)

app.use(expressSession( {
    secret: 'testotesto',
    resave: false,
    saveUninitialized:true,

}))
*/

app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

app.use(fileUpload())

app.use(express.static('public'))

app.use(methodOverride('_method'))

app.engine('handlebars', exphbs.engine({helpers:{generateDate:generateDate}}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use((req,res, next) => {
    const {userId}= req.session
    if (userId) {
        res.locals= {
            displayLink: true
        }
    } else {
            res.locals= {
            displayLink: false
        }
    }
    next()
})




const main= require('./routes/main')
const posts= require('./routes/posts')
const users= require('./routes/users')
const admin=require('./routes/admin/index')

app.use('/', main)
app.use('/posts', posts)
app.use('/users', users)
app.use('/admin', admin)

app.listen(port, hostname, () => {
    console.log(`server ok, http://${hostname}: ${port}/`)
})