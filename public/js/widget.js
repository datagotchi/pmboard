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

      scope.getValue = function(index, key) {
        var row = scope.data[index];
        if (row && key in row) {
          return row[key];
        } else {
          var parts = key.split('.'),
              key = parts[0],
              value = parts[1];
          if (value === 'length') {
            return row[key].length;
          }
        }
      };
      
    }
  }
});
