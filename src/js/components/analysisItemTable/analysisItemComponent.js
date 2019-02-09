/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 28 December 2018 10:00 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name analysisItemComponent:analysisItem
     * @restrict 'E'
     * @description
            Analiz Kategoriler Tablosu
     * @example
        <analysis-category-table></analysis-category-table>
     */
    angular
        .module('analysisItemComponent', ['analysisItemController', 'fieldFilterComponent'])
        .component('analysisItemTable', analysisItemTable());

    function analysisItemTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/analysisItemTable/analysisItemTable.html?v=${paths.version}`,
            controller: 'analysisItemController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);