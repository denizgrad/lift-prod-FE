/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 18 January 2018 02:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name stockTotalByCurrencyComponent:stockTotalByCurrency
     * @restrict 'E'
     * @description
            Stok toplamlarını göster
     * @example
        <stock-total-by-currency></stock-total-by-currency>
     */
    angular
        .module('stockTotalByCurrencyComponent', ['stockTotalByCurrencyController'])
        .component('stockTotalByCurrency', stockTotalByCurrency());

    function stockTotalByCurrency () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/stockTotalByCurrency/stockTotalByCurrency.html?v=${paths.version}`,
            controller: 'stockTotalByCurrencyController',
            controllerAs: 'vm',
        }
    }
})(window.angular, window.paths);