(function (){
    'use strict';
    angular
        .module('accountPageController', ['accountService'])
        .controller('accountPageController', accountPageController);

    accountPageController.$inject = [
        'accountService',
    ];

    function accountPageController (
        accountService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.createNewAccount = createNewAccount;

        function onInit (){}

        /**
         * Create a new account by accountDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewAccount (targetEvent) {
            accountService
                .showAccountDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewAccount resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewAccount rejected", response])
                })
        }
    }
})();