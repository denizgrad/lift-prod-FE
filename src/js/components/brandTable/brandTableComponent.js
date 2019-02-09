/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 19 December 2018 10:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name brandTableComponent:brandTable
     * @restrict 'E'
     * @description
            brand
     * @example
        <brand-table></brand-table>
     */
    angular
        .module('brandTableComponent', ['brandTableController'])
        .component('brandTable', brandTable());

    function brandTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/brandTable/brandTable.html?v=${paths.version}`,
            controller: 'brandTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);