
var wrapper =  jWindow = jMessages = btnStartChat = btnSend = txtAlias = txtMessage = jMembers = socket = {},
	alias = logStyle = '',
	users = {},
	messages = [];

(function(j) {
	j(function() {
		jWindow = j(window);
		wrapper = j('.wrapper').height(jWindow.height());
		btnStartChat = j('.btnStartChat');
		txtAlias = j('#alias');
		jMembers = j('.members');
		jMessages = j('.messages');

		btnStartChat.click(function () {
			alias = txtAlias.val();
			if (alias == "") {
				alert("Please type your alias!");
			} else {
				j(".start-page").hide();
				j(".main-window").show();
				jMembers.children('h4').text(alias);

				j('title').prepend(alias + ' :: ');
				initChatting();
			}
		});

		txtAlias.keyup(function (e) {
			if (e.keyCode == 13) {
				btnStartChat.click();
			}
		});

		var initChatting = function() {
			var html = '';

			socket = io.connect('/');
			//socket = io();

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

			socket.emit('add user', alias);

			socket.on('users online', function (data) {

				if (data.event == 'user joined') {
					logStyle = ' class="green" ';
				} else if (data.event == 'user left') {
					logStyle = ' class="red" ';
				}

				if (data.user != undefined && data.user != alias) {
					jMessages.append('<p ' + logStyle + '>' + dateToString(new Date()) + data.message + '</p>');
				}

				var membersHtml = "";
				users = data.users;
				delete users[alias];
				var k = Object.keys(users);
				k.sort();
				for (var i = 0; i < k.length; i++) {
					membersHtml += '<span class="member" data-id="' + users[k[i]].id + '" data-name="' + k[i] + '">' + k[i] + '</span>';
				}
				jMembers.html(membersHtml);
			});

			socket.on('message received', function (data) {
				if (data.message) {
					showMessage(data.message, (data.username ? data.username : 'Server'));
				} else {
					console.log("An unexpected error occurred:", data);
				}
			});
		};

		var dateToString = function(date) {
			return ('<small><b>[' + date.toLocaleString() + ']</b></small> ');
		};

		jWindow.resize(function() {
			wrapper.height(jWindow.height());
		});

		jMembers.delegate('.member', 'click', function() {
			var partner = j(this).data();
			if (partner.name != alias) {
				//window.open('/chat.html?rid=' + partner.id + '&rn=' + partner.name + '&sn=' + alias, partner.name, "width=400, height=550, menubar=0, location=0, resizable=0");
				window.open('/chat.html?rn=' + partner.name + '&sn=' + alias, partner.name, "width=400, height=550, menubar=0, location=0, resizable=0");
			}
		});
	});

})(jQuery);
