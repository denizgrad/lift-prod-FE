/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      quoteTableComponent:quoteTable componentinin Controller modülüdür
     */
    angular
        .module('quoteTableController', [])
        .controller('quoteTableController', quoteTableController);

    /**
     * Inject list of quoteTableController
     * @type {string[]}
     */
    quoteTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} fieldFilterService: Dynamic Query Filter Dialog service
     * @param {object} $log: Log service
     * @param {object} quoteService: quote Module service
     */
    function quoteTableController(
        $http, uriService, tableService, fieldFilterService, $log, quoteService
    ) {
        let vm = this;
        const includes = '_key_project,_key_account,_key_currency_amount_total';
        vm.$onInit = onInit;
        vm.fetchQuoteList = fetchQuoteList;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.updateRecord = updateRecord;
        vm.getFilterFields = getFilterFields;
        vm.endpoint = uriService.ENDPOINT.QUOTE;
        vm.tableOptions = {};        
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            fetchQuoteList();
        }

        function onReOrder() {
            fetchQuoteList()
        }

        function onPaginate() {
            fetchQuoteList()
        }

        function fetchQuoteList(){
            vm.tableOptions.query.promise = true;
            vm.tableOptions.query.selected = [];
            $http
                .get(uriService.ENDPOINT.QUOTE, {params: getFetchParams()})
                .then(handlerSuccessfetchQuoteList)
                .catch(handlerErrorfetchQuoteList)
        }

        function getFetchParams () {
            let {limit, page, order} = vm.tableOptions.query;
            let params = {limit, page, order, include:includes, query: {__raw__: {}}};
            vm.selectedFilters.map((fieldFilter) => {
                let value = {[fieldFilter.operator.id]: fieldFilter.value};
                if (fieldFilter.operator.id === '$regex') {
                    value['$options'] = '$i';
                }
                params.query.__raw__[fieldFilter.field.slug] = value;
            });
            return params;
        }

        function handlerSuccessfetchQuoteList({status, data}) {
            $log.info(["*** handlerSuccessfetchQuoteList result: ", status, data]);
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchQuoteList({status, data}) {
            $log.error(["*** handlerErrorfetchQuoteList result: ", status, data]);
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let quoteItem = vm.tableOptions.query.selected[0];
            quoteService.showQuoteDialog(targetEvent, quoteItem._id.$oid, null)
                .then(
                    (updatedQuote)=>{
                        fetchQuoteList()
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
                    fetchQuoteList()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchQuoteList()
        }

        function getFilterFields () {
            return [
                {slug: 'name', type: 'text', display: 'Teklif Adı',  selected:true},
            ]
        }
    }
})(window.angular);