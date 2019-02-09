/**
 * @created_by: Hasan BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 20 December 2018 16:45 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc directive
     * @name stockAutocompleteDirective:stockAutocomplete
     * @restrict 'E'
     * @description
     *      Autocomplete for stock records
     * @example
        <stock-autocomplete item-change='USER_FUNCTION'></stock-autocomplete>
     */
    angular
        .module('stockAutocompleteDirective', ['stockAutocompleteController'])
        .directive('stockAutocomplete', stockAutocomplete);

    stockAutocomplete.$inject = [];
    /**
     * stockAutocomplete Directive Service
     */
    function stockAutocomplete(){
        return {
            // @param restrict | directive type as 'E' meaning 'Element'.
            restrict: 'E',
            templateUrl: `${paths.DIRECTIVES_PATH}/autocompletes/stockAutocomplete/stockACMP.html?v=${paths.version}`,
            controller: 'stockAutoCompleteController',
            controllerAs: 'vm',
            scope: {
                modelKey: '=',
                selectedModel: '=',
                itemChange: '=',
                placeholder: '='
            },
        }
    }
})(window.angular, window.paths);