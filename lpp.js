var app = angular.module('lpp', []) ;

app.controller('PhotosCtrl', ['$scope', '$http', function($scope, $http){
    $scope.luke = "jedi" ;
    $scope.photos = [] ;

    $http.get('http://www.json-generator.com/api/json/get/bOQzbJjuGa?indent=2').success(function(data){
        $scope.photos = data ;
    });

} ]);