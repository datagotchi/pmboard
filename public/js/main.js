$.fn.editable.defaults.mode = 'inline';
var products;
var prod_id;
var product_url;
var personas_url;

OAuth.initialize('K2P2q3_J6a76xcMJCcRRYTrbJ2c'); // TODO: hide this key somewhere via an ajax call? 
$.cookie.json = true;

$(window).load(function() {
  // TODO: get this working without forcing another auth - saved identity token on server???
  if ($.cookie('email') && getCookie('XSRF-TOKEN')) {
    $.ajaxSetup({
  		beforeSend: function(xhr, settings) {
  			xhr.setRequestHeader("x-csrf-token", getCookie('XSRF-TOKEN')); // FIXME $.cookie is broken here???
  		}
		});
		var email = $.cookie('email');
		$.get('/user/' + email, function(user) {
  		products = user.products;
      prod_id = products[0].id; // TODO: fetch the product they were last using
      init();
		});
  } else {
    doAuthentication();
  }
});

function doAuthentication() {
  retrieve_token(function(err, token) {
    if (err) {
      console.error(err);
    } else {
      authenticate(token, function(err, data) {
        if (data.success) {
          $.cookie('email', data.user.email);
          $.cookie('oauth', data.oauth);
          products = data.user.products;
          prod_id = products[0].id; // TODO: fetch the product they were last using
          init();
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
  		$.ajaxSetup({
    		beforeSend: function(xhr, settings) {
    			xhr.setRequestHeader("x-csrf-token", getCookie('XSRF-TOKEN')); // FIXME $.cookie is broken here???
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
  
  product_url = "/products/" + prod_id;
  
  for (var p = 0; p < products.length; p++) {
    if (products[p].id == prod_id) {
      $("#products").append('<li class="active"><a href="#">' + products[p].name + '</a></li>');
    } else {
      $("#products").append('<li><a href="#">' + products[p].name + '</a></li>');
    }
  }
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
	
	$(document).on('shown.bs.modal', '.modal', function(event) {
    $('.modal .editable-value').editable({
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
  });
  
  $(document).on('hidden.bs.modal', '.modal', function(event) {
    // refresh relevant widget
    var widget = event.currentTarget.widget;
    if (widget)
      widget._refresh();
  });
	
	
	// TODO: move into a separate file/database so lots of widgets can exist in PMBoard
	var userwidget = new boardWidget({
    title: 'Who are your users?',
    id: "users",
    columns: ['Name'],
    wrappers: [
      '<a href="#" data-toggle="modal">',
      //'<a href="#" class="editable-value editable-click" data-name="persona{i}" data-type="text" data-pk="{i}">',
      //'<button type="button" class="evidence btn btn-default label-danger label" data-toggle="popover" data-placement="top" data-trigger="focus" title="Number of pieces of evidence" data-content="lorem ipsum">'
    ],
    api: personas_url,
    addmoreText: "Add another user type",
    addmoreAtts: {
      id: 'newpersona'
    }, 
    container: '#widgets',
    success: function() {
      
      userwidget.addModalTab({
        label: 'Details',
        content: '<strong>Name: </strong> <a href="#" class="editable-value editable-click" data-name="persona{i}" data-type="text" data-pk="{i}" data-url="' + personas_url + '">{data.name}</a>'
      });
      
      $.get("listFiles.html", function(html) {
        userwidget.addModalTab({
          label: 'Evidence',
          content: html
        });
      });
      
      $("#loading").hide();
    },
    modalShown: function() {
      // set up the evidence tab
      var oauth = JSON.parse($.cookie('oauth'));
      var accessToken = oauth.access_token;
    
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://www.googleapis.com/drive/v2/files", true);
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.onload = function (evt) {
        if (xhr.status != 200) {
          if (xhr.status == 401) { // google 'invalid credentials'
            return doAuthentication();
          }
        }
        var response = JSON.parse(xhr.responseText);
        var table = userwidget.modal.elem.find("table#files tbody");
        for (var i = 0; i < response.items.length; i++) {
            var item = response.items[i];
            var tr = $("<tr>");
            var td1 = $("<td>")
            td1.html("<input type='checkbox'>");
            tr.append(td1);
            var td2 = $("<td>");
            td2.html("<a href='" + item.alternateLink + "' target='_blank'>" +
                           "<img src='" + item.iconLink + "'>" + 
                           item.title + "</a>");
            tr.append(td2);
            table.append(tr);
        }
      };
      xhr.send();
      $(document).on('click', ':checkbox', function(event) {
        var $this = $(this);
        var $tr = $this.parent().parent();
        if ($this.prop('checked')) {
          $tr.addClass('success');
          addEvidence($tr);
        } else {
          $tr.removeClass('success');
        }
      });
    }
  });
	
	// TODO: turn productName into x-editable (along with a tagline)
	$.get(product_url, function (data) {
		var prod_name = data.name;
		$("#productName").text(prod_name);
	});
}

function addEvidence($tr) {
  $.ajax({
    method: 'PUT',
    url: null,
    success: function(data) {
      
    },
    error: function(data) {
      
    }
  });
}