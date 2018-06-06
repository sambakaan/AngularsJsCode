"use strict";

var app = angular.module('app', [
    'ui.router',
    'oc.lazyLoad',
    'ngRetina',
    'jcs-autoValidate',
    'ncy-angular-breadcrumb',
    'ngResource',
    'ui.bootstrap',
    'LocalStorageModule',
    'ngLoader',
    'toastr','ngFileUpload','ngStorage',
]);

/* Run Block */
app.run([
    '$rootScope',
    '$state',
    '$stateParams',
    '$location',
    function ($rootScope,$state,$stateParams,$location) {
        $rootScope.$on('$stateChangeSuccess', function () 
        {



        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        });

    }
]);

app.run([
    'bootstrap3ElementModifier',
    function (bootstrap3ElementModifier) {
        bootstrap3ElementModifier.enableValidationStateIcons(true);
    }
]);

var serviceBase = "http://localhost/api/";
app.constant('urlBase', {apiUrlBase: serviceBase});