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
        .module('analysisCategoryComponent', ['analysisCategoryController', 'fieldFilterComponent'])
        .component('analysisCategoryTable', analysisCategoryTable());

    function analysisCategoryTable () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/analysisCategoryTable/analysisCategoryTable.html?v=${paths.version}`,
            controller: 'analysisCategoryController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);