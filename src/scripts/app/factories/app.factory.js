app
.factory('rsFactory', ['$resource','$http','$q','urlBase','authService', '$window',
    function($resource,$http,$q,urlBase,authService,$window)
    {
        var urlMain = urlBase.apiUrlBase;

        //var user = authService.get('client'); 
        var user = $resource(urlMain + 'clients/123');

       return{
        user: user,
    }

}])

.factory('cartService', function (localStorageService) {
    this.set = function (key, value) {
        return localStorageService.set(key, value);
    };
    this.get = function (key) {
        return localStorageService.get(key);
    };
    this.destroy = function (key) {
        return localStorageService.remove(key);
    };

    return this;
})

.factory('authService', function (localStorageService) {
    this.set = function (key, value) {
        return localStorageService.set(key, value);
    };
    this.get = function (key) {
        return localStorageService.get(key);
    };
    this.destroy = function (key) {
        return localStorageService.remove(key);
    };

    return this;
});