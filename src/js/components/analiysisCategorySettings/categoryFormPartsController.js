/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      categoryFormPartsComponent:categoryFormParts componentinin Controller modülüdür
     */
    const _requires = [
        'uriService',
        'enumService',
        'analysisSettingsService',
    ];

    angular
        .module('categoryFormPartsController', _requires)
        .controller('categoryFormPartsController', categoryFormPartsController);

    /**
     * Inject list of categoryFormPartsController
     * @type {string[]}
     */
    categoryFormPartsController.$inject = [
        '$q',
        '$http',
        '$scope',
        'toastr',
        'enumService',
        'analysisSettingsService'
    ];

    function categoryFormPartsController(
        $q,
        $http,
        $scope,
        toastr,
        enumService,
        analysisSettingsService
    ) {
        let vm = this;
        vm.$onInit = onInit;
        vm.$onDestroy = onDestory;
        clearScope();

        function onInit (){
            if (! vm.watcherSetted) {
                setWathcer();
                vm.watcherSetted = true;
            }
        }

        function onDestory () {
            vm.unBindWatcher();
            clearScope();
        }

        function clearScope () {
            vm.settingsLoaded = false;
            vm.watcherSetted = false;
            vm.enumCategory = {};
            vm.enumSettings = {};
            vm.records = {};
        }

        function fireOnCategoryChange () {
            clearScope();
            let {DYNAMIC_LIST_RECORDS, STATIC_RECORDS, DYNAMIC_SINGLE_RECORDS} = JSON.parse(JSON.stringify(enumService.ANALYSIS_SETTINGS));
            vm.enumSettings = {...DYNAMIC_LIST_RECORDS, ...STATIC_RECORDS, ...DYNAMIC_SINGLE_RECORDS};
            vm.enumCategory = angular.copy(enumService.ANALYSIS_CATEGORY[vm.categoryKey]);
            if (vm.enumCategory.settingsKeys) {
                Object
                    .values(vm.enumSettings)
                    .filter((settings) => {
                        if (vm.enumCategory.settingsKeys.indexOf(settings.id) !== -1) {
                            vm.records[settings.id] = settings;
                        }
                    });
                loadDynamicRecords();
            } else {
                vm.records = {};
                vm.enumCategory.settingsKeys = [];
            }
        }

        function loadDynamicRecords () {
            let params = {order: 'field_value', limit: 1000, query: {field_key__in: vm.enumCategory.settingsKeys}};
            analysisSettingsService
                .fetchSettingsByParams(params)
                .then(({data}) => {
                    angular.forEach(data, (record)=>{
                        if (vm.records[record.field_key]) {
                            vm.records[record.field_key].items = vm.records[record.field_key].items || [];
                            if (record.field_key === 'max_kat_sayisi') {
                                for(let i=1; i<=record.field_value; i++) {
                                    vm.records[record.field_key].items.push(
                                        {...record, field_value: i}
                                    )
                                }
                            } else {
                                vm.records[record.field_key].items.push(record);
                            }
                        }
                    });
                    vm.settingsLoaded = true;
                })
                .catch(({message, detail})=>{
                    toastr.error(detail, message);
                    vm.settingsLoaded = true;
                })
        }

        function setWathcer () {
            vm.unBindWatcher = $scope.$watch(()=>{return vm.categoryKey}, (value) => {
                clearScope();
                fireOnCategoryChange();
            });
        }
    }
})(window.angular);