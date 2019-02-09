(function(angular){
    'use strict';

    const _requires = ['httpConfigOnRun', 'httpResponseService'];

    angular
        .module('httpConfig', _requires)
        .config(httpConfig);

    httpConfig.$inject = ['$httpProvider'];

    function httpConfig($httpProvider){
        $httpProvider.interceptors.push('responseService');
    }
})(window.angular);