/**
 * Created by madla on 26/10/2016.
 */

 'use strict';

 angular.module('app').controller('homeCtrl', ['rsFactory','cartService',function (rsFactory,cartService) {

     var vm = this;
     vm.arts=[];
     vm.newProducts = [];

     vm.categories = [];

     rsFactory.categories.query(null, function(data){
        data.forEach(function(d){
            d.selected = false;
            d.afSousCat = true;
            vm.categories.push(d);
        });
    });

     vm.showSousCats = function(i){
        var index = vm.categories.findIndex(x => x.categorie.id==i);
        if(vm.categories[index].afSousCat === true){
            vm.categories.forEach(function(c){
                c.afSousCat = true;
            })
            vm.categories[index].afSousCat = false;
        }else if(vm.categories[index].afSousCat === false){
            vm.categories[index].afSousCat = true;
        }
    };

    //Récupreation des articles: Categories New Produits
    var getNewProducts = function(data,tag){
        var products = [];
        for(var i=0 ; i< 3;i++) {
          products.push(data[i]);
      }
      return products;
  }

  rsFactory.articles.query(null, function(data){
    vm.articles = data;
    delete vm.articles.$promise;
    delete vm.articles.$resolved;
    vm.newProducts = getNewProducts(vm.articles,"New products");
    vm.topSellers = getNewProducts(vm.articles,"New products");
});


  //Permet de calculer le prix de vente
  vm.getPrixVente = function (pa,pourcentage){
   return (pa + (pa*pourcentage/100));
};




vm.addCart = function(a,photos){
    var p = a.prixAchat + (a.prixAchat*a.pourcentage/100);
    var art = {
        Article: a,
        Quantite: 1,
        PrixUnitaire: p,
        Photo: photos
    };
    var cart = cartService.get('cart');
    if(cart === null) cart = [];
    var exist= false;
    cart.forEach(function(ar){
        if(ar.Article.id === a.id){
            exist=true;
            var i = cart.indexOf(ar);
            cart[i].Quantite++;
            return cartService.set('cart',cart);
        }
    });
    if (!exist) {
        cart.push(art);
        cartService.set('cart',cart);
    }
};


vm.getArtByCat = function(id){
    if(vm.articles.length > 0){
        vm.articles.splice(0,vm.articles.length);
    }

    rsFactory.articlesByCat(id).then(function(data){
        vm.articles = data;
    });

};

vm.getArtBySousCat =function(idCat,idSousCat){
    if(vm.articles.length > 0){
        vm.articles.splice(0,vm.articles.length);
    }

    rsFactory.articlesBySousCat(idCat,idSousCat).then(function(data){
        vm.articles = data;
    });
}


vm.reset = function(){
    vm.articles.splice(1,vm.articles.length);
    vm.articles = vm.arts;
};

}]);