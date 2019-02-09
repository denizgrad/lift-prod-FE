/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      projectTableComponent:projectTable componentinin Controller modülüdür
     */
    angular
        .module('projectTableController', [])
        .controller('projectTableController', projectTableController);

    /**
     * Inject list of projectTableController
     * @type {string[]}
     */
    projectTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log',
        'projectService'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} fieldFilterService: Dynamic Query Filter Dialog service
     * @param {object} $log: Log service
     * @param {object} projectService: project Module service
     */
    function projectTableController(
        $http, uriService, tableService, fieldFilterService, $log, projectService
    ) {
        let vm = this;
        const includes = '_key_account_owner,_key_account_contractor,_key_currency_amount,_key_currency_lift_total';
        vm.$onInit = onInit;
        vm.fetchProjectList = fetchProjectList;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.updateRecord = updateRecord;
        vm.getFilterFields = getFilterFields;
        vm.endpoint = uriService.ENDPOINT.PROJECT;
        vm.tableOptions = {};        
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            fetchProjectList();
        }

        function onReOrder() {
            fetchProjectList()
        }

        function onPaginate() {
            fetchProjectList()
        }

        function fetchProjectList(){
            vm.tableOptions.query.promise = true;
            vm.tableOptions.query.selected = [];
            $http
                .get(uriService.ENDPOINT.PROJECT, {params: getFetchParams()})
                .then(handlerSuccessfetchProjectList)
                .catch(handlerErrorfetchProjectList)
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

        function handlerSuccessfetchProjectList({status, data}) {
            $log.info(["*** handlerSuccessfetchProjectList result: ", status, data]);
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchProjectList({status, data}) {
            $log.error(["*** handlerErrorfetchProjectList result: ", status, data]);
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let projectItem = vm.tableOptions.query.selected[0];
            projectService.showProjectDialog(targetEvent, projectItem._id.$oid, null)
                .then(
                    (updatedProject)=>{
                        fetchProjectList()
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
                    fetchProjectList()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchProjectList()
        }

        function getFilterFields () {
            return [
                {slug: 'name', type: 'text', display: 'Proje Adı',  selected:true},
            ]
        }
    }
})(window.angular);