var mongoose = require('mongoose')

var pollSchema = mongoose.Schema({
    title: String,
    uniqueID: Number,
    choices: [{
        _id: false,
        votes: Number,
        choice: String
    }],
    date: String,
    author: String,
    usersVoted: [String]
})

var PollModel = mongoose.model('PollModel', pollSchema)


exports.new = function(data, user) {

    var object = [];

    for (var i = 0; i < data.choice.length; i++) {
        if (data.choice[i] == '') continue;

        object.push({
            choice: data.choice[i],
            votes: 0
        })
    }


    var uID = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)

    var newestPoll = new PollModel( { title: data.title, uniqueID: uID, choices: object, date: new Date().toJSON(), author: user, usersVoted: ['']} )

    newestPoll.save(function(err) {
        if (err) return console.error(err);
    })
}


exports.viewAll = function(callback) {

    PollModel.find({ }, null, {sort: '-date'}, function(err, docs) {
        var data = docs;
        callback(data)
    })

}


exports.viewOne = function(id, callback) {

    PollModel.findOne({ 'uniqueID': id }, '-_id', function(err, poll) {
        var data = poll;
        callback(data)
    })
}


exports.viewMy = function(user, callback) {

    PollModel.find({ author: user }, null, {sort: '-date'}, function(err, polls) {
        var data = polls;
        callback(data)
    })
}


exports.updateVotes = function(id, vote, voter) {

    PollModel.findOne({ uniqueID: id }, function(err, poll) {

        if (poll.usersVoted.indexOf(voter) === -1) {
            poll.choices[vote].votes++;
            poll.usersVoted.push(voter)

            poll.save(function(err) {
                if (err) return console.error(err);
            })
        }

    })

}


exports.delete = function(poll) {

    PollModel.remove({ uniqueID: poll.Delete }, function(err) {
        if (err) return console.error(err)
    })
}


exports.edit = function(id, choices) {

    PollModel.findOne({ uniqueID: id }, function(err, poll) {
        for (var i = 0; i < choices.choice.length; i++) {
            if (poll.choices[i] == null) {
                poll.choices[i] = { votes: 0, choice: choices.choice[i]};
                continue
            } else if (choices.choice[i] === poll.choices[i].choice) {
                continue
            }

            poll.choices[i].choice = choices.choice[i];
            poll.choices[i].votes = 0;
        }

        poll.save(function(err) {
            if (err) return console.error(err);
        })
    })
}
