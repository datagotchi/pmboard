angular.module('pmboard').directive('personaModal', [
  '$http', '$uibModal', '$cookies', 'productService', 'oauthService', 
  function($http, $uibModal, $cookies, productService, oauthService) {
  
  return {
    templateUrl: '../templates/personaModal.html',
    scope: {
      productId: '@',
      persona: '='
    },
    controller: ['$scope', function($scope) {
      
      var trends = {};
      
      $scope.$watch('persona', function() {
        $scope.persona.evidence.forEach(function(evidence) {
          if (!evidence.trends) {
            evidence.trends = [];
          }
          evidence.trends.forEach(function(trend) {
            if (!(trend.name in trends)) {
              trends[trend.name] = angular.extend({
                count: 0
              }, trend);
            }
            trends[trend.name].count++;
            trend.class = $scope.trendTypes[trend.type] || 'label-info';
          });
        });
      
        $scope.trendList = Object.keys(trends)
          .map(function(name) {return trends[name]; })
          .sort(function(a, b) {
            if (a.type === b.type) {
              return a.count - b.count; 
            } else {
              var types = Object.keys($scope.trendTypes); 
              return types.indexOf(a.type) - types.indexOf(b.type);
            }
          });
            
      })
      
      $scope.trendTypes = {
        "Objective" : "label-danger",
        "Goal" : "label-warning",
        "Activity" : "label-primary",
        "Task" : "label-default",
        "Resource" : "label-success"
      };
      
      $scope.trendsShown = {};
      
      $scope.onUpdateName = function(personaIndex, name) {
        return productService.updatePersona($scope.productId, personaIndex, name);
      };
      
      $scope.showTrendType = function(trend) {
        if (!(trend.type in $scope.trendsShown)) {
          $scope.trendsShown[trend.type] = trend.name;
          return trend.type;
        } else if ($scope.trendsShown[trend.type] === trend.name) {
          return trend.type;
        } else {
          return '';
        }
      };
      
      $scope.findTrend = function(persona, query) {
        var found = Object.keys(trends)
          .filter(function(name) { return name.toLowerCase().indexOf(query.toLowerCase()) > -1; })
          .map(function(name) { return {name: name, class: 'label-info'}; });
        return found;
      };
      
      $scope.openFilesModal = function(persona) {
        var evidence = persona.evidence;
        var modal = $uibModal.open({
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'templates/addFilesModal.html',
          scope: $scope,
          controller: ['$uibModalInstance', function($uibModalInstance) {
            $scope.files = [];
            $scope.cancel = function() {
              $uibModalInstance.dismiss();
            };
            $scope.addFile = function(file) {
              if (file.selected) {
                var newFile = {
                  name: file.title,
                  url: file.alternateLink,
                  icon: file.iconLink
                };
                productService.addEvidenceToPersona($scope.productId, persona.index, newFile).then(function() {
                  persona.evidence.push(newFile);
                  $scope.files = $scope.files.filter(function(f) { return f.alternateLink !== file.alternateLink; });
                });
              }
            }
          }]
        });
        modal.rendered.then(function() {
          $scope.loading = true;
          var oauth = JSON.parse($cookies.get('oauth'));
          var accessToken = oauth.access_token;
          $http.get('https://www.googleapis.com/drive/v2/files', {headers: {Authorization: 'Bearer ' + accessToken}})
            .then(function(res) {
              $scope.files = res.data.items.filter(function(file) {
                return evidence.map(function(f) { return f.url; }).indexOf(file.alternateLink) === -1;
              });
              $scope.loading = false;
            })
            .catch(function(res) {
              $scope.loading = false;
              if (res.status === 401) {
                return oauthService.doAuthentication().then(function(data) {
                  $cookies.put('oauth', data.oauth);
                  location.reload(); // TODO: just go back to the modal that's open?
                });
              }
            });
        });
      };
      
      $scope.removeFile = function(persona, fileIx) {
        return productService.removeEvidenceFromPersona($scope.productId, persona.index, fileIx).then(function() {
          persona.evidence.splice(fileIx, 1);
        });
      };
      
      $scope.addTrend = function(persona, fileIx, trend) {
        return productService.addPersonaTrend($scope.productId, persona.index, fileIx, {
          name: trend.name,
          type: ''
        }).then(function(trend) {
          if (!trends[trend.name]) {
            trends[trend.name] = {
              count: 0,
              name: trend.name
            };
          }
          trends[trend.name].count++;
        });
      };
      
      $scope.removeTrend = function(persona, fileIx, trend) {
        var trendIx = persona.evidence[fileIx].trends.map(function(trend) { return trend.name; }).indexOf(trend.name);
        return productService.removePersonaTrend($scope.productId, persona.index, fileIx, trendIx).then(function() {
          trends[trend.name].count--;
        });
      };
      
      $scope.hasType = function(trend) {
        return !!trend.type;
      };
      
    }],
    link: function(scope, elem, attrs) {}
  };
  
}]);