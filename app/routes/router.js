var pollHandler = require(process.cwd() + '/app/controllers/pollHandler.js'),
    authHandler = require(process.cwd() + '/app/controllers/authHandler.js')

module.exports = function(app) {

    app.route('/')
        .get(function(req, res) {
            res.redirect('/polls')
        })


    app.route('/polls/:uniqueID')
        .get(function(req, res) {
            var voterAddress = req.ip;
            if (req.session.user != null) {
                voterAddress = req.session.user;
            }

            pollHandler.viewOne(req.params.uniqueID, function(poll) {
                if (poll === null) {
                    res.redirect('/polls')
                } else {
                    res.render('singlePoll', { thisPoll: poll, voter: voterAddress, user: req.session.user })
                }
            })
        })

        .post(function(req, res) {
            var voter = req.ip;
            if (req.session.user != null) {
                voter = req.session.user;
            }

            pollHandler.updateVotes(req.params.uniqueID, req.body.vote, voter)

            res.redirect('/polls/' + req.params.uniqueID)
        })



    app.route('/polls')
        .get(function(req, res) {
            pollHandler.viewAll(function(polls) {
                res.render('polls', { allPolls: polls, user: req.session.user })
            })
        })


    app.route('/new')
        .get(function(req, res) {
            if (req.session.user) {
                res.render('new', { user: req.session.user })
            } else {
                res.redirect('/signin')
            }
        })

        .post(function(req, res) {
            pollHandler.new(req.body, req.session.user)

            res.redirect('/polls')
        })


    app.route('/signin')
        .get(function(req, res) {
            if (req.session.user != null) {
                res.render('signin', { user: req.session.user })
            } else {
                res.render('signin', { flash: req.flash('error')})
            }
        })

        .post(function(req, res) {
            authHandler.login(req.body, function(user) {
                if (user === null) {
                    req.flash('error', 'Invalid username or password!')
                    res.redirect('/signin')
                } else {
                    req.session.user = user.username;
                    res.redirect('/polls')
                }
            })
        })

    app.route('/register')
        .get(function(req, res) {

            res.render('register', { flash: req.flash('error') })
        })

        .post(function(req, res) {
            authHandler.register(req.body, function(err) {
                if (err) {
                    req.flash('error', 'Username already taken!')
                    res.redirect('/register')
                } else {
                    res.redirect('/signin')
                }
            })
        })


    app.route('/logout')
        .get(function(req, res) {
            req.session.destroy()
            res.redirect('/polls')
        })


    app.route('/delete')
        .post(function(req, res) {
            pollHandler.delete(req.body)
            res.redirect('/mypolls')
        })


    app.route('/mypolls')
        .get(function(req, res) {
            pollHandler.viewMy(req.session.user, function(polls) {
                res.render('mypolls', { allPolls: polls, user: req.session.user })
            })
        })


    app.route('/edit/:uniqueID')
        .get(function(req, res) {
            pollHandler.viewOne(req.params.uniqueID, function(poll) {
                if (poll === null) {
                    res.redirect('/polls')
                } else {
                    res.render('edit', { thisPoll: poll, user: req.session.user })
                }
            })
        })

        .post(function(req, res) {
            pollHandler.edit(req.params.uniqueID, req.body)
            res.redirect('/polls/' + req.params.uniqueID)
        })


    app.route('*')
        .get(function(req, res) {
            res.redirect('/polls')
        })

}
