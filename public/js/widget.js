angular.module('pmboard').directive('widget', function() {
  return {
    templateUrl: '../templates/widget.html',
    scope: {
      title: '@',
      columns: '=',
      url: '@',
      data: '='
    },
    controller: ['$scope', function($scope) {
      var self = this;
    }],
    link: function(scope) {
      
    }
  }
});