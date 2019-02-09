(function (angular, paths){
    'use strict';
    angular
        .module('loginFormComponent', [])
        .component('loginForm', loginFormComponent());

    function loginFormComponent () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/loginForm/loginForm.html?v=${paths.version}`,
            controller: 'loginFormController',
            controllerAs: 'vm'
        }
    }

})(window.angular, window.paths);