/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 20 December 2018 10:00 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name stockActionBulkJobComponent:stockActionBulkJob
     * @restrict 'E'
     * @description
     *      Stok listesi için
     * @example
        <stock-table></stock-table>
     */
    angular
        .module('stockActionBulkJobComponent', ['stockActionBulkJobController'])
        .component('stockActionBulkJob', stockActionBulkJob());

    function stockActionBulkJob () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/stockActionBulkJob/stockActionBulkJob.html?v=${paths.version}`,
            controller: 'stockActionBulkJobController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);