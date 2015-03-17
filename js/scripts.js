/*var partner = {
    id: QueryString('rid'),
    name: QueryString('rn')
},*/
var partner = QueryString('rn'),
    user = QueryString('sn'),
    message = QueryString('msg');

(function(j) {
    j(function() {
        j('title').text(partner.name);

        jWindow = j(window);
        wrapper = j('.wrapper').height(jWindow.height());
        jMessages = j('.messages');
        btnSend = j("#send");
        txtMessage = j("#message");

        var showMessage = function(message, sender) {
            jMessages.append('<div class="message">'+
            '	<div class="message-sender">' + sender + ': </div>' +
            '	<div class="message-body">' + message + '</div>'+
            '</div>');
        };

        if (message != undefined && user != undefined) {
            showMessage(message, user);
        }

        btnSend.click(function () {
            var text = txtMessage.val();
            socket.emit('send', {
                message: text,
                receiver: partner,
                sender: user
            });
            txtMessage.val("");
        });

        txtMessage.keyup(function (e) {
            if (e.keyCode == 13) {
                btnSend.click();
            }
        });
    });
})(jQuery);