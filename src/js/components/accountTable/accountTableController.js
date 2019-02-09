/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      accountTableComponent:accountTable componentinin Controller modülüdür
     */
    angular
        .module('accountTableController', [])
        .controller('accountTableController', accountTableController);

    /**
     * Inject list of accountTableController
     * @type {string[]}
     */
    accountTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log',
        'accountService'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} fieldFilterService: Dynamic Query Filter Dialog service
     * @param {object} $log: Log service
     * @param {object} accountService: account Module service
     */
    function accountTableController(
        $http, uriService, tableService, fieldFilterService, $log, accountService
    ) {
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchAccountList = fetchAccountList;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.updateRecord = updateRecord;
        vm.tableOptions = {};        
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            fetchAccountList();
        }

        function onReOrder() {
            fetchAccountList()
        }

        function onPaginate() {
            fetchAccountList()
        }

        function fetchAccountList(){
            vm.tableOptions.query.promise = true;
            $http
                .get(uriService.ENDPOINT.ACCOUNT, {params: getFetchParams()})
                .then(handlerSuccessfetchAccountList)
                .catch(handlerErrorfetchAccountList)
        }

        function getFetchParams () {
            let {limit, page, order} = vm.tableOptions.query;
            let params = {limit, page, order, query: {__raw__: {}}};
            vm.selectedFilters.map((fieldFilter) => {
                let value = {[fieldFilter.operator.id]: fieldFilter.value};
                if (fieldFilter.operator.id === '$regex') {
                    value['$options'] = '$i';
                }
                params.query.__raw__[fieldFilter.field.slug] = value;
            });
            return params;
        }

        function handlerSuccessfetchAccountList({status, data}) {
            $log.info(["*** handlerSuccessfetchAccountList result: ", status, data]);
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchAccountList({status, data}) {
            $log.error(["*** handlerErrorfetchAccountList result: ", status, data]);
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let accountItem = vm.tableOptions.query.selected[0];
            accountService.showAccountDialog(targetEvent, accountItem._id.$oid, null)
                .then(
                    (updatedAccount)=>{
                        fetchAccountList()
                    },
                    (errorResponse)=>{})
        }

        function addNewFilter (ev, editSelected) {
            let args = {
                targetEvent: ev,
                fieldFilterList: getFilterFields(),
                editSelected: editSelected ? angular.copy(editSelected) : null,
            };
            fieldFilterService.showDialog(args).then(function (obj) {
                if (obj.result){
                    if (! editSelected) {
                        vm.selectedFilters.push(obj.selectedFilter);
                    } else {
                        let selectedIndex = vm.selectedFilters.indexOf(editSelected);
                        if (! obj.removed) {
                            vm.selectedFilters[selectedIndex] = obj.selectedFilter;
                        } else {
                            vm.selectedFilters.splice(selectedIndex, 1);
                        }
                    }
                    fetchAccountList()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchAccountList()
        }

        function getFilterFields () {
            return [
                {slug: 'code', type: 'text', display: 'Firma Kodu'},
                {slug: 'name', type: 'text', display: 'Firma İsmi'},
                {slug: 'tax_administration', type: 'text', display: 'Vergi Dairesi'},
                {slug: 'tax_id_number', type: 'text', display: 'Vergi Numarası',  selected:true},
                {slug: 'web_address', type: 'text', display: 'Web Adresi'}
            ]
        }
    }
})(window.angular);