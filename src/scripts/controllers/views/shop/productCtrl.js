
'use strict';

angular.module('app').controller('productCtrl', ['rsFactory','Article','cartService',
    function (rsFactory,Article,cartService) {

        var vm = this;
        vm.article = Article;
        vm.tabs = [
        {
            id:"tab1",
            value: true,
            class :"is-active"
        }];
        vm.image = vm.article.photo[0];
        vm.categories = [];
        vm.newProducts = [];
        vm.productsLiked = [];
        vm.qte = 1;

        vm.show = function(id){
            vm.tabs.forEach(function(tab){
                if(id == undefined) id=1;
                if(tab.id == 'tab'+id){
                    var j = id-1;
                    vm.tabs[j].value = true;
                    vm.tabs[j].class = "is-active";
                }else{
                    tab.value = false;
                    tab.class ="";
                }});
        };

        vm.showImage = function(id){
            vm.article.photo.forEach(function(image){
                if(id== undefined) vm.image = vm.article.photo[0];
                if(image.id === id){
                   vm.image = image;
                   vm.transition = {
                    "transition-duration": "3s", 
                    "transition": "all linear 0.5s"
                }
            }
        });
        };
        //Récupreation des articles: Categories New Produits
        var getNewProducts = function(data,tag){
            var products = [];
            for(var i=1 ; i<4;i++) {
              products.push(data[i]);
          }
          return products;
      };
      var getProductsLiked = function(data,tag){
        var products = [];
        for(var i=1 ; i<3;i++) {
          products.push(data[i]);
      }
      return products;
  };

  rsFactory.articles.query(null, function(data){
    vm.articles = data;
    delete vm.articles.$promise;
    delete vm.articles.$resolved;
    vm.newProducts = getNewProducts(vm.articles,"New products");
    vm.productsLiked = getProductsLiked(vm.articles,"More Like");
});
  rsFactory.categories.query(null, function(data){
    data.forEach(function(d){
        d.afSousCat = true;
        vm.categories.push(d);
    });
});

      /**
      * @id : le produit en vue
      * @a : article autre le produit en question
      * @photo : photo de l'article
      * cette surcharge permet d'ajouter le produit affiché dans le panier
      * Mais egalement un autre produit présent dans la page
      **/ 

      vm.addCart = function(i,a,photos){
        if(i !== null){
            var p = vm.article.article.prixAchat + 
            (vm.article.article.prixAchat*vm.article.article.pourcentage/100);

            var art = {
                Article: vm.article.article,
                Quantite: i,
                PrixUnitaire: p,
                Photo: vm.article.photo
            }
            var cart = cartService.get('cart');
            if(cart === null) cart = [];
            var exist= false;
            cart.forEach(function(ar){
                if(ar.Article.id === art.Article.id){
                    exist=true;
                    var i = cart.indexOf(ar);
                    cart[i].Quantite++;
                    return cartService.set('cart',cart);
                };
            });
            if (!exist) {
                cart.push(art);
                cartService.set('cart',cart);
            }
        }else {
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
        }
    };

        //Permet de calculer le prix de vente
        vm.getPrixVente = function (pa,pourcentage){
         return (pa + (pa*pourcentage/100));
     };

 }
 ]);