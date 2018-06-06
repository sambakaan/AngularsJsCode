'use strict';

angular.module('app').controller('headerCtrl', ['cartService','$scope','$timeout','rsFactory',
    function (cartService,$scope,$timeout,rsFactory) {

        var vm = this;

        vm.total = 0;
        vm.nbrArts = 0;
        vm.categories = [];
        vm.cart = cartService.get('cart');

        $scope.$watch(function () {
            return cartService.get('cart');
        }, function (newVal, oldVal) {
            vm.cart = cartService.get('cart');
            vm.total = 0;
            if(vm.cart === null){
                vm.nbrArts = 0;
            }else{
                vm.nbrArts = vm.cart.length;
                vm.cart.forEach(function(a){
                    vm.total = vm.total + (a.Quantite * a.PrixUnitaire);
                });
            }

        }, true);

        vm.removeArt = function(i){
            var cart = cartService.get('cart');
            var index = cart.findIndex(x => x.Article.id==i);
            cart.splice(index,1);
            cartService.set('cart',cart);
        };

        vm.CloseModal = function (id) {
            $('#'+id).modal('hide');
        };

        vm.OpenModal = function (idClose, idOpen) {
            $('#'+idClose).modal('hide');
            $timeout($('#'+idOpen).modal('show'), 1);
        };


        rsFactory.categories.query(null, function(data){
            data.forEach(function(d){
                vm.categories.push(d);
            });
        });



    }]);