(function(angular){
    'use strict';
    const _requires = [
        'loginPageController',
        'stockPageController',
        'accountPageController',
        'brandPageController',
        'projectPageController',
        'analysisPageController',
        'contactPageController',
        'analysisSettingsPageController'
    ];
    angular.module('appControllers', _requires);
})(window.angular);