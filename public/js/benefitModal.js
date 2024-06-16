angular.module("pmboard").directive("benefitModal", [
  "$http",
  "$uibModal",
  "$cookies",
  "productService",
  function ($http, $uibModal, $cookies, productService) {
    return {
      templateUrl: "../templates/benefitModal.html",
      scope: {
        productId: "@",
        benefit: "=",
      },
      controller: [
        "$scope",
        function ($scope) {
          $scope.$watch("benefit", function () {});
        },
      ],
      link: function (scope) {},
    };
  },
]);
