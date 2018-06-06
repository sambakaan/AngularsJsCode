

'use strict';

angular.module('app').controller('categorieCtrl', ['rsFactory','Articles',function (rsFactory,Articles) {

    var vm = this;

    vm.articles = Articles;
    
    vm.categories = [];
    rsFactory.categories.query(null, function(data){
        data.forEach(function(d){
            d.afSousCat = true;
            vm.categories.push(d);
        });
    });
}]);