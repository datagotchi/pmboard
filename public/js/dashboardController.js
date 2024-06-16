angular.module("pmboard").controller("dashboardController", [
  "$http",
  "$scope",
  "$cookies",
  "userService",
  "productService",
  function ($http, $scope, $cookies, userService, productService) {
    $scope.products = [];
    $scope.user = null;
    $scope.currentProduct = null;

    $scope.changeProduct = function (index) {
      userService
        .changeCurrentProduct($scope.user._id, index)
        .then(function () {
          $scope.currentProduct = $scope.products[index];
          $scope.user.currentProduct = index;
          //$scope.userWidget.refresh();
          //$scope.productWidget.refresh();
        });
    };

    $scope.createProduct = function () {
      return productService.createProduct().then(function (product) {
        $scope.products.push(product);
        return userService
          .addProductAccess($scope.user._id, product._id)
          .then(function () {
            $scope.changeProduct($scope.products.length - 1);
          });
      });
    };

    $scope.updateProduct = function (product) {
      return productService.updateProduct(product);
    };

    $scope.deleteProduct = function (id) {
      var index = $scope.products
        .map(function (p) {
          return p._id;
        })
        .indexOf(id);
      return productService.deleteProduct(id).then(function () {
        $scope.products = $scope.products.filter(function (p) {
          return p._id !== id;
        });
        var newIndex = index;
        if (newIndex === $scope.products.length) {
          newIndex = newIndex - 1 >= 0 ? newIndex - 1 : 0;
        }
        return $scope.changeProduct(newIndex);
      });
    };

    // initialize the page

    $scope.loading = true;
    var init = function (user) {
      $scope.user = user;
      $scope.products = user.products;
      $scope.currentProduct = user.products[$scope.user.currentProduct ?? 0];
      //$scope.userWidget.refresh();
      //$scope.productWidget.refresh();
      $scope.loading = false;
    };

    if ($cookies.get("userid") && $cookies.get("token")) {
      var userId = $cookies.get("userid"); // TODO verify this is the express session cookie.userid
      userService
        .getUser(userId)
        .then((user) => {
          init(user);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // TODO: load login page
    }
  },
]);
