(function(angular){
    'use strict';
    const _requires = [
        'ngAnimate',
        'ngSanitize',
        'ngMessages',
        'ngStorage',
        'md.data.table',
    ];
    angular
        .module('coreConfig', _requires)
        .config(coreConfig);

    coreConfig.$inject = ['$interpolateProvider'];

    function coreConfig($interpolateProvider){
        // Change angular start/end symbol from {{ }} to [[ ]]
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    }

})(window.angular);