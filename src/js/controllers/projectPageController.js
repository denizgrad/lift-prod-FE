(function (){
    'use strict';
    angular
        .module('projectPageController', ['projectService'])
        .controller('projectPageController', projectPageController);

    projectPageController.$inject = [
        'projectService'
    ];

    function projectPageController (
        projectService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.createNewProject = createNewProject;
        vm.createNewQuote = createNewQuote;

        function onInit (){}

        /**
         * Create a new project by projectDialog
         * @param {event} targetEvent: Javascript mouse click event
         */
        function createNewProject (targetEvent) {
            projectService
                .showProjectDialog(targetEvent, null, null)
                .then((response)=>{
                    console.log(["*** createNewProject resolved", response])
                })
                .catch((response)=>{
                    console.log(["*** createNewProject rejected", response])
                })
        }

        function createNewQuote (targetEvent) {

        }
    }
})();