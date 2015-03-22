$.fn.editable.defaults.mode = 'inline';
var products;
var prod_id;
var product_url;
var personas_url;

OAuth.initialize('K2P2q3_J6a76xcMJCcRRYTrbJ2c');
$.cookie.json = true;

$(window).load(function() {
	var cookie = $.cookie('oauth');
  if (!cookie || !cookie.provider || !cookie.oauth_token || !cookie.oauth_token_secret) {
    OAuth.popup('twitter')
        .done(function(result) {
          login(result.toJson());
        })
        .fail(function (err) {
          console.error(err);
        }
    );
  } else {
    login(cookie);
  }
});

function login(oauthObj) {
  $.ajax({
    url: 'http://localhost:3000/user/login',
    method: 'post',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(oauthObj),
    success: function(data) {
      if (data.success) {
        products = data.user.products;
        prod_id = products[0].id; // TODO: fetch the product they were last using
        $.cookie('oauth', data.user.oauth);
        init();
      } else {
        console.error(data.msg);
      }
    },
    error: function(err) {
      console.error(err.statusText);
    }
  });
}

function userResearchInfo() {
	var x = 'js + html test';
	return x;
}

//$(document).ready(function() {
function init() {
  product_url = "http://localhost:3000/products/" + prod_id;
  personas_url = product_url + "/personas";
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
	$(document).on('click', '.remove-persona', function(e) {
		var This = this;
		$.ajax({
			method: 'delete',
			url: personas_url,
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({
  			pk: $(This).next().attr("data-pk")
			}),
			//'{"pk": "' + $(This).next().attr("data-pk") + '"}',
			success: function() {
				$(This).parent().remove();
			}
		});
	});
	
	$.get(product_url, function (data) {
		var prod_name = data.name;
		$("#productName").text(prod_name);
	});
	
	$('.new-value').editable({
		value: '',
		showbuttons: false,
		params: function(params) { return JSON.stringify(params); },
		onblur: 'submit',
		url: personas_url,
		ajaxOptions: {
			type: 'put',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8'
		},
		success: function(response, newValue) {
			if (typeof response == "object") {
				if (response.success) {
					updatePersonas(response.personas);
					$(this).editable('toggle');
				} else {
					return response.error;
				}
			} 
		}
	});
	
	function updatePersonas(personas) {
		$("#personas .list-group").empty();
		for (var i = 0; i < personas.length; i++) {
			var persona = personas[i];
			$("#personas .list-group").append(
				'<li class="list-group-item input-group">'
		    + '<button class="btn btn-default glyphicon glyphicon-remove remove-persona" type="button"></button>'
    		+ '<a href="#" class="editable-value editable-click" data-name="persona' + i + '" data-type="text" data-pk="' + i +'">' + persona.name + '</a>&nbsp;&nbsp;' 
    		+ '<button type="button" class="evidence btn btn-default label-danger label" data-toggle="popover" data-placement="top" data-trigger="focus" title="Number of pieces of evidence" data-content="lorem ipsum">0</button>'
        + '</li>'
			);
		}
		
		$('.editable-value').editable({
			showbuttons: false,
			params: function(params) { return JSON.stringify(params); },
			onblur: 'submit',
			url: personas_url,
			ajaxOptions: {
				type: 'post',
				dataType: 'json',
				contentType: 'application/json; charset=utf-8'
			},
			success: function(response, newValue) {
				if (typeof response == "object" && !response.success) {
					return response.error;
				}
			},
			error: function(a, b) {
				console.err(a, b);
			}
		});
	}
		
	$.get(personas_url, updatePersonas);
	
//});
}