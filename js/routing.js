var app = angular.module("myApp",["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
        .when("/", {
            templateUrl : "/page/home.html",
            controller:""
        })
        .when("/product", {
            templateUrl : "/page/types.html",
            controller: "productController"
        })
        .when("/productdetail", {
            templateUrl : "/page/productdetail.html",
            controller: "productdetailController"
        })
        .when("/merchants", {
            templateUrl : "/page/merchants.html",
            controller: "merchantsController"
        })
        .when("/user", {
            templateUrl : "/page/user.html",
            controller: "userController"
        })


})





