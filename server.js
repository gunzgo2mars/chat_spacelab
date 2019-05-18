const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const http = require('http').Server(app)
const io = require('socket.io')(http)


var dbUrl = 'mongodb+srv://gunzgo2mars:9jrvrZWyLDjpJlZK@cluster0-awosf.mongodb.net/test?retryWrites=true'


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.static(__dirname))

var message = mongoose.model('message' , { name : String , message : String })

io.on('connection' , () => {

    console.log('user is connected')

})

app.get('/messages' , (req, res) => {

    message.find({} , (err , messages) => {
        if(err)
            console.log(err)

        res.send(messages)
    })

})

app.post('/messages' , (req , res) => {

    var messageBody = new message(req.body)

    messageBody.save((err) => {

        if(err){
            res.sendStatus(500)
        }
        io.emit('message', req.body)
        
        res.sendStatus(200)

    })

})

mongoose.connect(dbUrl , {useMongoClient : true} , (err) => {

    if(err)
        console.error(err)

    console.log('Ignition Start!')

})


const server = http.listen(3000 , () => {
    console.log('server is running on space station' , server.address().port)
})