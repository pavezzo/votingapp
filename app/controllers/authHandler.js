var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username: { type: String, unique: true},
    password: String
})

var User = mongoose.model('users', userSchema)

exports.auth = function(session, next) {

    if (session) {
        return next()
    } else {
        return false
    }
}

exports.register = function(data, callback) {

    var newUser = new User({ username: data.username, password: data.password })

    newUser.save(function(err) {
        if (err) {
            callback(true)
        } else {
            callback(false)
        }

    })
}


exports.login = function(data, callback) {

    User.findOne({ username: data.username }, function(err, user) {
        if (user == null) {
            callback(null)
        } else if (user.password === data.password) {
            callback(user)
        } else {
            callback(null)
        }
    })
}
