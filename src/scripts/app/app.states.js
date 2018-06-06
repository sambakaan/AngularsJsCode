app
.config([
    '$stateProvider',
    '$urlRouterProvider','urlBase','$httpProvider',
    function ($stateProvider, $urlRouterProvider,urlBase,$httpProvider) {

        var urlMain = urlBase.apiUrlBase;

            //CORS
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
            .when('/home','/')
            .otherwise('/');

            $stateProvider
            .state("home", {
                url: "/",
                templateUrl: 'views/home/homeView.html',
                controller: 'homeCtrl as vm',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            /*'arrow_lib',*/
                            'scripts/controllers/views/home/homeCtrl.js'
                            ]);
                    }]
                },
                data: {
                    pageTitle: 'Page d\'accueil'
                }
            })
        }
        ]);
