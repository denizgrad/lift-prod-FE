/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 27 January 2019 11:00 AM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      analysisSettingsCardComponent:analysisSettingsCard componentinin Controller modülüdür
     */
    angular
        .module('analysisSettingsCardController', [])
        .controller('analysisSettingsCardController', analysisSettingsCardController);

    /**
     * Inject list of analysisSettingsCardController
     * @type {string[]}
     */
    analysisSettingsCardController.$inject = [
        '$q',
        '$http',
        '$timeout',
        'toastr',
        'uriService',
        'enumService',
        'analysisSettingsService',
    ];

    function analysisSettingsCardController(
        $q,
        $http,
        $timeout,
        toastr,
        uriService,
        enumService,
        analysisSettingsService
    ) {
        const URL = uriService.ENDPOINT.ANALYSIS_CATEGORY_SETTINGS;
        let vm = this;
        vm.$onInit = onInit;
        vm.keyPressListener = keyPressListener;
        vm.updateKeypressListener = updateKeypressListener;
        vm.deleteRecord = deleteRecord;
        vm.updateRecord = updateRecord;
        vm.toggleUpdatePanel = toggleUpdatePanel;
        vm.endpoint = URL;
        vm.newRecordValue = '';
        vm.enumSettings = undefined;
        vm.isFirstLoadDone = false;
        vm.showAddNewPanel = false;
        vm.promises = {
            fetch: false,
            create: false
        };

        function onInit() {
            vm.enumSettings = enumService.ANALYSIS_SETTINGS.DYNAMIC_LIST_RECORDS[vm.settingsKey];
            loadSettingsByKey(vm.settingsKey)
        }

        function toggleUpdatePanel(ev, record) {
            if (record.isEditActive) {
                record.isEditActive = false;
            } else {
                record.isEditActive = true;
                let recordIndex = vm.enumSettings.items.indexOf(record);
                $timeout(()=> {
                    document.getElementById(`${vm.settingsKey}-${recordIndex}`).focus();
                });
            }
        }

        /**
         * Load analysis settings by field_key
         * @param {!String} fieldKey: Analysis settings group key name
         */
        function loadSettingsByKey(fieldKey) {
            vm.promises.fetch = true;
            vm.enumSettings.items = [];
            let params = {order: 'id', query: {field_key: fieldKey}};
            $http
                .get(URL, {params})
                .then(({status, data}) => {
                    if (status === 200) {
                        vm.enumSettings.items = data.data;
                    } else {
                        toastr.warning(`${vm.enumSettings.display} özellikleri yüklenirken bir hata oluştu`);
                    }
                    vm.isFirstLoadDone = true;
                    vm.promises.fetch = false;
                })
                .catch((errorResponse) => {
                    toastr.warning(`${vm.enumSettings.display} özellikleri yüklenirken bir hata oluştu`);
                    vm.isFirstLoadDone = true;
                    vm.promises.fetch = false;
                })
        }

        /**
         * On new record added
         * @param {!Object} ev: Javascript MouseEvent
         * @param {!String|Number} value: New record field_value
         */
        function craeteRecord(ev, value) {
            vm.promises.create = true;
            let payload = {data: {field_key: vm.settingsKey, field_value: value}};
            let defer = $q.defer();
            $http
                .post(URL, payload)
                .then((response) => {
                    vm.promises.create = false;
                    if (response.status === 201) {
                        vm.enumSettings.items.push(response.data.attributes);
                        vm.newRecordValue = '';
                        defer.resolve(response.data.attributes);
                    } else {
                        let preparedError = analysisSettingsService.handleRejectedCreateResponse(response);
                        toastr.error(preparedError.detail.toString(), preparedError.message);
                        vm.promises.create = false;
                        defer.reject(response);
                    }
                })
                .catch((errorResponse) => {
                    let preparedError = analysisSettingsService.handleRejectedCreateResponse(errorResponse);
                    toastr.error(preparedError.detail.toString(), preparedError.message);
                    vm.promises.create = false;
                    defer.reject(errorResponse);
                });
            return defer.promise;
        }

        /**
         * On record updated
         * @param {!Object} ev: Javascript MouseEvent
         * @param {!Object} record: Triggered record
         */
        function updateRecord(ev, record) {
            record.updating = true;
            let payload = {data: {field_value: record.updateValue}};
            let defer = $q.defer();
            $http
                .put(`${URL}/${record._id.$oid}`, payload)
                .then((response) => {
                    record.updating = false;
                    if (response.status === 200) {
                        record.field_value = payload.data.field_value;
                        record.isEditActive = false;
                        defer.resolve(true);
                    } else {
                        let preparedError = analysisSettingsService.handleRejectedUpdateResponse(response);
                        toastr.error(preparedError.detail.toString(), preparedError.message);
                        record.updating = false;
                        defer.reject(response);
                    }
                })
                .catch((errorResponse) => {
                    let preparedError = analysisSettingsService.handleRejectedUpdateResponse(errorResponse);
                    toastr.error(preparedError.detail.toString(), preparedError.message);
                    record.updating = false;
                    defer.reject(errorResponse);
                });
            return defer.promise;
        }

        /**
         * On record deleted
         * @param {!Response} response: HttpResponse
         * @param {!Object} record: Triggered record
         */
        function deleteRecord(response, record) {
            let defer = $q.defer();
            if (response.status === 200) {
                vm.enumSettings.items.splice(vm.enumSettings.items.indexOf(record));
                toastr.success(`Bir ${vm.enumSettings.display} tanımını sildiniz`);
                defer.resolve(true);
            } else {
                let preparedError = analysisSettingsService.handleRejectedCreateResponse(response);
                toastr.error(preparedError.detail, preparedError.message);
                defer.reject(response);
            }
            return defer.promise;
        }

        /**
         * Triggers on input enter
         * @param {!Object} ev: {keyPressEvent}
         * @param {!String|Number} value: New record field_value
         */
        function keyPressListener(ev, value) {
            if (! vm.promises.create
                && ev.keyCode === enumService.KEY_CODE.ENTER)
            {
                craeteRecord(ev, value).then(()=>{
                    let selectorName = `editableCardInput${vm.settingsKey}`;
                    document.querySelector(`input[name=${selectorName}]`).focus()
                });
            }
        }

        /**
         * Triggers on update input enter
         * @param {!Object} ev: {keyPressEvent}
         * @param {!Object} record: Update record object
         */
        function updateKeypressListener(ev, record) {
            console.log(["*** keykode", ev.keyCode, enumService.KEY_CODE]);
            if (! vm.promises.create
                && ev.keyCode === enumService.KEY_CODE.ENTER)
            {
                updateRecord(ev, record)
            }
        }
    }
})(window.angular);