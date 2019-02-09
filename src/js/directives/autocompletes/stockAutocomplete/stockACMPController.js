/**
 * @created_by: Hasan BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 20 December 2018 16:45 AM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      stockAutocompleteDirective:stockAutoComplete direktifinin Controller modülüdür
     */
    angular
        .module('stockAutocompleteController', [])
        .controller('stockAutoCompleteController', stockAutoCompleteController);

    /**
     * Inject list of stockAutoCompleteController
     * @type {string[]}
     */
    stockAutoCompleteController.$inject = ['$scope', '$http', 'uriService'];

    /**
     * @ngdoc controller
     * @param {object} $scope: AngularJS isolated scope for controllers
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: {service} Service of company module.
     */
    function stockAutoCompleteController($scope, $http, uriService) {
        // Autocomplate seçimi yapıldığında çalıştırılacak method
        const DIRECTIVE_SCOPE = angular.copy({
            modelKey: $scope.modelKey,
            selectedModel: $scope.selectedModel,
            itemOnChange: $scope.itemChange,
            placheholder: $scope.placheholder
        });
        // Autocomplate özellikleri
        const ACMP_SETTINGS = {
            disable:false,
            no_cache:false,
            selected_item: '',
            search_text: '',
            onChange: onSelectedItemChange
        };
        // set controller instance to "vm" which will use as controller in template
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchStocks = fetchStocks;
        vm.acmpSettings = ACMP_SETTINGS;
        vm.directiveScope = DIRECTIVE_SCOPE;

        function onInit () {
            console.log(["***stockAutoCompleteController vm", vm]);
        }
        /**
         * Request text search for stock records
         * @param searchString: {String} Search string
         * @returns Array
         */
        function fetchStocks (searchString) {
            if (!searchString || searchString.length <=2) {
                return []
            }
            // const params = {query: {'barcode': { '$regex': searchString }} };
            const params = {text_search: searchString};
            return $http
                .get(uriService.ENDPOINT.STOCK, {params: params})
                .then(resolvedFetchStocks, rejectedFetchStocks)
        }
        /**
         * Paraşüt cari sorgulamasının response handler methodu
         * @param response: {Response}
         */
        function resolvedFetchStocks (response) {
            console.log(["*** resolvedFetchStocks", response]);
            if (response.status === 200) {
                return response.data.data;
            } else {
                return [];
            }
        }

        function rejectedFetchStocks (errorResponse) {
            console.warn(["*** stockAutoCompleteController.fetchStocks rejected", errorResponse]);
            return []
        }

        function onSelectedItemChange (selectedItem) {
            if (! selectedItem) {
                return null
            }
            try{
                if (vm.directiveScope.modelKey) {
                    vm.directiveScope.selectedModel[vm.directiveScope.modelKey] = selectedItem;
                }
                vm.directiveScope.itemOnChange({selectedItem, selectedModel: vm.directiveScope.selectedModel});
            } catch (e) {
                // console.warn("*** call user function failed: vm.itemOnChange(selectedItem)");
                // console.error(e)
            }
        }
    }
})(window.angular);