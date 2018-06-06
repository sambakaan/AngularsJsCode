'use strict';

angular.module('app').controller('checkoutCtrl', ['cartService','rsFactory','$state',
    function (cartService,rsFactory,$state) {

        var vm = this;
        vm.total=0;
        vm.data = {
            Client: {},
            User:{},
            livraison:{},
            Items:[]
        };
        vm.Client = {};
        vm.User = {};
        vm.cmd;
        vm.zones = [];
        vm.secteurs = [];

        vm.countries = [];
        vm.cart = cartService.get('cart');
        if(vm.cart.length === 0) $state.go("shop");
        vm.cart.forEach(function(a){
            var item = {
                Quantite: a.Quantite,
                ArticleId: a.Article.id
            };
            vm.data.Items.push(item);
            vm.total = vm.total + (a.Quantite * a.PrixUnitaire);
        });

        rsFactory.getCountries.query(function(d){
            d.forEach(function(v){
                vm.countries.push(v.translations.fra.common);
            });
        });


        /**
        * Récupréaion des zones 
        **/

        var loadSecteurs = function(zone){
            var i = vm.zones.indexOf(zone);
            vm.zones[i].modif = false;
            vm.zones[i].new = zone.libelle;
            vm.zones[i].delB = true;
            vm.zones[i].listB = true;
            vm.secteurs.push(false);
            zone.secteurs.forEach(function(secteur){
                var sIndex =  zone.secteurs.indexOf(secteur);
                zone.secteurs[sIndex].modif = false;
                zone.secteurs[sIndex].newS = secteur.libelle;
                zone.secteurs[sIndex].newZ= zone.zone.id;
                zone.secteurs[sIndex].delB = true;
            });
        };

        rsFactory.zones.query(null,function(data){
            vm.zones = data;
            delete vm.zones.$promise;
            delete vm.zones.$resolved;
            vm.zones.forEach(function(zone){
                loadSecteurs(zone);
            });
            console.log(vm.zones);
        });
        vm.SendOrder = function () {
            vm.data.User.Login = vm.data.Client.Email;
            vm.data.livraison.zone = vm.data.cmd.livraison;
            vm.data.livraison.precision = vm.data.cmd.precision;
            rsFactory.orders.save(null, vm.data,function (d) {
                var cart = [];
                cartService.set('cart', cart);
                $state.go("shop");
            });

        };

    }]);