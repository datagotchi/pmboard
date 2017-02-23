angular.module('pmboard').directive('widget', function() {
  return {
    templateUrl: '../templates/widget.html',
    scope: {
      title: '@',
      column: '=',
      url: '@',
      data: '=',
      onAdd: '&',
      modalTemplate: '@'
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
        $scope.row = $scope.data[index];
        $scope.row.index = index;
        var modal = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          template: tmpl,
          scope: $scope,
          controller: ['$uibModalInstance', function($uibModalInstance) {
/*
            $scope.row = $scope.data[index];
            $scope.row.index = index;
*/
            $scope.cancel = function() {
              $uibModalInstance.dismiss();
            };
          }]
        });
        modal.rendered.then(function() {
          if ($scope.onModalOpen) {
            $scope.onModalOpen();
          }
        })
        modal.result.finally(function() {
          if ($scope.onModalClose) {
            $scope.onModalClose();
          }
        })
      };
    }],
    link: function(scope) {}
  }
});
