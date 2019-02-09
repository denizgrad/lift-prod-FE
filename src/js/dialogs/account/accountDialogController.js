(function (angular){
    'use strict';
    const _requires = [
        'accountService',
        'enumService',
        'ui.mask',
    ];
    angular
        .module('accountDialog', _requires)
        .controller('accountDialogController', accountDialogController);

    accountDialogController.$inject = [
        '$q',
        '$http',
        '$mdDialog',
        'accountService',
        'enumService',
        'uriService',
        'toastr',
    ];

    function accountDialogController (
        $q,
        $http,
        $mdDialog,
        accountService,
        enumService,
        uriService,
        toastr
    ) {
        const
            ACC_ID = accountService.accountDialogOptions.account_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createAccount
            },
            DELETE_BTN = {
                label: 'Sil',
                onClick: deleteAccount
            },
            PROMISES = {
                fetching: false,
                createOrUpdate: false,
                delete: false
            },
            FORM_OPTIONS = {
            },
            ERROR = {
                hasError: false,
                message: '',
                detail: '',
                status: 200,
            };

        let vm = this;
        vm.$onInit = onInit;
        vm.cancelDialog = cancelDialog;
        vm.checkOptionIsSelected = checkOptionIsSelected;
        vm.saveBtnOptions = SAVE_BTN;
        vm.deleteBtnOptions = DELETE_BTN;
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.account = {};
        vm.initDone = false;
        vm.is_update = false;

        function onInit () {
            if (ACC_ID) {
                // If dialog mode is edit
                vm.promises.delete = true;
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateAccount;
                vm.is_update = true;
                setActiveAccount()
            } else {
                setCreateDefaults()
            }
            vm.initDone = true;
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveAccount () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.ACCOUNT}/${ACC_ID}`)
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveAccount(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function createAccount () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let defer = $q.defer();
            $http
                .post(uriService.ENDPOINT.ACCOUNT, {data: vm.account})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }
        function deleteAccount () {
            vm.error.hasError = false;
            vm.promises.delete = true;
            let defer = $q.defer();
            $http
                .delete(`${uriService.ENDPOINT.ACCOUNT}/${ACC_ID}`, {})
                .then(
                    (response)=> { defer.resolve(resolvedDelete(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }
        function updateAccount () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyAccount = angular.copy(vm.account);
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.ACCOUNT}/${ACC_ID}`, {data: copyAccount})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function resolvedSetActiveAccount (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }
            vm.account = response.data.attributes;
            if (vm.account._key_currency) {
                vm.account._key_currency = vm.account._key_currency.$oid;
            }
            vm.promises.fetching = false;
            return response
        }


        function resolvedDelete (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.delete = false;
                toastr.success('Firma kaydı silindi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function resolvedCreate (response) {
            if (response.status !== 201) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Yeni firma kaydı yaptınız', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function resolvedUpdate (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Firma başarıyla güncellendi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function showErrorMessageFromResponse (response) {
            vm.promises.fetching = false;
            vm.promises.createOrUpdate = false;
            vm.promises.delete = false;
            if (response.data.error && response.data.error.message) {
                vm.error.message = response.data.error.message;
                if (response.data.error.message === enumService.ERRORS.UNIQUE) {
                    vm.error.detail = 'Bu firma kodu yada adı ile eşleşen bir başka firma bulunmaktadır';
                } else if (response.data.error.message === enumService.ERRORS.NOT_DELETED){
                    vm.error.detail = 'Bu firma silinemez. Önce bağlantılar silinmeli: Kişi yada Teklif';
                }
                else {
                    vm.error.detail = response.data.error.detail
                }
            } else {
                vm.error.detail = 'Beklenmeyen bir hata oluştu';
                vm.error.message = 'Üzgünüz!'
            }
            vm.error.status = response.status;
            vm.error.hasError = true;
            toastr.error(vm.error.detail, vm.error.message);
            return response
        }

        function setCreateDefaults () {
            vm.account = accountService.MODEL_DEFAULTS;
        }

        function checkOptionIsSelected (accountField, selectableObject) {
            if (!vm.account[accountField] && selectableObject.defaultSelected) {
                vm.account[accountField] = selectableObject.id;
            }
        }
    }
})(window.angular);