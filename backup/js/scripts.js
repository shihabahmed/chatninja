var partner = {
    id: QueryString('id'),
    name: QueryString('name')
};

(function(j) {
    j(function() {
        j('title').text(partner.name);

        btnSend.click(function () {
            var text = txtMessage.val();
            socket.emit('send', {
                message: text,
                username: alias
            });
            txtMessage.val("");
        });
    });
})(jQuery);