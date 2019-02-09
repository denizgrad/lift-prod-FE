/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 13 January 2018 01:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      deleteRecordButtonComponent:deleteRecordButton componentinin Controller modülüdür
     */
    angular
        .module('deleteRecordButtonComponentController', ['deleteAlertDialog'])
        .controller('deleteRecordButtonComponentController', deleteRecordButtonComponentController);

    /**
     * Inject list of deleteRecordButtonComponentController
     * @type {string[]}
     */
    deleteRecordButtonComponentController.$inject = [
        'toastr',
        '$http',
        'deleteAlertDialogService',
    ];

    function deleteRecordButtonComponentController(
        toastr,
        $http,
        deleteAlertDialogService
    ) {

        let vm = this;
        vm.$onInit = onInit;
        vm.showAlertDialog = showAlertDialog;

        function onInit () {
        }

        function showAlertDialog (targetEvent) {
            let args = {
                endpoint: vm.endpoint||null,
                recordId: vm.recordId||null,
                callbackOnDelete: vm.callbackOnDelete||null,
                callbackArgs: vm.callbackArgs||undefined
            };
            if (! args.endpoint || ! args.recordId) {
                throw Error('Endpoint ve recordId bilgileri zorunludur');
            }
            console.log(args);
            deleteAlertDialogService.showDeleteAlertDialog(targetEvent, args)
        }


    }
})(window.angular);