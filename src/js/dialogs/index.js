(function(angular){
    'use strict';
    const _requires = [
        'stockDialog',
        'accountDialog',
        'contactDialog',
        'brandDialog',
        'projectDialog',
        'fieldFilterDialog',
        'analysisCategoryDialog',
        'analysisItemDialog',
        'deleteAlertDialog',
    ];
    angular.module('appDialogs', _requires);
})(window.angular);