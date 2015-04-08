$.fn.editable.defaults.mode = 'inline';
var products;
var prod_id;
var product_url;
var personas_url;
var email;

OAuth.initialize('K2P2q3_J6a76xcMJCcRRYTrbJ2c'); // TODO: hide this key somewhere via an ajax call? 
$.cookie.json = true;
$.ajaxSetup({
	/*beforeSend: function(xhr, settings) {
		xhr.setRequestHeader("x-csrf-token", getCookie('XSRF-TOKEN')); // TODO: $.cookie is broken here???
	},*/
  cache: false // TODO: find a better way to avoid HTTP 304 instances that don't return the $.get results
});

$(window).load(function() {
  // TODO: get this working without forcing another auth - saved identity token on server???
  if ($.cookie('email') && $.cookie('oauth')/* && getCookie('XSRF-TOKEN')*/) {
		email = $.cookie('email');
		$.get('/users/' + email, function(user) {
  		products = user.products;
  		var cur = typeof user.currentProduct === "number" ? user.currentProduct : 0;
      prod_id = products[cur].id; 
      init();
		});
  } else {
    doAuthentication(function(data) {
      $.cookie('email', data.user.email);
      email = data.user.email;
      $.cookie('oauth', data.oauth);
      products = data.user.products;
      prod_id = products[0].id; // TODO: fetch the product they were last using
      init();
    });
  }
});

function doAuthentication(callback) {
  retrieve_token(function(err, token) {
    if (err) {
      console.error(err);
    } else {
      authenticate(token, function(err, data) {
        if (data.success) {
          callback(data);
        }
      });
    }
  });
}

function retrieve_token(callback) {
	$.ajax({
		url: '/oauth/token',
		success: function(data, status) {
			callback(null, data.token);
		},
		error: function(data) {
			callback(data);
		}
	});
}

function authenticate(token, callback) {
	OAuth.popup('google', {
		state: token,
		// Google requires the following field 
		// to get a refresh token
		//authorize: {
		//  approval_prompt: 'force'
		//}
	})
		.done(function(r) {
			$.ajax({
				url: '/oauth/signin',
				method: 'POST',
				data: {
					code: r.code
				},
				success: function(data, status) {
					callback(null, data);
				},
				error: function(data) {
					callback(data);
				}
			});
		})
		.fail(function(e) {
			console.log(e);
		});
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function changeProduct(ix, callback) {
  $.post('/users/' + email, {currentProduct: ix}, function(data) {
    if (data.success) {
      if (callback) callback();
    } else {
      console.error(data.error);
    }
  })
}

function init() {
  
  product_url = "/products/" + prod_id;
  
  for (var p = 0; p < products.length; p++) {
    if (products[p].id == prod_id) {
      $("#products").append('<li class="active"><a href="#" class="products">' + products[p].name + '</a></li>');
    } else {
      $("#products").append('<li><a href="#" class="products">' + products[p].name + '</a></li>');
    }
  }
  $("#products a.products").click(function(event) {
    var $a = $(this);
    var $li = $a.parent();
    changeProduct($li.index(), function() {
      location.reload();
    });
  });
  $("#products").append('<li class="divider"></li><li><a href="#"><span class="glyphicon glyphicon-plus"></span>New Product</a></li>');
  
	//$('[data-toggle="popover"]').popover({
	//	html: true,
	//	content: userResearchInfo
	//});
	//$('#requestEvaluation').on('hidden.bs.modal', function() {
	//	$("#evaluationResults").show();
	//});
	//$('input:file').change(function() {
	//	$('[data-target="#requestEvaluation"]').prop('disabled', false);
	//});
	
	personas_url = product_url + "/personas";
	
	createUserWidget(personas_url);
  
  $(document).on('hidden.bs.modal', '.modal', function(event) {
    // refresh relevant widget
    var widget = event.currentTarget.widget;
    if (widget)
      widget._refresh();
  });
	
	$.get(product_url, function (data) {
		var prod_name = data.name;
		$("#productName").text(prod_name);
	});
}