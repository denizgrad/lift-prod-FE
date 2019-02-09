(function (angular, paths){
    'use strict';
    const _requires = [];
    angular
        .module('deleteAlertDialog', _requires)
        .factory('deleteAlertDialogService', deleteAlertDialogService)
        .controller('deleteAlertDialogController', deleteAlertDialogController);

    deleteAlertDialogService.$inject = ['$mdDialog'];
    deleteAlertDialogController.$inject = ['$rootScope', 'toastr', '$http', 'deleteAlertDialogService', 'enumService'];

    function deleteAlertDialogService ($mdDialog) {
        const
            DIALOG_PATH = `${paths.DIALOGS_PATH}/deleteAlert/deleteAlertDialog.html?v=${paths.version}`;

        let dialogOptions = {
            clickOutsideToClose: true,
            fullscreen: true
        };

        return {
            showDeleteAlertDialog: showDeleteAlertDialog,
            cancelDialog: $mdDialog.cancel,
            acceptDeletion: $mdDialog.hide,
            dialogOptions: dialogOptions
        };

        /**
         * Trigger delete alert prompt
         * @param {event} targetEvent
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showDeleteAlertDialog (targetEvent, args) {
            args = typeof args === 'object' ? args : {};
            dialogOptions['args'] = args;
            console.log(["*** dialogargs", dialogOptions, args]);
            return $mdDialog.show({
                templateUrl: DIALOG_PATH,
                controller: 'deleteAlertDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: dialogOptions.clickOutsideToClose,
                fullscreen: dialogOptions.fullscreen
            });
        }
    }

    function deleteAlertDialogController ($rootScope, toastr, $http, deleteAlertDialogService, enumService) {
        const ERRORS = {
            hasError: false,
            errorMsg: '',
            errorDetail: ''
        };
        let vm = this;
        vm.$onInit = onInit;
        vm.cancelDialog = cancelDialog;
        vm.acceptDeletion = deleteAccepted;
        vm.dialogArgs = deleteAlertDialogService.dialogOptions;
        vm.errors = ERRORS;
        vm.deletionAccepted = false;
        vm.promise = false;
        vm.forceDelete = false;
        vm.forceDeleteAvaible = false;

        function onInit () {
            let user = $rootScope.currentUser||{roles: []};
            vm.forceDeleteAvaible = user.roles.indexOf(enumService.ROLES.ORG_ADMIN) !== -1;
        }

        function deleteAccepted() {
            vm.errors.hasError = false;
            vm.promise = true;
            let params = {};
            if (vm.forceDelete) {
                params.forceDelete = 'delete';
            }
            $http
                .delete(`${vm.dialogArgs.args.endpoint}/${vm.dialogArgs.args.recordId}`, {params})
                .then((response) => {
                    if (response.status === 200) {
                        try {
                            if (vm.dialogArgs.args.callbackArgs instanceof Array) {
                                let args = [response].concat(vm.dialogArgs.args.callbackArgs);
                                vm.dialogArgs.args.callbackOnDelete(...args)
                            } else {
                                vm.dialogArgs.args.callbackOnDelete()
                            }
                        } catch (err) {}
                        vm.promise = false;
                        deleteAlertDialogService.acceptDeletion();
                    } else {
                        deleteRejected(response)
                    }
                })
                .catch(deleteRejected);
        }

        function deleteRejected ({data, status}) {
            let {error} = data;
            try{
                vm.errors.errorMsg = error.message;
                vm.errors.errorDetail = error.detail
            } catch (e) {
                vm.errors.errorMsg = 'Beklenmeyen Bir Hata Oluştu';
                vm.errors.errorDetail = error;
            }
            switch (status) {
                case 406:
                    if (error && error.message === enumService.ERRORS.NOT_DELETED) {
                        vm.errors.errorMsg = 'Bu Kayıt Silinemez';
                        vm.errors.errorDetail = `
                        Bu kayıtla ilişkili kayıtlar bulunmaktadır. [${enumService.MODULE_NAMES[error.detail]}]
                        `
                    }
            }
            vm.errors.hasError = true;
            vm.promise = false;
            console.log(vm);
        }

        function cancelDialog() {
            toastr.info('Silme işlemini iptal ettiniz');
            deleteAlertDialogService.cancelDialog();
        }
    }
})(window.angular, window.paths);