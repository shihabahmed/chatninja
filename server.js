var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile('/index.html');
});

http.listen(process.env.PORT || 3000);


var online_users = {};

io.on('connection', function(socket){
    socket.on('disconnect', function() {
        delete online_users[socket.username];
        io.emit('_user_left', { user: { id: socket.id, name: socket.username } });
        io.emit('_users_online', { users: online_users, user: socket.username, event: 'user left', message: socket.username + ' has left <em><ins>ChatNinja</ins></em>...' });
    });

    socket.on('_join', function(username) {
        if (username in online_users) {
            io.to(socket.id).emit('_login_status', { status: 'error', user: { id: socket.id, name: username }, message: username + ' is not available. Try another.' });
        } else {
            socket.join(username);
            socket.username = username;

            io.emit('_login_status', { status: 'success', user: { id: socket.id, name: username } });

            online_users[username] = {id: socket.id};
            io.emit('_users_online', {
                users: online_users,
                user: username,
                event: 'user joined',
                message: username + ' has joined <em><ins>ChatNinja</ins></em>...'
            });
        }
    });

    socket.on('_send', function(data) {
        io.to(data.receiver.id).emit('_message_received', data);
    });
});
