(function (){
    'use strict';
    angular
        .module('contactPageController', ['contactService'])
        .controller('contactPageController', contactPageController);

    contactPageController.$inject = [
        'contactService',
    ];

    function contactPageController (
        contactService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.createNewContact = createNewContact;

        function onInit (){}

        /**
         * Create a new contact by accountDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewContact (targetEvent) {
            contactService
                .showContactDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewContact resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewContact rejected", response])
                })
        }
    }
})();