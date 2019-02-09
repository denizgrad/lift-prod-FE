(function (angular){
    'use strict';
    angular
        .module('loginFormComponent')
        .controller('loginFormController', loginFormController);

    loginFormController.$inject = ['authService', '$state'];

    function loginFormController (authService, $state){
        const
            FORM_PARAMS = {
                email: '',
                password: '',
            },
            ERROR = {
                hasError: false,
                message: '',
                detail: '',
                status: 200,
            };
        let vm = this;
        vm.$onInit = onInit;
        vm.tryLogin = tryLogin;
        vm.formParams = FORM_PARAMS;
        vm.loginError = ERROR;
        vm.rememberMe = false;
        vm.loginPromise = false;
        vm.showPass = false;

        function onInit (){}

        function tryLogin () {
            vm.loginError.hasError = false;
            vm.loginPromise = true;
            authService
                .getAccessToken(vm.formParams.email, vm.formParams.password)
                .then(resolvedLoginResponse, rejectedLoginResponse)
        }

        function resolvedLoginResponse ({status, data}) {
            vm.loginPromise = false;
            if (status === 201) {
                $state.go('app.stock.list');
            } else {
                rejectedLoginResponse({status, data});
            }
        }

        function rejectedLoginResponse ({status, data}) {
            console.log(["*** tryLogin response", {status, data}]);
            data = data||{};
            vm.loginPromise = false;
            if (data['error']) {
                vm.loginError.detail = data['error']['detail'];
                vm.loginError.message = data['error']['message'];
            } else {
                vm.loginError.detail = 'Beklenmeyen bir hata oluştu!';
                vm.loginError.message = 'INTERNAL_SERVER_ERROR';
            }
            vm.loginError.status = status;
            vm.loginError.hasError = true;
        }
    }
})(window.angular);