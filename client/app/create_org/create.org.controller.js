'use strict';

var app = angular.module('snackSnapApp');
//refactor to services

app.controller('CreateOrgCtrl', function ($scope, $modal, $log, CheckLoggedIn, ModalService) {
  $scope.items = [];

  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: '3.html',
      controller: '3Ctrl',
      size: size,
      backdrop: 'static',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    });
  };

  $scope.open('md');

});

app.controller('3Ctrl', function ($scope, $modalInstance, items, OrgSelect, $location) {

  var search = $location.search();
  $scope.submitting = false;
  $scope.successMessage = '';
  $scope.failureMessage = '';


  OrgSelect.getAccessToken()
  .then(function(response){
    OrgSelect.getGithubOrgInfo(search.github_login, response.data.access_token)
    .then(function(orgInfo){
      for (var key in orgInfo.data){
        $scope.createOrg[key] = orgInfo.data[key];
      }
    });
  });

  $scope.submitOrg = function(){
    $scope.submitting = true;
    $scope.successMessage = '';
    $scope.failureMessage = '';
    console.log($scope.createOrg);
    OrgSelect.createOrg($scope.createOrg.id, $scope.createOrg.details.formatted_address, 
      $scope.createOrg.details.name, $scope.createOrg.login, $scope.createOrg.details.place_id, $scope.createOrg.details)
    .success(function(data, status, headers, config){
      console.log('success');
      $scope.submitting = false;
      $scope.successMessage = 'Organization created successfully.';
      $location.path('/');
      $location.search({github_login: null, github_id: null});
      window.location.reload();//ideally we'll figure out how to close that fucking modal
    })
    .error(function(data, status, headers, config){
      $scope.failureMessage = 'Error creating organization.';
      $scope.submitting = false;
    });
  };
 
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
