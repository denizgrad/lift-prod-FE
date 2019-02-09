/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 19 December 2018 10:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name quoteTableComponent:quoteTable
     * @restrict 'E'
     * @description
            quote
     * @example
        <quote-table></quote-table>
     */
    angular
        .module('quoteTableComponent', ['quoteTableController'])
        .component('quoteTable', quoteTable());

    function quoteTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/quoteTable/quoteTable.html?v=${paths.version}`,
            controller: 'quoteTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);