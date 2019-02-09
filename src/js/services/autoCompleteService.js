(function (angular){
    'use strict';
    angular
        .module('autoCompleteService', [])
        .factory('autoCompleteService', autoCompleteService);

    autoCompleteService.$inject = ['$http'];

    function autoCompleteService($http) {

        return {
            getAutoCompleteOptions,
        };

        function getAutoCompleteOptions ({endPoint, onChange, prepareParams, searchLengthLimit}) {
            return {
                searchLengthLimit: searchLengthLimit !== undefined ? searchLengthLimit : 2,
                endPoint:endPoint,
                disable:false,
                no_cache:false,
                selected_item: '',
                search_text: '',
                onChange: onChange || function () {},
                prepareParams: prepareParams || _prepareParams,
                fetchRecords: fetchRecords
            };
        }
        function _prepareParams (searchString) {
            return {text_search: searchString};
            // return {
            //     '__raw__': {
            //         '$or': [
            //             {'name': {'$regex': searchString, '$options': 'i'}},
            //             {'stock_code': {'$regex': searchString, '$options': 'i'}},
            //         ]
            //     }
            // };
        }
        /**
         * Request text search for records
         * @param {string} Search api
         * @param {function} prepareParams: Prepare search params
         * @param {string} searchText: Search text
         * @returns Array
         */
        function fetchRecords ({endPoint, prepareParams, searchLengthLimit}, searchText) {
            if (!searchText || searchText.length <= searchLengthLimit) {
                return []
            }
            let params = prepareParams(searchText);
            return $http
                .get(endPoint, {params})
                .then(resolvedFetchStocks, rejectedFetchStocks)
        }
        /**
         * Resolver
         * @param response: {Response}
         */
        function resolvedFetchStocks (response) {
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
    }
})(window.angular);