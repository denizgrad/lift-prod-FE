(function (){
    'use strict';
    angular
        .module('brandPageController', ['brandService'])
        .controller('brandPageController', brandPageController);

    brandPageController.$inject = [
        'brandService',
    ];

    function brandPageController (
        brandService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.createNewBrand = createNewBrand;

        function onInit (){}

        /**
         * Create a new brand by brandDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewBrand (targetEvent) {
            brandService
                .showBrandDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewBrand resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewBrand rejected", response])
                })
        }
    }
})();