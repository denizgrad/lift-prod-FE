/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 30 January 2019 01:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name categoryFormPartsComponent:categoryFormParts
     * @restrict 'E'
     * @description
            MachineEngine settings component
                The component contains select-box elements
     * @example
            <category-form-parts category-key="'door'" form-scope="YOUR_FORM_REFERENCE"></category-form-parts>
     */
    angular
        .module('categoryFormPartsComponent', ['categoryFormPartsController'])
        .component('categoryFormParts', categoryFormParts());

    function categoryFormParts () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/analiysisCategorySettings/categoryFormParts.html?v=${paths.version}`,
            controller: 'categoryFormPartsController',
            controllerAs: 'vm',
            bindings: {
                dictScope: '=',
                formScope: '<',
                categoryKey: '<'
            }
        }
    }
})(window.angular, window.paths);