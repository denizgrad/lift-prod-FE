(function (angular){
    'use strict';

    const _requires = [];

    angular
        .module('httpConfigOnRun', _requires)
        .run(httpConfigOnRun);

    httpConfigOnRun.$inject = ['authService', 'currencyService'];

    function httpConfigOnRun (authService, currencyService) {
        authService.checkAndSetTokenToHeaders();
        if (authService.isAuthenticated()) {
            currencyService.setCurrenciesToRootScope();
        }
    }
})(window.angular);
