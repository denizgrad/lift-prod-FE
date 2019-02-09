/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 18 January 2018 02:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      stockTotalByCurrencyComponent:stockTotalByCurrency componentinin Controller modülüdür
     */
    angular
        .module('stockTotalByCurrencyController', [])
        .controller('stockTotalByCurrencyController', stockTotalByCurrencyController);

    /**
     * Inject list of stockTotalByCurrencyController
     * @type {string[]}
     */
    stockTotalByCurrencyController.$inject = [
        '$rootScope',
        '$http',
        'uriService',
        'enumService',
    ];

    function stockTotalByCurrencyController(
        $rootScope,
        $http,
        uriService,
        enumService
    ) {
        const PATH = `${uriService.ENDPOINT.REPORT}/get_stock_totals`;
        let vm = this;
        vm.$onInit = onInit;
        vm.fetchTotals = fetchTotals;
        vm.flexGtXs = 100;
        vm.flexGtXsClass = 'flex-gt-xs-100';
        vm.resutls = [];

        function onInit () {
            fetchTotals();
        }

        function fetchTotals () {
            vm.resutls = [];
            $http
                .get(PATH)
                .then((response)=>{
                    if (response.status===200) {
                        response.data.data.map((o)=>{
                            try {
                                o.included['currency']['symbol'] = enumService.CURRENCY[o.included['currency']['code']].symbol;
                                o.total_price = $rootScope.formatCurrency(o.total_price, o.included['currency']['code']);
                            }catch (e) {}
                            vm.resutls.push(o);
                        });
                        vm.flexGtXs = vm.resutls.length >= 4
                                        ? 25
                                        : vm.resutls.length === 3
                                            ? 33
                                            : vm.resutls.length === 2
                                                ? 50
                                                : 100;
                        vm.flexGtXsClass = `flex-gt-xs-${vm.flexGtXs}`;
                    }
                })
        }


    }
})(window.angular);