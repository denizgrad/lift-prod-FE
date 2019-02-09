(function (angular){
    'use strict';
    const _requires = [
        'contactService',
        'enumService'
    ];
    angular
        .module('contactDialog', _requires)
        .controller('contactDialogController', contactDialogController);

    contactDialogController.$inject = [
        '$q',
        '$http',
        '$mdDialog',
        'toastr',
        'uriService',
        'enumService',
        'autoCompleteService',
        'contactService',
        'accountService'
    ];

    function contactDialogController (
        $q,
        $http,
        $mdDialog,
        toastr,
        uriService,
        enumService,
        autoCompleteService,
        contactService,
        accountService
    ) {
        const
            includes = '_key_account',
            RECORD_ID = contactService.dialogOptions.record_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createStock
            },
            PROMISES = {
                fetching: false,
                createOrUpdate: false,
            },
            ERROR = {
                hasError: false,
                message: '',
                detail: '',
                status: 200,
            },
            FORM_OPTIONS = {
                stockTypes: enumService.getStockTypes(),
                unitTypes: enumService.getUnitTypes(),
                subUnitTypes: enumService.getSubUnitTypes(),
            },
            ACCOUNT_ACMP_SETTINGS = {
                onChange: onAccountChange,
                prepareParams: prepareCategoryParams,
                endPoint: uriService.ENDPOINT.ACCOUNT,
                searchLengthLimit: 0
            };

        let vm = this;
        vm.$onInit = onInit;
        vm.cancelDialog = cancelDialog;
        vm.checkOptionIsSelected = checkOptionIsSelected;
        vm.createNewAccount = createNewAccount;
        vm.acmpAccountSettings = autoCompleteService.getAutoCompleteOptions(ACCOUNT_ACMP_SETTINGS);
        vm.saveBtnOptions = SAVE_BTN;
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.record = {};
        vm.initDone = false;
        vm.is_update = false;

        function onInit () {
            if (RECORD_ID) {
                // If dialog mode is edit
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateRecord;
                vm.is_update = true;
                setActiveStock()
            } else {
                setCreateDefaults()
            }
            vm.initDone = true;
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveStock () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.CONTACT}/${RECORD_ID}`, {params: {include: includes}})
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveRecord(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function createStock () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            vm.record = checkAccountValue(vm.record);
            let defer = $q.defer();

            $http
                .post(uriService.ENDPOINT.CONTACT, {data: vm.record})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function updateRecord () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyRecord = angular.copy(vm.record);
            copyRecord = checkAccountValue(copyRecord);
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.CONTACT}/${RECORD_ID}`, {data: copyRecord})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function checkAccountValue (stockObject) {
            if (! vm.acmpAccountSettings.selected_item) {
                if (vm.acmpAccountSettings.searchText && vm.acmpAccountSettings.searchText.length >= 2) {
                    stockObject._key_account = vm.acmpAccountSettings.searchText;
                }
            }
            return stockObject
        }

        function resolvedSetActiveRecord (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }
            vm.record = response.data.attributes;            
            if (vm.record._key_account) {
                vm.acmpAccountSettings.selected_item = vm.record._key_account;
                vm.record._key_account = vm.record._key_account.$oid;
            }
            vm.promises.fetching = false;
            return response
        }

        function resolvedCreate (response) {
            if (response.status !== 201) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Kayıt başarıyla oluşturuldu', 'Başarılı');
                // setCreateDefaults();
                return response
            }
        }

        function resolvedUpdate (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Kayıt başarıyla güncellendi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function showErrorMessageFromResponse (response) {
            vm.promises.fetching = false;
            vm.promises.createOrUpdate = false;
            if (response.data.error && response.data.error.message) {
                vm.error.message = response.data.error.message;
                if (response.data.error.message === enumService.ERRORS.UNIQUE) {
                    vm.error.detail = 'Stok kodu ile eşleşen bir başka ürün bulunmaktadır';
                } else {
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
            vm.record = {};
            let dialogDefaults = contactService.dialogOptions.defaultData||{};
            if (dialogDefaults._key_account) {
                vm.acmpAccountSettings.selected_item = dialogDefaults._key_account;
                onAccountChange(dialogDefaults._key_account)
            }
        }

        function checkOptionIsSelected (stockField, selectableObject) {
            if (!vm.record[stockField] && selectableObject.defaultSelected) {
                vm.record[stockField] = selectableObject.id;
            }
        }

        function onAccountChange (item) {
            if (! item) {
                delete vm.record._key_account;
                return false;
            }
            vm.record._key_account = item._id ? item._id.$oid : item._id.$oid;
        }
        
        function prepareCategoryParams (searchText) {
            return {query: {name: {'$regex': searchText, '$options': 'i'}}}
        }

        function createNewAccount (targetEvent) {
            vm.cancelDialog();
            accountService.showAccountDialog(targetEvent, null, null).then((result)=>{
                console.log("*** response createNewAccount");
                console.log(result);
                let dialogOptions = {
                    defaultData: {_key_account: result}
                };
                console.log(dialogOptions);
                contactService.showContactDialog(null, null, dialogOptions);
            }).catch((rejected)=>{console.log("*** createNewAccount rejected");console.log(rejected);})
        }
    }
})(window.angular);