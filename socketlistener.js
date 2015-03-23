module.exports = {
    init: function(io) {
        var users = {};

        io.on('connection', function(socket){
            socket.on('disconnect', function() {
                delete users[socket.username];
                io.emit('user left', { user: { id: socket.id, name: socket.username } });
                io.emit('users online', { users: users, user: socket.username, event: 'user left', message: socket.username + ' has left <em><ins>ChatNinja</ins></em>...' });
            });

            socket.on('join', function(username) {
                if (username in users) {
                    io.to(socket.id).emit('login status', { status: 'error', user: { id: socket.id, name: username }, message: username + ' is not available. Try another.' });
                } else {
                    socket.join(username);
                    socket.username = username;

                    io.emit('login status', { status: 'success', user: { id: socket.id, name: username } });

                    users[username] = {id: socket.id};
                    io.emit('users online', {
                        users: users,
                        user: username,
                        event: 'user joined',
                        message: username + ' has joined <em><ins>ChatNinja</ins></em>...'
                    });
                }
            });

            socket.on('send', function(data) {
                io.to(data.receiver.name).emit('message received', data);
            });
        });
    }
}
