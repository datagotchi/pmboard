angular.module('pmboard').controller('dashboardController', ['$scope', 'userService', 'productService', function($scope, userService, productService) {
  
  var debugUserId = '55271181777f411b3a90a2a5';
  
  $scope.products = [];
  $scope.user = null;
  $scope.currentProduct = null;
  
  $scope.userWidget = {
    columns: [{name: 'User', value: 'name'}, {name: 'Validation', value: 'evidence.length'}]
  };
  
  $scope.changeProduct = function(index) {
    userService.changeCurrentProduct($scope.user._id, index).then(function() {
      $scope.currentProduct = $scope.products[index];
      $scope.user.currentProduct = index;
      refreshUserWidget();
    });
  };
  
  $scope.createProduct = function() {
    return productService.createProduct().then(function(product) {
      return userService.addProductAccess($scope.user._id, product._id).then(function() {
        location.reload();
      });
    });
  };
  
  $scope.updateProduct = function(product) {
    return productService.updateProduct(product);
  };
  
  $scope.deleteProduct = function(id) {
    return productService.deleteProduct(id).then(function() {
      $scope.products = $scope.products.filter(function(p) { return p._id !== id; });
      return $scope.changeProduct(0); // TODO go up/down the list by 1
    });
  };
  
  var refreshUserWidget = function() {
    $scope.userWidget.url = '/products/' + $scope.currentProduct._id + "/personas"
    productService.getPersonas($scope.currentProduct._id).then(function(personas) {
      $scope.userWidget.personas = personas;
    });
  };
  
  userService.getUser(debugUserId).then(function(user) {
    $scope.user = user;
    $scope.products = user.products;
    $scope.currentProduct = user.products[$scope.user.currentProduct];
    refreshUserWidget();
/*
		var currentProduct = Number(user.currentProduct) || 0;
		if (currentProduct >= user.products.length) currentProduct = user.products.length - 1;
		if (currentProduct >= 0) {
			prod_id = user.products[currentProduct]._id;
		} else {
			prod_id = null;
		}

		if (prod_id !== null) {
  		product_url = "/products/" + prod_id;
  		

  
  	  $("#products").append('<li class="divider"></li><li><a href="#" id="newproduct"><span class="glyphicon glyphicon-plus"></span>New Product</a></li>');
  	  $("#newproduct").click(doCreateProduct);
  
  		personas_url = product_url + "/personas";
  
  		createUserWidget(personas_url);
  
  		stories_url = product_url + "/stories";
  
  		createProductWidget(stories_url);
  
  	  $(document).on('hidden.bs.modal', '.modal', function(event) {
  	    // refresh relevant widget
  	    var widget = event.currentTarget.widget;
  	    if (widget)
  	      widget._refresh();
  	  });
  
  		$("#productName").text(products[currentProduct].name);
  		$("#productName").editable({
  	  	showbuttons: false,
  			params: function(params) { return JSON.stringify(params); },
  			onblur: 'submit',
  			url: product_url,
  			ajaxOptions: {
  				type: 'put',
  				dataType: 'json',
  				contentType: 'application/json; charset=utf-8'
  			},
  			success: function(response, newValue) {
  				if (typeof response == "object" && !response.success) {
  					return response.error;
  				}
  				location.reload();
  			},
  			error: function(a, b) {
  				console.error(a, b);
  			}
  		});
  		$("#deleteProduct").click(function(event) {
  	  	bootbox.confirm("Are you sure?", function(result) {
  	    	if (result) {
  	      	$.ajax({
  	        	method: 'DELETE',
  	        	url: product_url,
  	        	success: function(data) {
  	          	if (data.success) {
  	            	var newIx = currentProduct-1;
  	            	changeCurrentProduct(newIx >= 0 ? newIx : 0, location.reload());
  	          	} else {
  	            	console.error(data);
  	          	}
  	        	}
  	      	});
  	      }
  	  	});
  		});
  	} else {
  		$("#widgets").append($("<button>").click(doCreateProduct).text("Create product"));
  		$("#loading").hide();
  		
  	}
  	*/
  });
}]);