(function(angular){
    'use strict';
    const _requires = [
        'httpErrorResponseService',
        'uriService',
        'authService',
        'userService',
        'httpResponseService',
        'enumService',
        'stockService',
        'stockActionService',
        'currencyService',
        'tableService',
        'autoCompleteService',
        'accountService',
        'contactService',
        'brandService',
        'projectService',
        'analysisService',
        'analysisSettingsService',
    ];
    angular.module('appServices', _requires)
})(window.angular);