(function (){
    'use strict';

    const _requires = [
        'enumService',
        'uriService',
        'analysisSettingsCardComponent'
    ];

    angular
        .module('analysisSettingsPageController', _requires)
        .controller('analysisSettingsPageController', analysisSettingsPageController);

    analysisSettingsPageController.$inject = [
        '$http',
        'enumService',
        'uriService'
    ];

    function analysisSettingsPageController (
        $http,
        enumService,
        uriService
    ){
        let vm = this;
        vm.$onInit = onInit;
        vm.singleRecordSettings = undefined;
        vm.loadedFromServer = false;

        function onInit (){
            vm.singleRecordSettings = enumService.ANALYSIS_SETTINGS.DYNAMIC_SINGLE_RECORDS;
            loadSettings(true);
        }

        function loadSettings() {
            let params = {limit: 100};
            params['query'] = {field_key__in: Object.keys(vm.singleRecordSettings)};
            $http
                .get(uriService.ENDPOINT.ANALYSIS_CATEGORY_SETTINGS, {params: params})
                .then((response) => {
                    vm.loadedFromServer = true;
                    if (response.status === 200) {
                        angular.forEach(response.data.data, (record)=>{
                            try{
                                vm.singleRecordSettings[record.field_key]['item'] = record;
                            } catch (e) {
                                console.warning([
                                    "*** field_key is not registerd in enum object",
                                    record, vm.singleRecordSettings]
                                )
                            }
                        })
                    }
                })
        }

    }
})();