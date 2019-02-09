(function (angular) {
    angular
        .module('httpErrorResponseService', [])
        .factory('httpErrorResponseService', httpErrorResponseService);

    httpErrorResponseService.$inject = [];

    function httpErrorResponseService () {

        // Return accessible service vars
        return {
            handleRejectedFetchResponse: handleRejectedFetchResponse,
            handleRejectedCreateResponse: handleRejectedCreateResponse,
            handleRejectedUpdateResponse: handleRejectedUpdateResponse,
            handleRejectedDeleteResponse: handleRejectedDeleteResponse
        };

        function errorHandler (response) {
            let message = 'Üzgünüz!',
                detail = 'Beklenmeyen bir hata oluştu';
            if (response.data.error && response.data.error.message) {
                message = response.data.error.message;
                detail = response.data.error.detail;
            }
            return {
                message: message,
                detail: detail
            }
        }

        function handleRejectedFetchResponse (response) {
            return errorHandler(response);
        }

        function handleRejectedCreateResponse (response) {
            return errorHandler(response);
        }

        function handleRejectedUpdateResponse (response) {
            return errorHandler(response);
        }

        function handleRejectedDeleteResponse (response) {
            return errorHandler(response);
        }

    }
})(window.angular);