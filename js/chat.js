
var wrapper =  jWindow = jMessagesContainer = btnStartChat = btnSend = txtAlias = txtMessage = jMembers = socket = {},
	alias = logStyle = partner = cssClass = '',
	user = users = {},
	messages = [];

(function(j) {
	j(function() {
		jWindow = j(window);
		wrapper = j('.wrapper').height(jWindow.height());
		btnStartChat = j('.btnStartChat');
		txtAlias = j('#alias');
		jMembers = j('.members');
		jMessagesContainer = j('.messages-container');
		btnSend = j("#send");
		txtMessage = j("#message");

		//socket = io.connect('/');
		socket = io();

		btnStartChat.click(function () {
			alias = txtAlias.val();

			if (alias == "") {
				alert("Please type your alias!");
			} else {
				j(".start-page").hide();
				j(".main-window").show();
				jMembers.siblings('h4').text(alias);

				j('title').prepend(alias + ' :: ');

				initChatting();
			}
		});

		txtAlias.keyup(function (e) {
			if (e.keyCode == 13) {
				btnStartChat.click();
			}
		});

		var dateToString = function(date) {
			return ('<small><b>[' + date.toLocaleString() + ']</b></small> ');
		};

		var transformMessage = function(message) {
			return message;
		};

		var showMessage = function(data) {
			if (data.sender == user) {
				j('.messages[data-user="' + data.receiver.id + '"]')
					.append('<div class="message sender">'+
					'	<div class="message-sender">Me: </div>' +
					'	<div class="message-body">' + data.message + '</div>'+
					'</div>');
			} else {
				j('.messages[data-user="' + data.sender.id + '"]')
					.append('<div class="message receiver">'+
					'	<div class="message-sender">' + data.sender.name + ': </div>' +
					'	<div class="message-body">' + data.message + '</div>'+
					'</div>');

				var member = j('.member[data-id=' + data.sender.id + ']');

				if (!member.hasClass('active')) {
					member.addClass('highlight');
				}
			}
		};

		var initChatting = function() {
			var html = '';

			socket.emit('join', alias);

			btnSend.click(function () {
				var text = txtMessage.val();
				var data = {
					message: text,
					receiver: partner,
					sender: user
				};

				showMessage(data);

				socket.emit('send', data);
				txtMessage.val("");
			});

			txtMessage.keyup(function (e) {
				if (e.keyCode == 13) {
					btnSend.click();
				}
			});

			socket.on('users online', function (data) {
				var membersHtml = "";
				users = data.users;
				user = {
					id: users[alias].id,
					name: alias
				};

				delete users[alias];
				var k = Object.keys(users);
				k.sort();
				for (var i = 0; i < k.length; i++) {
					if (j('.messages[data-user=' + users[k[i]].id + ']').length < 1) {
						jMessagesContainer.append('<div class="messages" data-user="' + users[k[i]].id + '"><div class="user">' + k[i] + '</h5></div>');
					}
					membersHtml += '<span class="member" data-id="' + users[k[i]].id + '" data-name="' + k[i] + '">' + k[i] + '</span>';
				}
				jMembers.html(membersHtml);
			});

			socket.on('user left', function(data) {
				jMessagesContainer.children('.messages[data-user=' + data.user.id + ']').remove();
			});

			socket.on('message received', function (data) {
				if (data.message) {
					showMessage(data);
				} else {
					console.log("An unexpected error occurred:", data);
				}
			});
		};

		jWindow.resize(function() {
			wrapper.height(jWindow.height());
		});

		jMembers.delegate('.member', 'click', function() {
			partner = j(this).data();
			j(this).removeClass('highlight');
			j('.messages.active, .member.active').removeClass('active');
			j('.messages[data-user=' + partner.id + '], .member[data-id=' + partner.id + ']').addClass('active');
		});
	});

})(jQuery);
