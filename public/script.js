/// questions : Do I need controllers for each view/set

// FRONT SIDE STYLING
$('.close').on('click', function() {
    console.log("close clicked");
    $('#singleImage').fadeOut("slow");
    $('#main').fadeIn("slow");
});

$(window).on('load', function() {
    $('.hidden').fadeIn("slow").removeClass('hidden');
});

$('#menu-icon').on('click', function openMenu(e) {
    console.log('menu was clicked');
    $('#menu').css({transform:"translateX(0)"});
    $('#popupoverlay').show("slow");
    e.stopPropagation();
});

$('.secondx').on('click', function closeMenu(e) {
    console.log('x2 was clicked');
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
    console.log("main clicked");
    $('#menu').css({transform:"translateX(100%)"});
    $('#popupoverlay').hide('slow');
    e.stopPropagation();
});





// END FRONT SIDE STYLING

location.hash = ('/');

(function() {
    var myApp = angular.module('myApp', ['app.routes', 'ui.router']);
    //give hame to app. Fill the array later w/ other modlues or things the app depends on.

    // UPLOADER CONTROLLER
    myApp.controller('upload', function($scope, $http) {
        $scope.submit = function() {
            console.log("running submit");
            var file = $('input[type="file"]').get(0).files[0]; // First, you get the file the user has specified in the form:
            var title = $scope.title;
            var username = $scope.username;
            var description = $scope.description;

            var formData = new FormData(); // Then you create a FormData instance and append the file to it
            formData.append('file', file); // add stuff to form FormData. key, value. Can also append text here. formdata.append("title". title);
            formData.append('title', title); // add stuff to form FormData. key, value. Can also append text here. formdata.append("title". title);
            formData.append('username', username); // add stuff to form FormData. key, value. Can also append text here. formdata.append("title". title);
            formData.append('description', description);
            $http({
                method: 'POST',
                url: '/upload',
                data: formData,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            })
                .then(() => {
                    $scope.username = '';
                    $scope.title = '';
                    $scope.description = '';
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
            console.log("results", results);
            $scope.singleImage = results.data.image;
            $scope.username = results.data.username;
            $scope.title = results.data.title;
            $scope.description = results.data.description;
            $scope.comments = results.data;
            $scope.imageId = $stateParams.imageId;
        });
    });


    // ADD COMMENT CONTROLLER
    myApp.controller('addComment', function($scope, $http, $stateParams) {
        $scope.addComment = function() {
            console.log("running add comment controller");
            var user = $scope.user;
            var comment = $scope.comment;
            var imageId = $stateParams.imageId;
            console.log('values for add coment POST', user, comment, imageId);
            $http({
                url: "/singleImage/:id/addComment", //should i add + $stateParams.imageId?
                method: 'POST',
                data: {
                    user, comment, imageId
                }
            })
                .then(results => {
                    console.log("commented with :", results.data);
                    $scope.imageId = results.data.imageId;
                    $scope.comments = results.data;
                }).catch(err => {
                    console.log("error in add comment controller", err);
                    $scope.err = "there is an arror";

                });
        };
    });


    myApp.controller('getComments', ($scope, $http, $stateParams) => {
        var id = $stateParams.imageId;
        $http({
            url:  `/singleImage/${id}/addComment`,
            method: 'GET'
        })
            .then(res => {
                console.log("getting comments ", res);
                $scope.comments = res.data;
            })
            .catch(err => {
                console.log(err);
            });
    });


    // About CONTROLLER
    myApp.controller('about', function($scope, $http) {
        $http.get('/about').then(function(data) {
            $scope.message = "About page";
            $scope.image = data.rows[0];
        });
    });


    // navli - where does this go?
    // angular.module('myApp.nav', [])
    //     .directive('gtNav', function(){
    //         return {
    //             templateUrl: 'app/nav/nav.html',
    //             restrict: 'E',
    //             controller: function($scope){
    //                 $scope.showClick = function(e){
    //                     console.log(e.currentTarget);
    //                 }
    //             }
    //         }
    //     });


    //End of large function
})();
