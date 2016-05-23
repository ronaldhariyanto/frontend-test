(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .controller('FilmsCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'films', 'film');
    })

    .controller('SpeciesCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'species', 'specie');
    })

    .controller('HomeCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'home', 'home');
    })

    .controller('PlanetsCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'planets', 'planet');
    })

    .controller('PeopleCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'people', 'person');
    })

    .controller('StarshipsCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'starships', 'starship');
    })

    .controller('VehiclesCtrl', function($scope, $state, $http){
      $scope = genericController($scope, $state, $http, 'vehicles', 'vehicle');
    })

    .directive("getProp", ['$http', '$filter', function($http, $filter) {
      return {
        template: "{{property}}",
        scope: {
          prop: "=",
          url: "="
        },
        link: function(scope, element, attrs) {

          var urlApi = scope.url,
            queryParams = {
              cache: true
            };

          var capitalize = $filter('capitalize');

          $http.get(urlApi, queryParams).then(function(result) {
            scope.property = capitalize(result.data[scope.prop]);
          }, function(err) {
            scope.property = "Unknown";
          });
        }
      }
    }])

    .filter('capitalize', function() {
      return function (input) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1)}) : '';
      }
    })

    .filter('lastdir', function () {
      return function (input) {
        return (!!input) ? input.split('/').slice(-2, -1)[0] : '';
      }
    })

    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  function genericController($scope, $state, $http, multiple, single){

    $scope.id = ($state.params.id || '');
    $scope.page = ($state.params.p || 1);

    var urlApi = "http://swapi.co/api/"+multiple+"/"+$scope.id+"?page="+$scope.page,
      queryParams = {
        cache: true
      };

    if ($scope.page == 1) {

      if ($scope.id != '') {

        $http.get(urlApi, queryParams)
          .success(function(data) {

            if (data.homeworld) data.homeworld = [data.homeworld];

            $scope[single] = data;

            var name = data.name;
          })

      } else {

        $http.get(urlApi, queryParams)
        .success(function(data) {
          $scope[multiple] = data;
          if (data['next']) $scope.nextPage = 2;
        });
      }

    } else {

      $http.get(urlApi, queryParams)
      .success(function(data) {
        $scope[multiple] = data;
        if (data['next']) $scope.nextPage = 1*$scope.page + 1;
      });

      $scope.prevPage = 1*$scope.page - 1;
    }
    return $scope;
  }

})();
