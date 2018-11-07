function transitForms(elem) {
	$(elem).closest('.card-body').find('#err').hide();
	$(elem).closest('.card-body').find('#regSucc').hide();
}

function showLoginError(message) {
	$('.logInDisplay').find('#err b').text(message);
	$('.logInDisplay').find('#err').show();
	$('.logInDisplay').find('#regSucc').hide();
}

function showLoginSuccess(message) {
	$('.logInDisplay').find('#regSucc b').text(message);
	$('.logInDisplay').find('#err').hide();
	$('.logInDisplay').find('#regSucc').show();
}

$('#inputLoginFeilds').keyup(function(event){
	if(event.keyCode == 13){
		$(document).find('#logInBtn').click();
	}
});

$('#inputRegisterFeilds').keyup(function(event){
	if(event.keyCode == 13){
		$('#registerBtn').click();
	}
})

$(document).on('click', '#close_error', function() {
	$(this).parent().hide();
});

$(document).on('click', '#signUpLink', function() {
	var elem = this;
	$(elem).closest('.card-body').find('#inputLoginFeilds').hide();
	$(elem).closest('.card-body').find('#inputRegisterFeilds').show();
	transitForms(elem);
});

$(document).on('click', '#logInLink', function() {
	var elem = this;
	$(elem).closest('.card-body').find('#inputLoginFeilds').show();
	$(elem).closest('.card-body').find('#inputRegisterFeilds').hide();
	transitForms(elem);
});

(function register() {
	$('#registerBtn').click(function() {
		//Clear previously set values
		param = new Object({
			name: $('#inputRegisterFeilds input[name=name]').val(),
			username: $('#inputRegisterFeilds input[name=username]').val(),
			password: $('#inputRegisterFeilds input[name=password]').val(),
			cnfpassword: $('#inputRegisterFeilds input[name=cnfpassword]').val(),
			email: $('#inputRegisterFeilds input[name=email]').val()
		});
		console.log(param);

		$.ajax({
			type: 'POST',
			url: '/user/register/',
			data: param,
			success: function(data) {
				$("#inputRegisterFeilds").hide();
				$("#inputLoginFeilds").show();
				showLoginSuccess(data.message);
			},
			statusCode: {
				400: function(res) {
					var data = res.responseJSON;
					showLoginError(data.message);
					for (var ech in data.errors) {
						$("#inputRegisterFeilds input[name=" + data.errors[ech].param + "]").val("");

						$("#inputRegisterFeilds input[name=" + data.errors[ech].param + "]").attr("placeholder", data.errors[ech].msg);
						$("#inputRegisterFeilds input[name=" + data.errors[ech].param + "]").css({
							"border": "1px solid #bfbfbf"
						});
					}
				},
				401: function(res) {
					showLoginError(res.responseJSON.message);
				}
			}
		});
	});
})();

(function logIn() {
	$('#logInBtn').click(function() {
		param = new Object({
			username: $('#inputLoginFeilds input[name=username]').val(),
			password: $('#inputLoginFeilds input[name=password]').val()
		});
		console.log(param);
		$.ajax({
			type: 'POST',
			data: param,
			url: '/user/login',
			statusCode: {
				200 : function(res){
					window.location = "/";
				},
				400 : function(res){
					showLoginError(res.responseJSON.message);
				},
				401 : function(res) {
					showLoginError(res.responseJSON.message);
				}
			}
		});
	});
})();

(function logOut() {
	$('#logoutBtn').click(function() {
		document.getElementById("#inputLoginFeilds").submit();
	});
})();
