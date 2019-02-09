(function (angular, paths) {
    angular
        .module('projectService', [])
        .factory('projectService', projectService);

    projectService.$inject = ['$mdDialog'];

    function projectService ($mdDialog) {
        const
            DIALOG_PATH = paths.DIALOGS_PATH,
            PROJECT_DIALOG_PATH = `${DIALOG_PATH}/project/projectDialog.html?v=${paths.version}`,
            PROJECT_DIALOG_OPTIONS = {project_id: null}

        const servicePublic = {
            showProjectDialog,
            projectDialogOptions: PROJECT_DIALOG_OPTIONS,
        };

        // Return accessible service vars
        return servicePublic;

        /**
         * Edit a project item or create a new one
         * @param {event} targetEvent
         * @param {string|null} project_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showProjectDialog (targetEvent, project_id, args) {
            servicePublic.projectDialogOptions.project_id = project_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            return $mdDialog.show({
                templateUrl: PROJECT_DIALOG_PATH,
                controller: 'projectDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            });
        }

    }
})(window.angular, window.paths);