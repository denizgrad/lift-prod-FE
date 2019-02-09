(function (){
    'use strict';
    angular
        .module('loginPageController', [])
        .controller('loginPageController', loginPageController);

    loginPageController.$inject = [
        '$mdMedia',
    ];

    function loginPageController (
        $mdMedia
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.$mdMedia = $mdMedia;
        vm.view = 'login';

        function onInit (){

        }
    }
})();