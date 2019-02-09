/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 19 December 2018 10:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name stockTableComponent:stockTable
     * @restrict 'E'
     * @description
     *      Hammedde & Yarı Mamül tablosu
     * @example
        <stock-table></stock-table>
     */
    angular
        .module('stockTableComponent', ['stockTableController'])
        .component('stockTable', stockTable());

    function stockTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/stockTable/stockTable.html?v=${paths.version}`,
            controller: 'stockTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);