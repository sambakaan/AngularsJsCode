'use strict';

app
    .directive('appHeader', [function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'shared/directives/header.html'
        }
    }])

    .directive('appFooter', [function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'shared/directives/footer.html'
        }
    }])
;