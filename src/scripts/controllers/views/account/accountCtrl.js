

'use strict';

angular.module('app').controller('accountCtrl', ['rsFactory','authService','$state',function (rsFactory,authService,$state) {

    var vm = this;
    vm.userOrders = [];
    vm.totaux = 0;
    vm.articles =[];
    vm.articlesOrder = [];
    vm.userAddrs = [];
    vm.countries = [];
    vm.ExistadrrLiv = false;
    vm.ExistadrrDom = false;
    vm.existOrders = false;
    vm.tabs = [
            {
                id:"tab1",
                value: true,
                class :"is-active"
            },
            {
                id:"tab2",
                value: false,
                class :""
            },
            {
                id:"tab3",
                value: false,
                class :""
            },          
            {
                id:"tab4",
                value: false,
                class :""
            },          
            {
              id:"tab5",
              value: false,
              class :"",
              adresseDom:true,
              adresseLiv:true
            },          
            {
                    id:"tab6",
                    value: false,
                    class :""
                },
            {
              id:"tab7",
              value: false,
              class :"",
              adresse:true
            },           
            {
              id:"tab8",
              value: false,
              class :"",
              adresse:true
            },
            {
              id:"tab9",
              value: false,
              class :"",
              adresse:true
            }
    ];
    
    vm.show = function(id){
        vm.tabs.forEach(function(tab){
            if(id == undefined) id=1;
            if(tab.id == 'tab'+id){
                if(id === 7){
                     var j =4;
                     vm.tabs[4].adresseDom = false;
                }else if(id === 8){
                    var j =4;
                    vm.tabs[4].adresseLiv = false;
                }
                else{
                    var j = id-1;
                }
                vm.tabs[j].value = true;
                vm.tabs[j].class = "is-active";
            }else{
                tab.value = false;
                tab.class ="";
            }});
    };

    rsFactory.getCountries.query(function(d){
         d.forEach(function(v){
                vm.countries.push(v.translations.fra.common);
        });
    });


    rsFactory.user.get(null, function(data){
      vm.userInfos = data;
      delete vm.userInfos.$promise;
      delete vm.userInfos.$resolved;
      if(vm.userInfos.length !== 0) vm.ExistadrrDom =true;
    }); 



    rsFactory.userAddrs.query(null, function(data){
        data.forEach(function(d){
            vm.userAddrs.push(d);
        });
        if(vm.userAddrs.length !== 0) vm.ExistadrrLiv = true;
    });  

    rsFactory.userOrders.query(null, function(data){
        data.forEach(function(d){
            vm.userOrders.push(d);
        });
    
        if(vm.userOrders.length !== 0){
          vm.existOrders = true;
        }
    });

    vm.showOrder = function(id){
      rsFactory.orderById(id).then(function(data){
          data.somme = 0;
        data.forEach(function(d){
          rsFactory.articleById(d.articleId).then(function(i){
            d.detailArticle = i;
            d.prixVente = i.article.prixAchat + (i.article.prixAchat*i.article.pourcentage/100);
            data.somme += d.prixVente;
          });
        });

        vm.items = data;

      });
    };

    vm.UdpadeInfo = function () {
        rsFactory.updateInfo.save(null, vm.userInfos,function (d) {
               $state.go("account");
                vm.show(1);
            });
    };
    vm.UdpadeAddrLiv = function () {
        rsFactory.UdpadeAddrLiv.save(null, vm.userAddrs[0],function (d) {
                vm.show(4);
            });
    };

    vm.AddAddr = function(){
        rsFactory.addAddrLiv.save(null, vm.userAddrs[0],function (d) {
                vm.show(4);
        });
    };
 
}]);