(function (){
    'use strict';
    angular
        .module('stockPageController', ['stockService'])
        .controller('stockPageController', stockPageController);

    stockPageController.$inject = [
        'stockService',
    ];

    function stockPageController (
        stockService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.createNewStock = createNewStock;

        function onInit (){}

        /**
         * Create a new stock by stockDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewStock (targetEvent) {
            stockService
                .showStockDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewStock resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewStock rejected", response])
                })
        }
    }
})();