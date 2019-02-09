/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 21 December 2018 15:00 AM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      stockActionTableComponent:stockActionTable componentinin Controller modülüdür
     */
    angular
        .module('stockActionTableController', [])
        .controller('stockActionTableController', stockActionTableController);

    /**
     * Inject list of stockActionTableController
     * @type {string[]}
     */
    stockActionTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log',
        'stockService',
        'enumService'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} fieldFilterService: Dynamic Query Filter Dialog service
     * @param {object} $log: Log service
     * @param {object} stockService: Stock Module service
     * @param {object} enumService: Application enum(constant) service
     */
    function stockActionTableController(
        $http, uriService, tableService, fieldFilterService, $log, stockService, enumService
    ) {
        const include = '_key_stock,_key_currency,_key_created_user';
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchStockActionList = fetchStockActionList;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.findEnumById = enumService.findEnumById;
        vm.enumTypes = {};
        vm.tableOptions = {};
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            vm.tableOptions.selectable = false;
            vm.tableOptions.query.order = '-action_no';
            vm.enumTypes = {
                actionTypes: enumService.getStockActionTypes(),
                unitTypes: enumService.getUnitTypes(),
                mainUnitTypes: enumService.getSubUnitTypes(),
            };
            fetchStockActionList();
        }

        function onReOrder() {
            fetchStockActionList()
        }

        function onPaginate() {
            fetchStockActionList()
        }

        function fetchStockActionList(){
            vm.tableOptions.query.promise = true;
            $http
                .get(uriService.ENDPOINT.STOCK_ACTION, {params: getFetchParams(),})
                .then(handlerSuccessfetchStockActionList)
                .catch(handlerErrorfetchStockActionList)
        }

        function getFetchParams () {
            let {limit, page, order} = vm.tableOptions.query;
            let params = {limit, page, order, include, query: {__raw__: {}}};
            vm.selectedFilters.map((fieldFilter) => {
                let value = {[fieldFilter.operator.id]: fieldFilter.value};
                if (fieldFilter.operator.id === '$regex') {
                    value['$options'] = '$i';
                }
                params.query.__raw__[fieldFilter.field.slug] = value;
            });
            return params;
        }

        function handlerSuccessfetchStockActionList({status, data}) {
            let {actionTypes, unitTypes, mainUnitTypes} = vm.enumTypes;
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                data.data.map((o)=>{
                    o.action_type = vm.findEnumById(actionTypes.items, o.action_type).display;
                    o._key_stock.unit_type = vm.findEnumById(unitTypes.items, o._key_stock.unit_type).display;
                    o._key_stock.main_unit_type = vm.findEnumById(mainUnitTypes.items, o._key_stock.main_unit_type).display;
                });
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchStockActionList({status, data}) {
            $log.error(["*** handlerErrorfetchStockActionList result: ", status, data]);
            vm.tableOptions.query.promise = false;
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
                    fetchStockActionList()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchStockActionList()
        }

        function getFilterFields () {
            return [
                {slug: 'action_no', type: 'number', display: 'Kayıt No', selected:true},
                {slug: 'waybill', type: 'number', display: 'İrsaliye No'},
                {slug: 'quantity', type: 'number', display: 'İşlem Miktarı'},
                {slug: 'unit_price', type: 'number', display: 'Birim Fiyat'},
                {slug: 'total_price', type: 'number', display: 'Toplam Fiyat'},
            ]
        }
    }
})(window.angular);