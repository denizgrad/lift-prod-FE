(function (angular){
    'use strict';
    const _requires = [
        'analysisService',
        'enumService',
    ];
    angular
        .module('analysisCategoryDialog', _requires)
        .controller('analysisCategoryDialogController', analysisCategoryDialogController);

    analysisCategoryDialogController.$inject = [
        '$q',
        '$http',
        '$mdDialog',
        'analysisService',
        'enumService',
        'uriService',
        'toastr',
    ];

    function analysisCategoryDialogController (
        $q,
        $http,
        $mdDialog,
        analysisService,
        enumService,
        uriService,
        toastr
    ) {
        const
            RECORD_ID = analysisService.dialogOptions.record_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createanalysisCategory
            },
            DELETE_BTN = {
                label: 'Sil',
                onClick: deleteanalysisCategory
            },
            PROMISES = {
                fetching: false,
                createOrUpdate: false,
                delete: false,
                settingsFetching: false,
            },
            FORM_OPTIONS = {
            },
            ERROR = {
                hasError: false,
                message: '',
                detail: '',
                status: 200,
            };
        let oldCategorySettings = [];

        let vm = this;
        vm.$onInit = onInit;
        vm.cancelDialog = cancelDialog;
        vm.saveBtnOptions = SAVE_BTN;
        vm.deleteBtnOptions = DELETE_BTN;
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.analysisCategoryTypes = [];
        vm.analysisCategory = {};
        vm.initDone = false;
        vm.is_update = false;

        function onInit () {
            vm.analysisCategoryTypes = Object.values(enumService.ANALYSIS_CATEGORY);
            if (RECORD_ID) {
                // If dialog mode is edit
                vm.dialogTitle = 'Güncelle';
                vm.promises.delete = true;
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateanalysisCategory;
                vm.is_update = true;
                setActiveanalysisCategory().then((response) => {vm.initDone = true;});
            } else {
                vm.dialogTitle = 'Tanımla';
                vm.initDone = true;
            }
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveanalysisCategory () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.ANALYSIS_CATEGORY}/${RECORD_ID}`)
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveanalysisCategory(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function createanalysisCategory () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let defer = $q.defer();
            $http
                .post(uriService.ENDPOINT.ANALYSIS_CATEGORY, {data: vm.analysisCategory})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function deleteanalysisCategory () {
            return false;
            vm.error.hasError = false;
            vm.promises.delete = true;
            let defer = $q.defer();
            $http
                .delete(`${uriService.ENDPOINT.ANALYSIS_CATEGORY}/${RECORD_ID}`, {})
                .then(
                    (response)=> { defer.resolve(resolvedDelete(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function updateanalysisCategory () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyanalysisCategory = angular.copy(vm.analysisCategory);
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.ANALYSIS_CATEGORY}/${RECORD_ID}`, {data: copyanalysisCategory})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function resolvedSetActiveanalysisCategory (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }
            vm.analysisCategory = response.data.attributes;
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
                } else if (response.data.error.message === enumService.ERRORS.NOT_DELETED){
                    vm.error.detail = 'Bu malzeme cinsi silinemez ilişkili kayıtlar bulunmaktadır';
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
    }
})(window.angular);