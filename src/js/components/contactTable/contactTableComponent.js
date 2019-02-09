/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 02 January 2018 12:00 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name contactTableComponent:contactTable
     * @restrict 'E'
     * @description
            contact
     * @example
        <contact-table></contact-table>
     */
    angular
        .module('contactTableComponent', ['contactTableController'])
        .component('contactTable', contactTable());

    function contactTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/contactTable/contactTable.html?v=${paths.version}`,
            controller: 'contactTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);