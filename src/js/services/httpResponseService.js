(function (angular){
    'use strict';
    angular
        .module('httpResponseService', [])
        .factory('responseService', responseService);

    responseService.$inject = ['$timeout', '$injector'];

    function responseService($timeout, $injector) {
        let authService, $http, $state, $mdDialog;
        // this trick must be done so that we don't receive
        // `Uncaught Error: [$injector:cdep] Circular dependency found`
        $timeout(function () {
            authService = $injector.get('authService');
            $http = $injector.get('$http');
            $state = $injector.get('$state');
            $mdDialog = $injector.get('$mdDialog');
        });

        return {
            responseError,
        };

        function responseError (rejection) {
            if (rejection.status !== 401) {
                return rejection;
            }
            $mdDialog.cancel();
            authService.clearTokenKeys();
            // TODO:Hasan: Kurulum tamamlanınca. State değişme anında login dialog gösterilmesini sağlayalım
            $state.go('login');
        }
    }
})(window.angular);