(function (angular, paths) {
    angular
        .module('analysisSettingsService', [])
        .factory('analysisSettingsService', analysisSettingsService);

    analysisSettingsService.$inject = [
        '$q',
        '$http',
        'uriService',
        'enumService',
        'httpErrorResponseService',
    ];

    function analysisSettingsService (
        $q,
        $http,
        uriService,
        enumService,
        httpErrorResponseService,
    ) {

        // Return accessible service vars
        return {
            fetchSettingsByParams: fetchSettingsByParams,
            handleRejectedFetchResponse: handleRejectedFetchResponse,
            handleRejectedCreateResponse: handleRejectedCreateResponse,
            handleRejectedUpdateResponse: handleRejectedUpdateResponse,
            handleRejectedDeleteResponse: handleRejectedDeleteResponse
        };

        function fetchSettingsByParams (params) {
            let defer = $q.defer();
            $http
                .get(uriService.ENDPOINT.ANALYSIS_CATEGORY_SETTINGS, {params})
                .then((response)=>{
                    console.log(["*** response", response]);
                    if (response.status === 200) {
                        defer.resolve(response.data);
                    } else {
                        defer.reject(handleRejectedFetchResponse(response))
                    }
                })
                .catch((errorResponse)=>{
                    defer.reject(handleRejectedFetchResponse(errorResponse))
                });
            return defer.promise;
        }

        function handleRejectedFetchResponse (response) {
            let preparedError = httpErrorResponseService.handleRejectedCreateResponse(response);
            if (Object.values(enumService.ERRORS).indexOf(preparedError.message) === -1) {
                return preparedError
            }
            return {
                message: 'Yeni Tanımlama Oluşturulamadı',
                detail: preparedError.detail
            }
        }

        function handleRejectedCreateResponse (response) {
            let preparedError = httpErrorResponseService.handleRejectedCreateResponse(response);
            if (Object.values(enumService.ERRORS).indexOf(preparedError.message) === -1) {
                return preparedError
            }
            return {
                message: 'Yeni Tanımlama Oluşturulamadı',
                detail: preparedError.detail
            }
        }

        function handleRejectedUpdateResponse (response) {
            let preparedError = httpErrorResponseService.handleRejectedUpdateResponse(response);
            if (Object.values(enumService.ERRORS).indexOf(preparedError.message) === -1) {
                return preparedError
            }
            return {
                message: 'Güncelleme İşlemi Reddedildi',
                detail: preparedError.detail
            }
        }

        function handleRejectedDeleteResponse (response) {
            let preparedError = httpErrorResponseService.handleRejectedDeleteResponse(response);
            if (Object.values(enumService.ERRORS).indexOf(preparedError.message) === -1) {
                return preparedError
            }
            return {
                message: 'Silme İşlemi Reddedildi',
                detail: preparedError.detail
            }
        }

    }
})(window.angular, window.paths);