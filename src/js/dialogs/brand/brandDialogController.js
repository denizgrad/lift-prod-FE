(function (angular){
    'use strict';
    const _requires = [
        'brandService',
        'enumService',
    ];
    angular
        .module('brandDialog', _requires)
        .controller('brandDialogController', brandDialogController);

    brandDialogController.$inject = [
        '$q',
        '$http',
        '$mdDialog',
        'brandService',
        'enumService',
        'uriService',
        'toastr',
    ];

    function brandDialogController (
        $q,
        $http,
        $mdDialog,
        brandService,
        enumService,
        uriService,
        toastr
    ) {
        const
            BRAND_ID = brandService.brandDialogOptions.brand_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createBrand
            },
            DELETE_BTN = {
                label: 'Sil',
                onClick: deleteBrand
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
        vm.deleteBtnOptions = DELETE_BTN
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.brand = {};
        vm.initDone = false;
        vm.is_update = false;

        function onInit () {
            if (BRAND_ID) {
                // If dialog mode is edit
                vm.promises.delete = true;
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateBrand;
                vm.is_update = true;
                setActiveBrand()
            } else {
                setCreateDefaults()
            }
            vm.initDone = true;
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveBrand () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.BRAND}/${BRAND_ID}`)
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveBrand(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function createBrand () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let defer = $q.defer();
            $http
                .post(uriService.ENDPOINT.BRAND, {data: vm.brand})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }
        function deleteBrand () {
            vm.error.hasError = false;
            vm.promises.delete = true;
            let defer = $q.defer();
            $http
                .delete(`${uriService.ENDPOINT.BRAND}/${BRAND_ID}`, {})
                .then(
                    (response)=> { defer.resolve(resolvedDelete(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }
        function updateBrand () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyBrand = angular.copy(vm.brand);
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.BRAND}/${BRAND_ID}`, {data: copyBrand})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function resolvedSetActiveBrand (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }
            vm.brand = response.data.attributes;
            if (vm.brand._key_currency) {
                vm.brand._key_currency = vm.brand._key_currency.$oid;
            }
            vm.promises.fetching = false;
            return response
        }


        function resolvedDelete (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.delete = false;
                toastr.success('Marka kaydı silindi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function resolvedCreate (response) {
            if (response.status !== 201) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Yeni marka kaydı yaptınız', 'Başarılı');
                return response
            }
        }

        function resolvedUpdate (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Marka başarıyla güncellendi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function showErrorMessageFromResponse (response) {
            vm.promises.fetching = false;
            vm.promises.createOrUpdate = false;
            vm.promises.delete = false;
            console.log(response)
            if (response.data.error && response.data.error.message) {
                vm.error.message = response.data.error.message;
                if (response.data.error.message === enumService.ERRORS.UNIQUE) {
                    vm.error.detail = 'Bu marka adı ile eşleşen bir başka marka bulunmaktadır';
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
            vm.brand = brandService.MODEL_DEFAULTS;
        }

        function checkOptionIsSelected (brandField, selectableObject) {
            if (!vm.brand[brandField] && selectableObject.defaultSelected) {
                vm.brand[brandField] = selectableObject.id;
            }
        }
    }
})(window.angular);