$.fn.editable.defaults.mode = 'inline';
var products;
var prod_id;
var product_url;
var personas_url;

OAuth.initialize('K2P2q3_J6a76xcMJCcRRYTrbJ2c'); // TODO: hide this key somewhere in an ajax call? 
$.cookie.json = true;

$(window).load(function() {
  if (!getCookie('XSRF-TOKEN')) {
    retrieve_token(function(err, token) {
      if (err) {
        console.error(err);
      } else {
        authenticate(token, function(err, data) {
          if (data.success) {
            products = data.user.products;
            prod_id = products[0].id; // TODO: fetch the product they were last using
            init();
          }
        });
      }
    });
  }
});

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
		  //approval_prompt: 'force'
		//}
	})
		.done(function(r) {
  		$.ajaxSetup({
    		beforeSend: function(xhr, settings) {
    			xhr.setRequestHeader("x-csrf-token", getCookie('XSRF-TOKEN'));
    		}
  		});
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

function userResearchInfo() {
	var x = 'js + html test';
	return x;
}

function init() {
  
  //product_url = "http://localhost:3000/products/" + prod_id;
  product_url = "/products/" + prod_id;
  
  for (var p = 0; p < products.length; p++) {
    if (products[p].id == prod_id) {
      $("#products").append('<li class="active"><a href="#">' + products[p].name + '</a></li>');
    } else {
      $("#products").append('<li><a href="#">' + products[p].name + '</a></li>');
    }
  }
  
	$('[data-toggle="popover"]').popover({
		html: true,
		content: userResearchInfo
	});
	$('#requestEvaluation').on('hidden.bs.modal', function() {
		$("#evaluationResults").show();
	});
	$('input:file').change(function() {
		$('[data-target="#requestEvaluation"]').prop('disabled', false);
	});
	
	personas_url = product_url + "/personas";
	// TODO: move into a separate file/database so lots of wigets can exist in PMBoard
	$('#widgets').boardwidget({
    title: 'Who are your users?',
    columns: ['Name', 'Evidence'],
    wrappers: [
      '<a href="#" class="editable-value editable-click" data-name="persona{i}" data-type="text" data-pk="{i}">',
      '<button type="button" class="evidence btn btn-default label-danger label" data-toggle="popover" data-placement="top" data-trigger="focus" title="Number of pieces of evidence" data-content="lorem ipsum">'
    ],
    api: personas_url,
    addmoreText: "Add another user type",
    addmoreAtts: {
      id: 'newpersona'
    },
    deleteItem: function(Elem) {
  		$.ajax({
  			method: 'delete',
  			url: personas_url, // this.options.api
  			dataType: 'json',
  			contentType: 'application/json; charset=utf-8',
  			data: JSON.stringify({
    			pk: $(Elem).parent().find('a.editable-value').attr("data-pk")
  			}),
  			success: function() {
  				$(Elem).parent().remove();
  			}
  		});
    }
  });
	
	$.get(product_url, function (data) {
		var prod_name = data.name;
		$("#productName").text(prod_name);
	});
}