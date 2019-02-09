/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      analysisCategoryComponent:analysisCategory componentinin Controller modülüdür
     */
    angular
        .module('analysisCategoryController', [])
        .controller('analysisCategoryController', analysisCategoryController);

    /**
     * Inject list of analysisCategoryController
     * @type {string[]}
     */
    analysisCategoryController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'analysisService',
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} analysisService: Analysis Module service
     */
    function analysisCategoryController(
        $http, uriService, tableService, analysisService
    ) {
        const includes = '_key_created_user';
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchTableData = fetchTableData;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = function () {};  // from field-filter-component
        vm.onSelectedFiltersChanged = fetchTableData;
        vm.updateRecord = updateRecord;
        vm.getFilterFields = getFilterFields;
        vm.endpoint = uriService.ENDPOINT.ANALYSIS_CATEGORY;
        vm.tableOptions = {};        
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            fetchTableData();
        }

        function onReOrder() {
            fetchTableData()
        }

        function onPaginate() {
            fetchTableData()
        }

        function fetchTableData(){
            vm.tableOptions.query.selected = [];
            vm.tableOptions.query.promise = true;
            $http
                .get(uriService.ENDPOINT.ANALYSIS_CATEGORY, {params: getFetchParams()})
                .then(handlerSuccessfetchTableData)
                .catch(handlerErrorfetchTableData)
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

        function handlerSuccessfetchTableData({status, data}) {
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchTableData({status, data}) {
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let selectedItem = vm.tableOptions.query.selected[0];
            analysisService.showAnalysisCategoryDialog(targetEvent, selectedItem._id.$oid, null)
                .then(
                    (record)=>{
                        fetchTableData()
                    },
                    (errorResponse)=>{})
        }

        function getFilterFields () {
            return [
                {slug: 'name', type: 'text', display: 'Kategori Adı',  selected:true}
            ]
        }
    }
})(window.angular);