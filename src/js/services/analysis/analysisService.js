(function (angular, paths) {
    angular
        .module('analysisService', [])
        .factory('analysisService', analysisService);

    analysisService.$inject = ['$mdDialog'];

    function analysisService ($mdDialog) {
        const
            DIALOG_PATH = paths.DIALOGS_PATH,
            CATEGORY_DIALOG_PATH = `${DIALOG_PATH}/analysisCategory/analysisCategoryDialog.html?v=${paths.version}`,
            CATEGORY_ITEM_DIALOG_PATH = `${DIALOG_PATH}/analysisItem/analysisItemDialog.html?v=${paths.version}`,
            CATEGORY_DIALOG_OPTIONS = {record_id: null};


        const servicePublic = {
            showAnalysisCategoryDialog: showAnalysisCategoryDialog,
            showAnalysisItemDialog: showAnalysisItemDialog,
            dialogOptions: CATEGORY_DIALOG_OPTIONS,
        };

        // Return accessible service vars
        return servicePublic;

        /**
         * Edit a account item or create a new one
         * @param {event} targetEvent
         * @param {string|null} record_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showAnalysisCategoryDialog (targetEvent, record_id, args) {
            servicePublic.dialogOptions.record_id = record_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            return $mdDialog.show({
                templateUrl: CATEGORY_DIALOG_PATH,
                controller: 'analysisCategoryDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            });
        }

        /**
         * Edit a account item or create a new one
         * @param {event} targetEvent
         * @param {string|null} record_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showAnalysisItemDialog (targetEvent, record_id, args) {
            servicePublic.dialogOptions.record_id = record_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            return $mdDialog.show({
                templateUrl: CATEGORY_ITEM_DIALOG_PATH,
                controller: 'analysisItemDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            });
        }
    }
})(window.angular, window.paths);