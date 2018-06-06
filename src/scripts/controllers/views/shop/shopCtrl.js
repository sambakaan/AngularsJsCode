
'use strict';

angular.module('app').controller('shopCtrl', ['rsFactory','cartService','$timeout', 
    function (rsFactory,cartService,$timeout) {

        var vm = this;
        vm.arts=[];
        vm.categories = [];
        vm.viewModel = {};

        rsFactory.categories.query(null, function(data){
            data.forEach(function(d){
                d.categorie.selected = "";
                d.sousCategories.forEach(function(sc){
                    sc.selected = ""
                });
                d.afSousCat = true;
                vm.categories.push(d);
            });
        });

                //Récupreation des articles: Categories New Produits
                var getNewProducts = function(data,tag){
                    var products = [];
                    for(var i=1 ; i<4;i++) {
                        products.push(data[i]);
                    }
                    return products;
                };


                rsFactory.articles.query(null, function(data){
                    vm.articles = data;
                    delete vm.articles.$promise;
                    delete vm.articles.$resolved;
                    vm.newProducts = getNewProducts(vm.articles,"New products");
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

                // set couleur sur la cetégorie active ou sous catégorie
                vm.updateStyleCatSelected = function(idcat,idSousCat){
                    vm.categories.forEach(function(cat){
                        if(cat.categorie.id === idcat){
                            if(idSousCat === null){
                                cat.categorie.selected= "item-cat-app-active";
                                cat.sousCategories.forEach(function(sousCat){
                                  sousCat.selected = "";
                              });   
                            }else{
                                cat.sousCategories.forEach(function(sousCat){
                                    if (sousCat.id === idSousCat) {
                                        sousCat.selected = "item-cat-app-active";
                                    }else {
                                        sousCat.selected = "";
                                    }
                                });
                            }
                        }else {
                         cat.categorie.selected= "";
                         cat.sousCategories.forEach(function(sousCat){
                          sousCat.selected = "";
                      });
                     }
                 });
                };

                vm.getArtByCat = function(id){
                    if(vm.articles.length > 0){
                        vm.articles.splice(0,vm.articles.length);
                    }

                    rsFactory.articlesByCat(id).then(function(data){
                        vm.articles = data;
                        vm.updateStyleCatSelected(id,null); 
                    });

                };



                vm.getArtBySousCat =function(idCat,idSousCat){
                    if(vm.articles.length > 0){
                        vm.articles.splice(0,vm.articles.length);
                    }

                    rsFactory.articlesBySousCat(idCat,idSousCat).then(function(data){
                        vm.articles = data;
                        vm.updateStyleCatSelected(idCat,idSousCat); 
                    });

                }


                vm.reset = function(){
                    vm.articles.splice(1,vm.articles.length);
                    vm.articles = vm.arts;
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
                    vm.articles.forEach(function(artP){
                        if(artP.article.id === a.id){
                            artP.article.loading = "loading";
                            $timeout(function(){
                                artP.article.loading = "added";
                            }, 2000);
                            artP.article.viewIconCart =true;
                        }
                    });
                };

                vm.checkModelView =function (model){
                    if(model === "list-view"){
                        vm.viewModel.model = model;
                        vm.viewModel.ClassList = "active"; 
                        vm.viewModel.ClassBlock = ""; 
                    }else{
                        vm.viewModel.model = "";
                        vm.viewModel.ClassList = ""; 
                        vm.viewModel.ClassBlock = "active"; 
                    }
                };

                //Permet de calculer le prix de vente
                vm.getPrixVente = function (pa,pourcentage){
                 return (pa + (pa*pourcentage/100));
             };






         }]);