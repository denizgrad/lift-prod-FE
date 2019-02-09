(function(angular){
    'use strict';
    const requires = [
        'fieldFilterComponent',
        'loginFormComponent',
        'headerBarComponent',
        'sideBarMenuComponent',
        'stockTableComponent',
        'stockActionBulkJobComponent',
        'stockActionTableComponent',
        'accountTableComponent',
        'contactTableComponent',
        'brandTableComponent',
        'projectTableComponent',
        'analysisCategoryComponent',
        'analysisSettingsCardComponent',
        'analysisItemComponent',
        'deleteRecordButtonComponent',
        'stockTotalByCurrencyComponent',
        'categoryFormPartsComponent',
        'quoteTableComponent'
    ];
    angular.module('appComponents', requires)
})(window.angular);