(function (angular) {
    angular
        .module('currencyService', [])
        .factory('currencyService', currencyService);

    currencyService.$inject = ['$rootScope', '$http', 'uriService'];

    function currencyService ($rootScope, $http, uriService) {

        return {
            setCurrenciesToRootScope
        };
        
        function setCurrenciesToRootScope() {
            if (! $rootScope.currencies) {
                $http
                    .get(uriService.ENDPOINT.CURRENCY)
                    .then(resolvedSetCurrencies)
                    .catch(rejectedSetCurrencies)
            }
        }

        function resolvedSetCurrencies ({status, data}) {
            if (status !== 200 && status !== 201) {
                return rejectedSetCurrencies({status, data});
            }
            $rootScope.currencies = data.data;
            let meta = data.meta || {};
            if (meta.current_page !== meta.total_pages) {
                console.warn(["*** resolvedSetCurrencies", data])
            }
        }

        function rejectedSetCurrencies (errorResponse) {
            console.warn(errorResponse);
        }
    }
})(window.angular);