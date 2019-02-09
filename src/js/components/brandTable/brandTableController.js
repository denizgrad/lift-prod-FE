/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      brandTableComponent:brandTable componentinin Controller modülüdür
     */
    angular
        .module('brandTableController', [])
        .controller('brandTableController', brandTableController);

    /**
     * Inject list of brandTableController
     * @type {string[]}
     */
    brandTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log',
        'brandService'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} fieldFilterService: Dynamic Query Filter Dialog service
     * @param {object} $log: Log service
     * @param {object} brandService: brand Module service
     */
    function brandTableController(
        $http, uriService, tableService, fieldFilterService, $log, brandService
    ) {
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchBrandList = fetchBrandList;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.updateRecord = updateRecord;
        vm.getFilterFields = getFilterFields;
        vm.endpoint = uriService.ENDPOINT.BRAND;
        vm.tableOptions = {};        
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            fetchBrandList();
        }

        function onReOrder() {
            fetchBrandList()
        }

        function onPaginate() {
            fetchBrandList()
        }

        function fetchBrandList(){
            vm.tableOptions.query.promise = true;
            vm.tableOptions.query.selected = [];
            $http
                .get(uriService.ENDPOINT.BRAND, {params: getFetchParams()})
                .then(handlerSuccessfetchBrandList)
                .catch(handlerErrorfetchBrandList)
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

        function handlerSuccessfetchBrandList({status, data}) {
            $log.info(["*** handlerSuccessfetchBrandList result: ", status, data]);
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchBrandList({status, data}) {
            $log.error(["*** handlerErrorfetchBrandList result: ", status, data]);
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let brandItem = vm.tableOptions.query.selected[0];
            brandService.showBrandDialog(targetEvent, brandItem._id.$oid, null)
                .then(
                    (updatedBrand)=>{
                        fetchBrandList()
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
                    fetchBrandList()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchbrandList()
        }

        function getFilterFields () {
            return [
                {slug: 'name', type: 'text', display: 'Marka Adı',  selected:true},
                {slug: 'description', type: 'text', display: 'Açıklama'},
                {slug: 'product', type: 'text', display: 'Ürün Cinsi'}
            ]
        }
    }
})(window.angular);