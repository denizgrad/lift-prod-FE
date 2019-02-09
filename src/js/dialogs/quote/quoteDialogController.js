(function (angular){
    'use strict';
    const _requires = [
        'projectService',
        'enumService',
    ];
    angular
        .module('projectDialog', _requires)
        .controller('projectDialogController', projectDialogController);

    projectDialogController.$inject = [
        '$q',
        '$http',
        '$mdDialog',
        'projectService',
        'enumService',
        'uriService',
        'toastr',
        'accountService',
        'autoCompleteService',
    ];

    function projectDialogController (
        $q,
        $http,
        $mdDialog,
        projectService,
        enumService,
        uriService,
        toastr,
        accountService,
        autoCompleteService,
    ) {
        const
            includes = '_key_account_owner,_key_account_contractor',
            PROJECT_ID = projectService.projectDialogOptions.project_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createProject
            },
            DELETE_BTN = {
                label: 'Sil',
                onClick: deleteProject
            },
            PROMISES = {
                fetching: false,
                createOrUpdate: false,
                delete: false
            },
            FORM_OPTIONS = {
            },
            ACCOUNT_ACMP_SETTINGS_OWNER = {
                onChange: onOwnerAccountChange,
                prepareParams: prepareCategoryParams,
                endPoint: uriService.ENDPOINT.ACCOUNT,
                searchLengthLimit: 0
            },
            ACCOUNT_ACMP_SETTINGS_CONTRACTOR = {
                onChange: onContractorAccountChange,
                prepareParams: prepareCategoryParams,
                endPoint: uriService.ENDPOINT.ACCOUNT,
                searchLengthLimit: 0
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
        vm.createNewAccountContractor = createNewAccountContractor;
        vm.createNewAccountOwner = createNewAccountOwner;
        vm.acmpAccountSettingsOwner = autoCompleteService.getAutoCompleteOptions(ACCOUNT_ACMP_SETTINGS_OWNER);
        vm.acmpAccountSettingsContractor = autoCompleteService.getAutoCompleteOptions(ACCOUNT_ACMP_SETTINGS_CONTRACTOR);
        vm.saveBtnOptions = SAVE_BTN;
        vm.deleteBtnOptions = DELETE_BTN
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.project = {};
        vm.initDone = false;
        vm.is_update = false;

        function onInit () {
            if (PROJECT_ID) {
                // If dialog mode is edit
                vm.promises.delete = true;
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateProject;
                vm.is_update = true;
                setActiveProject()
            } else {
                setCreateDefaults()
            }
            vm.initDone = true;
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveProject () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.PROJECT}/${PROJECT_ID}`, {params: {include: includes}})
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveProject(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function arrangeDates (inputData){
            inputData.bid_date={'$date':inputData.bid_date.getTime()};
            inputData.start_date={'$date':inputData.start_date.getTime()};
            return inputData;
        }

        function createProject () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let defer = $q.defer();
            $http
                .post(uriService.ENDPOINT.PROJECT, {data: arrangeDates(vm.project)})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }
        function deleteProject () {
            vm.error.hasError = false;
            vm.promises.delete = true;
            let defer = $q.defer();
            $http
                .delete(`${uriService.ENDPOINT.PROJECT}/${PROJECT_ID}`, {})
                .then(
                    (response)=> { defer.resolve(resolvedDelete(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }
        function updateProject () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyProject = angular.copy( arrangeDates(vm.project));
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.PROJECT}/${PROJECT_ID}`, {data: copyProject})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function resolvedSetActiveProject (response) {
            console.log(response)
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }

            vm.project = response.data.attributes;//curr, accs
            if (vm.project.bid_date) {
                vm.project.bid_date = new Date(vm.project.bid_date.$date);
            }
            if (vm.project.start_date) {
                vm.project.start_date = new Date(vm.project.start_date.$date);
            }

            if (vm.project._key_currency_amount) {
                vm.project._key_currency_amount = vm.project._key_currency_amount.$oid;
            }
            if (vm.project._key_currency_lift_total) {
                vm.project._key_currency_lift_total = vm.project._key_currency_lift_total.$oid;
            }
            if (vm.project._key_account_owner) {
                vm.acmpAccountSettingsOwner.selected_item = vm.project._key_account_owner;
                vm.project._key_account_owner = vm.project._key_account_owner._id.$oid;
            }
            if (vm.project._key_account_contractor) {
                vm.acmpAccountSettingsContractor.selected_item = vm.project._key_account_contractor;
                vm.project._key_account_contractor = vm.project._key_account_contractor._id.$oid;
            }
            vm.promises.fetching = false;
            return response
        }

        window.vm = vm;

        function resolvedDelete (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.delete = false;
                toastr.success('Proje kaydı silindi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function resolvedCreate (response) {
            if (response.status !== 201) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Yeni proje kaydı yaptınız', 'Başarılı');
                return response
            }
        }

        function resolvedUpdate (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Proje başarıyla güncellendi', 'Başarılı');
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
                    vm.error.detail = 'Bu proje adı ile eşleşen bir başka proje bulunmaktadır';
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
            vm.record = {};
            let dialogDefaults = projectService.projectDialogOptions.defaultData||{};
            if (dialogDefaults._key_account_owner) {
                vm.acmpAccountSettings.selected_item = dialogDefaults._key_account_owner;
                onOwnerAccountChange(dialogDefaults._key_account_owner)
            }
            if (dialogDefaults._key_account_contractor) {
                vm.acmpAccountSettings.selected_item = dialogDefaults._key_account_contractor;
                onContractorAccountChange(dialogDefaults._key_account_contractor)
            }
        }

        function checkOptionIsSelected (projectField, selectableObject) {
            if (!vm.project[projectField] && selectableObject.defaultSelected) {
                vm.project[projectField] = selectableObject.id;
            }
        }
        function createNewAccountOwner (targetEvent) {
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
        function createNewAccountContractor (targetEvent) {
            vm.cancelDialog();
            accountService.showAccountDialog(targetEvent, null, null).then((result)=>{
                console.log("*** response createNewAccount");
                console.log(result);
                let dialogOptions = {
                    defaultData: {_key_project: result}
                };
                console.log(dialogOptions);
                contactService.showContactDialog(null, null, dialogOptions);
            }).catch((rejected)=>{console.log("*** createNewAccount rejected");console.log(rejected);})
        }
        function prepareCategoryParams (searchText) {
            return {query: {name: {'$regex': searchText, '$options': 'i'}}}
        }
        function onOwnerAccountChange (item) {
            if (! item) {
                delete vm.project._key_account_owner;
                return false;
            }
            vm.project._key_account_owner = item._id ? item._id.$oid : item._id.$oid;
        }
        function onContractorAccountChange (item) {
            if (! item) {
                delete vm.project._key_account_contractor;
                return false;
            }
            vm.project._key_account_contractor = item._id ? item._id.$oid : item._id.$oid;
        }
    }
})(window.angular);