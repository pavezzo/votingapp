var express     =  require('express')
var mongoose    = require('mongoose')
var routes      = require('./app/routes/router.js')
var bodyParser  = require('body-parser')
var pug         = require('pug')
var session     = require('express-session')
var flash       = require('req-flash')

var app = express()

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(session({
    secret: 'dogsandcats123',
    saveUninitialized: true,
    resave: true
 }))
app.use(flash())

app.set('view engine', 'pug')

app.enable('trust proxy')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/votingapp')


routes(app)

app.listen(process.env.PORT || 8000)
