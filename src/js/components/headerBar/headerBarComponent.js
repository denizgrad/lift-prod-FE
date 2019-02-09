(function (angular, paths){
    'use strict';
    angular
        .module('headerBarComponent', [])
        .component('headerBar', headerBarComponent());

    function headerBarComponent () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/headerBar/headerBar.html?v=${paths.version}`,
            controller: 'headerBarController',
            controllerAs: 'vm'
        }
    }
})(window.angular, window.paths);