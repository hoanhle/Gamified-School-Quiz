'use strict';

// load routers
const UsersRouter = require('./routes/users');
const HelloRouter = require('./routes/hello');
const MngRouter = require('./routes/managementView');
const GameRouter = require('./routes/game');

// Setup Routes
module.exports = function(app) {
    app.use('/users', UsersRouter);
    app.use('/', HelloRouter);
    app.use('/management', MngRouter);
    app.use('/game', GameRouter);
};
