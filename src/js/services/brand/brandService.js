(function (angular, paths) {
    angular
        .module('brandService', [])
        .factory('brandService', brandService);

    brandService.$inject = ['$mdDialog'];

    function brandService ($mdDialog) {
        const
            DIALOG_PATH = paths.DIALOGS_PATH,
            BRAND_DIALOG_PATH = `${DIALOG_PATH}/brand/brandDialog.html?v=${paths.version}`,
            BRAND_DIALOG_OPTIONS = {brand_id: null}

        const servicePublic = {
            showBrandDialog,
            brandDialogOptions: BRAND_DIALOG_OPTIONS,
        };

        // Return accessible service vars
        return servicePublic;

        /**
         * Edit a brand item or create a new one
         * @param {event} targetEvent
         * @param {string|null} brand_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showBrandDialog (targetEvent, brand_id, args) {
            servicePublic.brandDialogOptions.brand_id = brand_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            return $mdDialog.show({
                templateUrl: BRAND_DIALOG_PATH,
                controller: 'brandDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            });
        }
    }
})(window.angular, window.paths);