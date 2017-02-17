angular.module('pmboard').directive('widget', function() {
  return {
    templateUrl: '../templates/widget.html',
    scope: {
      title: '@',
      column: '=',
      url: '@',
      data: '=',
      onAdd: '&'
    },
    controller: ['$scope', function($scope) {
      var self = this;
    }],
    link: function(scope) {
      
      scope.newName = '';
      
      scope.create = function(name) {
        var row = {name: name, evidence: []};
        scope.newName = '';
        scope.$applyAsync(function() {
          scope.data.push(row);
          if (scope.onAdd) {
            scope.onAdd();
          }
        })
      };
      
    }
  }
});
