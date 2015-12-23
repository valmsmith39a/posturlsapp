// public/core.js
var postURLs = angular.module('postURLs', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // When land on page, get all postURLs and display
    $http.get('/api/posturls')
        .success(function(data) {
            $scope.postURLs = data.reverse();
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // When submit the add form, send the text to the node API
    $scope.createPostURL = function() {
        $http.post('/api/posturls', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so user is ready to enter another
                $scope.postURLs = data.reverse();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // Delete a postURL after checking it
    $scope.deletePostURL = function(id) {
        $http.delete('/api/posturls/' + id)
            .success(function(data) {
                $scope.postURLs = data.reverse();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
