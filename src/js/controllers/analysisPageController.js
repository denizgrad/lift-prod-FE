(function (){
    'use strict';
    angular
        .module('analysisPageController', ['analysisService'])
        .controller('analysisPageController', analysisPageController);

    analysisPageController.$inject = [
        'analysisService',
    ];

    function analysisPageController (
        analysisService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.createNewAnalysisCategory = createNewAnalysisCategory;
        vm.createNewAnalysisItem = createNewAnalysisItem;

        function onInit (){}

        /**
         * Create a new analysisCategory by analysisCategoryDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewAnalysisCategory (targetEvent) {
            analysisService
                .showAnalysisCategoryDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewAnalysisCategory resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewAnalysisCategory rejected", response])
                })
        }

        /**
         * Create a new analysisItem by analysisItemDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewAnalysisItem (targetEvent) {
            analysisService
                .showAnalysisItemDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewAnalysisItem resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewAnalysisItem rejected", response])
                })
        }
    }
})();