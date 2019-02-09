(function (angular){
    'use strict';

    const _requires = [
        'ngStorage',
        'uriService'
    ];
    angular
        .module('authService', _requires)
        .factory('authService', authService);

    authService.$inject = [
        '$rootScope',
        '$localStorage',
        '$http',
        '$q',
        'uriService',
        '$window'
    ];

    function authService(
        $rootScope,
        $localStorage,
        $http,
        $q,
        uriService,
        $window
    ) {
        let _username;
        const TOKEN_KEY = 'liftnec-token';

        return {
            isAuthenticated,
            showLoginDialog,
            getAccessToken,
            handlerGetAccessToken,
            checkAndSetTokenToHeaders,
            clearTokenKeys,
        };

        /**
         * Check user is Authenticated
         * @returns {boolean}
         */
        function isAuthenticated () {
            let currentUser = typeof $rootScope.currentUser !== 'undefined';
            let token = typeof $localStorage[TOKEN_KEY] !== 'undefined';
            return currentUser && token
        }

        /**
         * We can show a login dialog when user token has been expired
         *
         * @description: Not implemented yet
         */
        function showLoginDialog () {
            // show Login dialog
        }

        /**
         * Request an access token from server with user credentials
         * @param {string} username
         * @param {string} password
         * @returns {promise}
         */
        function getAccessToken (username, password) {
            _username = username;
            let auth = $window.btoa(`${username}:${password}`);
            let headers = {'Authorization': `Basic ${auth}`};
            console.log(["*** getAccessToken", uriService.ENDPOINT.LOGIN, headers]);
            let deferred = $q.defer();
            $http
                .get(uriService.ENDPOINT.LOGIN, {headers})
                .then((response) => {deferred.resolve(handlerGetAccessToken(response))})
                .catch((response) => {deferred.reject(catchGetAccessToken(response))});
            return deferred.promise;
        }

        /**
         * Response handler of getAccessToken
         * @param {int} status
         * @param {object} data
         * @returns {object}
         */
        function handlerGetAccessToken ({status, data}) {
            data = data||{};
            if (status !== 201 && !data.attributes) {
                return catchGetAccessToken({status, data});
            }
            $rootScope.currentUser = data.attributes.user;
            delete $rootScope.currentUser.password;
            $localStorage.current_user_id = data.id;
            $localStorage.current_user = $rootScope.currentUser;
            $localStorage[TOKEN_KEY] = data.attributes[TOKEN_KEY];
            checkAndSetTokenToHeaders();
            return {status, data};
        }

        /**
         * Error handler of getAccessToken
         * @param {int} status
         * @param {object} data
         * @returns {object}
         */
        function catchGetAccessToken ({status, data}) {
            console.error(["*** getAccessToken occurred an exception", status, data]);
            return {status, data}
        }

        function checkAndSetTokenToHeaders () {
            let liftnec_token = $localStorage[TOKEN_KEY],
                current_user = $localStorage.current_user;
            if (liftnec_token) {
                $http.defaults.headers.common[TOKEN_KEY] = liftnec_token;
            }
            if (current_user) {
                $rootScope.currentUser = current_user;
            }
        }
        
        function clearTokenKeys () {
            console.log("*** clearTokenKeys freid");
            $rootScope.currentUser = undefined;
            $localStorage.$reset({current_user_id: undefined, current_user: undefined, [TOKEN_KEY]: undefined});
        }
    }
})(window.angular);