/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 19 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      stockTableComponent:stockTable componentinin Controller modülüdür
     */
    angular
        .module('stockTableController', [])
        .controller('stockTableController', stockTableController);

    /**
     * Inject list of stockTableController
     * @type {string[]}
     */
    stockTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log',
        'stockService',
        'enumService',
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
    function stockTableController(
        $http, uriService, tableService, fieldFilterService, $log, stockService, enumService
    ) {
        const includes = '_key_brand,_key_currency,_key_category,_key_category_item,_created_user';
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchStockList = fetchStockList;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.updateRecord = updateRecord;
        vm.getFilterFields = getFilterFields;
        vm.endpoint = uriService.ENDPOINT.STOCK;
        vm.findEnumById = enumService.findEnumById;
        vm.enumTypes = {};
        vm.tableOptions = {};
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            vm.enumTypes = {
                unitTypes: enumService.getUnitTypes(),
                mainUnitTypes: enumService.getSubUnitTypes(),
            };
            fetchStockList();
        }

        function onReOrder() {
            fetchStockList()
        }

        function onPaginate() {
            fetchStockList()
        }

        function fetchStockList(){
            vm.tableOptions.query.selected = [];
            vm.tableOptions.query.promise = true;
            $http
                .get(uriService.ENDPOINT.STOCK, {params: getFetchParams()})
                .then(handlerSuccessfetchStockList)
                .catch(handlerErrorfetchStockList)
        }

        function getFetchParams () {
            let {limit, page, order} = vm.tableOptions.query;
            let params = {limit, page, order, include: includes, query: {__raw__: {}}};
            vm.selectedFilters.map((fieldFilter) => {
                let value = {[fieldFilter.operator.id]: fieldFilter.value};
                if (fieldFilter.operator.id === '$regex') {
                    value['$options'] = '$i';
                }
                params.query.__raw__[fieldFilter.field.slug] = value;
            });
            return params;
        }

        function handlerSuccessfetchStockList({status, data}) {
            let {unitTypes, mainUnitTypes} = vm.enumTypes;
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                data.data.map((o)=>{
                    o.unit_type = vm.findEnumById(unitTypes.items, o.unit_type).display;
                    o.main_unit_type = vm.findEnumById(mainUnitTypes.items, o.main_unit_type).display;
                });
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchStockList({status, data}) {
            $log.error(["*** handlerErrorfetchStockList result: ", status, data]);
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let stockItem = vm.tableOptions.query.selected[0];
            stockService
                .showStockDialog(targetEvent, stockItem._id.$oid, null)
                .then(
                    (updatedStock)=>{fetchStockList()},
                    (errorResponse)=>{}
                )
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
                    fetchStockList()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchStockList()
        }

        function getFilterFields () {
            return [
                {slug: 'barcode', type: 'text', display: 'Barkod'},
                {slug: 'stock_code', type: 'text', display: 'Stok Kodu', selected:true},
                {slug: 'name', type: 'text', display: 'Malzeme Adı'},
                {slug: 'unit_type', type: 'text', display: 'Birim Tipi'},
                {slug: 'main_unit_type', type: 'text', display: 'Esas Birim'},
                {slug: 'quantity', type: 'number', display: 'Miktar'},
                {slug: 'unit_price', type: 'number', display: 'Birim Fiyat'},
                {slug: 'total_price', type: 'number', display: 'Toplam Fiyat'},
                {slug: 'buying_price', type: 'number', display: 'Alış Fiyatı'},
                {slug: 'list_price', type: 'number', display: 'Satış Fiyat'},
            ]
        }
    }
})(window.angular);