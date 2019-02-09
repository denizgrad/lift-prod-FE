(function (angular, paths) {
    angular
        .module('contactService', [])
        .factory('contactService', contactService);

    contactService.$inject = ['$mdDialog'];

    function contactService ($mdDialog) {
        const
            DIALOG_PATH = `${paths.DIALOGS_PATH}/contact/contactDialog.html?v=${paths.version}`,
            DIALOG_OPTIONS = {record_id: null};

        const servicePublic = {
            showContactDialog: showContactDialog,
            dialogOptions: DIALOG_OPTIONS,
        };

        // Return accessible service vars
        return servicePublic;

        /**
         * Edit a contact item or create a new one
         * @param {event} targetEvent
         * @param {string|null} record_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showContactDialog (targetEvent, record_id, args) {
            servicePublic.dialogOptions.record_id = record_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            servicePublic.dialogOptions.defaultData = args.defaultData || null;
            return $mdDialog.show({
                templateUrl: DIALOG_PATH,
                controller: 'contactDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            });
        }
    }
})(window.angular, window.paths);