(function (angular, paths) {
    angular
        .module('accountService', [])
        .factory('accountService', accountService);

    accountService.$inject = ['$mdDialog'];

    function accountService ($mdDialog) {
        const
            DIALOG_PATH = paths.DIALOGS_PATH,
            ACC_DIALOG_PATH = `${DIALOG_PATH}/account/accountDialog.html?v=${paths.version}`,
            ACC_DIALOG_OPTIONS = {account_id: null};

        const servicePublic = {
            showAccountDialog: showAccountDialog,
            accountDialogOptions: ACC_DIALOG_OPTIONS,
        };

        // Return accessible service vars
        return servicePublic;

        /**
         * Edit a account item or create a new one
         * @param {event} targetEvent
         * @param {string|null} account_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showAccountDialog (targetEvent, account_id, args) {
            servicePublic.accountDialogOptions.account_id = account_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            return $mdDialog.show({
                templateUrl: ACC_DIALOG_PATH,
                controller: 'accountDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            });
        }
    }
})(window.angular, window.paths);