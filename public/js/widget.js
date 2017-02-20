angular.module('pmboard').directive('widget', function() {
  return {
    templateUrl: '../templates/widget.html',
    scope: {
      title: '@',
      column: '=',
      url: '@',
      data: '=',
      onAdd: '&',
      modalTemplate: '@',
      modalOptions: '='
    },
    controller: ['$scope', '$uibModal', function($scope, $uibModal) {
      var self = this;
      
      $scope.newName = '';
      
      $scope.create = function(name) {
        var row = {name: name, evidence: []};
        $scope.newName = '';
        $scope.$applyAsync(function() {
          $scope.data.push(row);
          if ($scope.onAdd) {
            $scope.onAdd();
          }
        })
      };
      
      $scope.openModal = function(index, tmpl) {
        var modal = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: tmpl,
          scope: $scope,
          controller: ['$uibModalInstance', function($uibModalInstance) {
            $scope.row = $scope.data[index];
            $scope.row.index = index;
            $scope.cancel = function() {
              $uibModalInstance.dismiss();
            };
          }]
        });
        modal.result.finally(function() {
          if ($scope.modalOptions.onClose) {
            $scope.modalOptions.onClose();
          }
        })
      };
    }],
    link: function(scope) {
      
    }
  }
});
