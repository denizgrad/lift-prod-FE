/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 19 December 2018 10:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name projectTableComponent:projectTable
     * @restrict 'E'
     * @description
            project
     * @example
        <project-table></project-table>
     */
    angular
        .module('projectTableComponent', ['projectTableController'])
        .component('projectTable', projectTable());

    function projectTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/projectTable/projectTable.html?v=${paths.version}`,
            controller: 'projectTableController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);