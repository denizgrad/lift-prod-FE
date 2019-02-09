(function (angular) {
    angular
        .module('uriService', [])
        .factory('uriService', uriService);

    uriService.$inject = ['$window'];

    function uriService ($window) {
        const
            API_V1 = 'api/v1',
            BASEURL = `${$window.location.protocol}//${$window.location.hostname}:8080`,
            REST_API_V1 = `${BASEURL}/${API_V1}`,
            ENDPOINT = {
                LOGIN: `${BASEURL}/login`,
                REPORT: `${REST_API_V1}/reports`,
                STOCK: `${REST_API_V1}/stock`,
                STOCK_ACTION: `${REST_API_V1}/stock-action`,
                CURRENCY: `${REST_API_V1}/currency`,
                ACCOUNT: `${REST_API_V1}/account`,
                CONTACT: `${REST_API_V1}/contact`,
                BRAND: `${REST_API_V1}/brand`,
                ANALYSIS_CATEGORY: `${REST_API_V1}/analysis-category`,
                ANALYSIS_CATEGORY_ITEM: `${REST_API_V1}/analysis-item`,
                ANALYSIS_CATEGORY_SETTINGS: `${REST_API_V1}/analysis-settings`,
                PROJECT:`${REST_API_V1}/project`,
                QUOTE:`${REST_API_V1}/quote`,
            };

        // Return accessible service vars
        return {
            BASEURL,
            ENDPOINT
        }
    }
})(window.angular);