// CLIENT END STYLING
$('.close').on('click', function() {
    $('#singleImage').fadeOut("slow");
    $('#main').fadeIn("slow");
});

$(window).on('load', function() {
    $('.hidden').fadeIn("slow").removeClass('hidden');
});

$('#menu-icon').on('click', function openMenu(e) {
    $('#menu').css({transform:"translateX(0)"});
    $('#popupoverlay').show("slow");
    e.stopPropagation();
});

$('.secondx').on('click', function closeMenu(e) {
    $('#menu').css({transform:"translateX(100%)"});
    $('#popupoverlay').hide('slow');
    e.stopPropagation();
});

$('#menu').on('click', function closeMenu(e) {
    $('#menu').css({transform:"translateX(100%)"});
    $('#popupoverlay').hide('slow');
    e.stopPropagation();
});

$('#body').on('click', function closeMenu(e) {
    $('#menu').css({transform:"translateX(100%)"});
    $('#popupoverlay').hide('slow');
    e.stopPropagation();
});
// END FRONT SIDE STYLING

location.hash = ('/');

(function() {
    var myApp = angular.module('myApp', ['app.routes', 'ui.router']);
    //Give hame to app. Fill the array w/ other modlues or things the app depends on.

    // UPLOADER CONTROLLER
    myApp.controller('upload', function($scope, $http) {
        $scope.submit = function() {
            var file = $('input[type="file"]').get(0).files[0]; // First, you get the file the user has specified in the form:
            var title = $scope.title;
            var username = $scope.username;
            var description = $scope.description;

            var formData = new FormData(); // Then you create a FormData instance and append the file to it
            formData.append('file', file); // add stuff to form FormData. key, value. Can also append text here. formdata.append("title". title);
            formData.append('title', title);
            formData.append('username', username);
            formData.append('description', description);
            $http({
                method: 'POST',
                url: '/upload',
                data: formData,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
                .then((response) => {
                    var msg = response.data.msg;
                    $scope.msg = msg;
                    $scope.username = '';
                    $scope.title = '';
                    $scope.description = '';
                }).catch(function onError(response) {
                    //handle error
                    console.log("error uploading photo: ", response);
                    var msg = "error uploading photo: " + response.err;
                    $scope.msg = msg;
                });
        };
    });

    // RECENT IMAGES CONTROLLER
    myApp.controller('recentImages', function($scope, $http) {
    // RECENT IMAGES
        $http.get('/images').then(function(results) {
            $scope.message = 'Recent Images';
            $scope.images = results.data;
        });

        $scope.title = '';
        $scope.username = '';
        $scope.file = {};
        $scope.description = '';
    });

    // SINGLE IMAGE CONTROLLER
    myApp.controller('singleImage', function($scope, $http, $location, $stateParams) {
        $http.get('/singleImage/' + $stateParams.imageId).then(function(results) {
            $scope.singleImage = results.data.image;
            $scope.username = results.data.username;
            $scope.title = results.data.title;
            $scope.description = results.data.description;
            $scope.comments = results.data;
            $scope.imageId = $stateParams.imageId;
        });
    });


    // ADD COMMENT CONTROLLER
    myApp.controller('addComment', function($scope, $http, $stateParams, $location) {

        $scope.addComment = function() {
            var user = $scope.user;
            var comment = $scope.comment;
            var imageId = $stateParams.imageId;
            console.log('about to comment with', imageId, user, comment);
            $http({
                url: "/singleImage/${imageId}/addComment", //should i add + $stateParams.imageId?
                method: 'POST',
                data: {
                    imageId, user, comment
                }
            })
                .then(response => {
                    console.log("script.js ** addcomment response,", response.data.results);
                    var msg = response.data.msg;
                    $scope.msg = msg;
                    // $scope.imageId = response.data.imageId;
                    // $scope.comments = response.data;
                    $scope.newComment = response.data.results.comment;
                    $scope.newUsername = response.data.results.username;

                }).catch(err => {
                    console.log("error in add comment controller", err);
                    $scope.msg = "error adding comment";
                });
        };
    });

    // GET COMMENTS CONTROLLER
    myApp.controller('getComments', ($scope, $http, $stateParams) => {
        var id = $stateParams.imageId;
        $http({
            url:  `/singleImage/${id}/addComment`,
            method: 'GET'
        })
            .then(res => {
                console.log("getting these comments: ", res.data);
                $scope.comments = res.data;
            })
            .catch(err => {
                console.log("error getting comments in controller", err);
            });
    });

    // ABOUT CONTROLLER
    myApp.controller('about', function($scope, $http) {
        $http.get('/about').then(function(data) {
            $scope.message = "About page";
            $scope.image = data.rows[0];
        });
    });

//End of large function with all controllers
})();
