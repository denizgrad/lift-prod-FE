/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 02 January 2018 12:00 AM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      contactTableComponent:contactTable componentinin Controller modülüdür
     */
    angular
        .module('contactTableController', [])
        .controller('contactTableController', contactTableController);

    /**
     * Inject list of contactTableController
     * @type {string[]}
     */
    contactTableController.$inject = [
        '$http',
        'uriService',
        'tableService',
        'fieldFilterService',
        '$log',
        'contactService'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} tableService: Application table defaults service
     * @param {object} fieldFilterService: Dynamic Query Filter Dialog service
     * @param {object} $log: Log service
     * @param {object} contactService: contact Module service
     */
    function contactTableController(
        $http, uriService, tableService, fieldFilterService, $log, contactService
    ) {
        const includes = '_key_created_user,_key_account';
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchContactList = fetchTableRecords;
        vm.onReOrder = onReOrder;
        vm.onPaginate = onPaginate;
        vm.addNewFilter = addNewFilter;
        vm.onSelectedFiltersChanged = fetchTableRecords;
        vm.removeFilterByIndex = removeFilterByIndex;
        vm.updateRecord = updateRecord;
        vm.getFilterFields = getFilterFields;
        vm.tableOptions = {};        
        vm.selectedFilters = [];

        function onInit(){
            vm.tableOptions = tableService.getTableDefaults();
            fetchTableRecords();
        }

        function onReOrder() {
            fetchTableRecords()
        }

        function onPaginate() {
            fetchTableRecords()
        }

        function fetchTableRecords(){
            vm.tableOptions.query.selected = [];
            vm.tableOptions.query.promise = true;
            $http
                .get(uriService.ENDPOINT.CONTACT, {params: getFetchParams()})
                .then(handlerSuccessfetchTableRecords)
                .catch(handlerErrorfetchTableRecords)
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

        function handlerSuccessfetchTableRecords({status, data}) {
            vm.tableOptions.query.promise = false;
            if (status === 200) {
                vm.tableOptions.query.data = data.data;
                vm.tableOptions.query.total = data.meta.total_count;
            }
        }

        function handlerErrorfetchTableRecords({status, data}) {
            vm.tableOptions.query.promise = false;
        }

        function updateRecord(targetEvent) {
            let recordItem = vm.tableOptions.query.selected[0];
            contactService.showContactDialog(targetEvent, recordItem._id.$oid, null)
                .then(
                    (updatedAccount)=>{
                        fetchTableRecords()
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
                    fetchTableRecords()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fetchTableRecords()
        }

        function getFilterFields () {
            return [
                {slug: 'code', type: 'text', display: 'Kodu'},
                {slug: 'name', type: 'text', display: 'Adı'},
                {slug: 'surname', type: 'text', display: 'Soyadı'},
                {slug: 'full_name', type: 'text', display: 'Tam Adı',  selected:true},
            ]
        }
    }
})(window.angular);