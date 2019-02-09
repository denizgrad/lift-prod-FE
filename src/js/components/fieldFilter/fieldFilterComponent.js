/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 28 December 2018 10:00 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name analysisCategoryComponent:analysisCategory
     * @restrict 'E'
     * @description
            Analiz Kategoriler Tablosu
     * @example
        <analysis-category-table></analysis-category-table>
     */
    angular
        .module('fieldFilterComponent', ['fieldFilterComponentController'])
        .component('fieldFilter', fieldFilter());

    function fieldFilter () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/fieldFilter/fieldFilter.html?v=${paths.version}`,
            controller: 'fieldFilterComponentController',
            controllerAs: 'vm',
            bindings: {
                getFilterFields: '=',
                selectedFilters: '=',
                onListChanged: '<',
                parentController: '='
            }
        }
    }
})(window.angular, window.paths);