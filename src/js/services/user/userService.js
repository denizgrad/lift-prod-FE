(function (angular){
    'use strict';

    const _requires = [
        'uriService',
    ];

    angular
        .module('userService', _requires)
        .factory('userService', userService);

    userService.$inject = ['$state', 'authService'];

    function userService($state, authService) {
        let _username;

        return {
            logOut
        };

        function logOut () {
            authService.clearTokenKeys();
            $state.go('login')
        }
    }
})(window.angular);