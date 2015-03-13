
var wrapper =  jWindow = jMessages = btnStartChat = btnSend = txtAlias = txtMessage = jMembers = socket = {},
	alias = '',
	messages = [];

(function(j) {
	j(function() {
		jWindow = j(window);
		wrapper = j('.wrapper').height(jWindow.height());
		jMessages = j('.messages');
		btnStartChat = j('.btnStartChat');
		txtAlias = j('#alias');
		btnSend = j("#send");
		txtMessage = j("#message");
		jMembers = j('.members');

		btnStartChat.click(function () {
			alias = txtAlias.val();
			if (alias == "") {
				alert("Please type your alias!");
			} else {
				j(".start-page").hide();
				j(".chat-window").show();

				j('title').prepend(alias + ' :: ');
				startChatting();
			}
		});

		txtAlias.keyup(function (e) {
			if (e.keyCode == 13) {
				btnStartChat.click();
			}
		});

		/*btnSend.click(function () {
			var text = txtMessage.val();
			socket.emit('send', {
				message: text,
				username: alias
			});
			txtMessage.val("");
		});*/

		txtMessage.keyup(function (e) {
			if (e.keyCode == 13) {
				btnSend.click();
			}
		});

		var startChatting = function() {
			//socket = io.connect('/');
			var html = '';

			socket = io();
			socket.emit('add user', alias);

			socket.on('users online', function (data) {
				var membersHtml = "";
				var k = Object.keys(data);
				k.sort();
				for (var i = 0; i < k.length; i++) {
					membersHtml += '<span class="member" data-id="' + data[k[i]].id + '" data-name="' + k[i] + '">' + k[i] + '</span>';
				}
				jMembers.html(membersHtml);
			}).on('message received', function (data) {
				if (data.message) {
					html = '<div class="message">'+
							'	<div class="message-sender">' + (data.username ? data.username : 'Server') + ': </div>' +
							'	<div class="message-body">' + data.message + '</div>'+
							'</div>';
					jMessages.append(html);
					//content.scrollTop = content.scrollHeight;
					//$("#content").scrollTop($("#content")[0].scrollHeight);
				} else {
					console.log("There is a problem:", data);
				}
			});
		}

		jWindow.resize(function() {
			wrapper.height(jWindow.height());
		});

		jMembers.delegate('.member', 'click', function() {
			var partner = j(this).data();
			window.open('/chat.html?id=' + partner.id + ' + name=' + partner.name, partner.name, "width=400, height=550, menubar=0, location=0, resizable=0");
		});
	});

})(jQuery);
