// UI ROUTER
angular.module('app.routes', ['ui.router'])

    .config(function($stateProvider) {
        $stateProvider

            .state('recentImages', {
                url: '/',
                views: {
                    'main': {
                        templateUrl: 'views/recentImages.html'
                    }
                }
            })

            .state('upload', {
                url: '/upload',
                views: {
                    'main': {
                        templateUrl: 'views/upload.html'
                    }
                }
            })

            .state('singleImage', {
                url: '/singleImage/{imageId}',
                views: {
                    'main': {
                        templateUrl: 'views/singleImage.html'
                    }
                }
            })

            .state('about', {
                url: '/about',
                views: {
                    'main': {
                        templateUrl: 'views/about.html'
                    }
                }
            });
    });
