/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 21 December 2018 15:00 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name stockActionTableComponent:stockActionTable
     * @restrict 'E'
     * @description
     *      Hammedde & Yarı Mamül tablosu giriş çıkış kayıtları
     * @example
        <stock-action-table></stock-action-table>
     */
    angular
        .module('stockActionTableComponent', ['stockActionTableController'])
        .component('stockActionTable', stockActionTable());

    function stockActionTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/stockActionTable/stockActionTable.html?v=${paths.version}`,
            controller: 'stockActionTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);