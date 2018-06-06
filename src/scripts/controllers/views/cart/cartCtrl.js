'use strict';

angular.module('app').controller('cartCtrl', ['cartService','$state',function (cartService,$state) {

    var vm = this;
    vm.total=0;

    vm.cart = cartService.get('cart');

    if(vm.cart.length === 0) $state.go("shop");

    vm.cart.forEach(function(a){
   		vm.total = vm.total + (a.Quantite * a.PrixUnitaire);
	});

	vm.removeArt = function(i){
		var cart = cartService.get('cart');
 		var index = cart.indexOf(i);
 		cart.splice(index, 1);
 		cartService.set('cart',cart);
 		if(cart.length === 0) $state.go("shop");
	};

}]);