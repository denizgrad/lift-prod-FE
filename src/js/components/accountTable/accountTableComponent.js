/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 19 December 2018 10:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name accountTableComponent:accountTable
     * @restrict 'E'
     * @description
            account
     * @example
        <account-table></account-table>
     */
    angular
        .module('accountTableComponent', ['accountTableController'])
        .component('accountTable', accountTable());

    function accountTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/accountTable/accountTable.html?v=${paths.version}`,
            controller: 'accountTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);