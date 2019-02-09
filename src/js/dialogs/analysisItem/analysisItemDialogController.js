(function (angular){
    'use strict';
    const _requires = [
        'analysisService',
        'enumService',
    ];
    angular
        .module('analysisItemDialog', _requires)
        .controller('analysisItemDialogController', analysisItemDialogController);

    analysisItemDialogController.$inject = [
        '$q',
        '$http',
        '$mdDialog',
        'analysisService',
        'enumService',
        'uriService',
        'toastr',
    ];

    function analysisItemDialogController (
        $q,
        $http,
        $mdDialog,
        analysisService,
        enumService,
        uriService,
        toastr
    ) {
        const
            includes = '_key_analysis_category',
            RECORD_ID = analysisService.dialogOptions.record_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createanalysisItem
            },
            DELETE_BTN = {
                label: 'Sil',
                // onClick: deleteanalysisItem
            },
            PROMISES = {
                fetching: false,
                createOrUpdate: false,
                delete: false,
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
        vm.saveBtnOptions = SAVE_BTN;
        vm.deleteBtnOptions = DELETE_BTN;
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.analysisItem = {};
        vm.analysisCategories = [];
        vm.initDone = false;
        vm.is_update = false;

        function onInit () {
            if (RECORD_ID) {
                // If dialog mode is edit
                vm.dialogTitle = 'Güncelle';
                vm.promises.delete = true;
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateanalysisItem;
                vm.is_update = true;
                setActiveanalysisItem().then((response) => {vm.initDone = true;});
            } else {
                vm.dialogTitle = 'Tanımla';
                vm.initDone = true;
            }
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveanalysisItem () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let params = {include: includes};
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.ANALYSIS_CATEGORY_ITEM}/${RECORD_ID}`, {params})
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveanalysisItem(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function createanalysisItem () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let defer = $q.defer();
            $http
                .post(uriService.ENDPOINT.ANALYSIS_CATEGORY_ITEM, {data: vm.analysisItem})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function updateanalysisItem () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyanalysisItem = angular.copy(vm.analysisItem);
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.ANALYSIS_CATEGORY_ITEM}/${RECORD_ID}`, {data: copyanalysisItem})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function resolvedSetActiveanalysisItem (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }
            const categoryId = response.data.attributes._key_analysis_category._id.$oid;
            vm.analysisCategories = [];
            vm.analysisItem = response.data.attributes;
            vm.analysisCategories.push({...vm.analysisItem._key_analysis_category});
            vm.analysisItem._key_analysis_category = categoryId;
            vm.promises.fetching = false;
            return response
        }


        function resolvedDelete (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.delete = false;
                toastr.success('Bir analiz kalemi silindiniz', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function resolvedCreate (response) {
            if (response.status !== 201) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Yeni bir analiz kalemi oluşturdunuz', 'Başarılı');
                return response
            }
        }

        function resolvedUpdate (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Analiz kalemi güncellendi', 'Başarılı');
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
                    vm.error.detail = 'İsim alanı eşsiz olmalıdır lütfen başka bir isimle tekrar deneyiniz';
                } else if (response.data.error.message === enumService.ERRORS.NOT_DELETED) {
                    vm.error.detail = 'Bu malzeme cinsi silinemez ilişkili kayıtlar bulunmaktadır';
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
    }
})(window.angular);