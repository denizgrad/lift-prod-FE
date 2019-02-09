(function (){
    'use strict';

    const _requires = [
        'ui.router.state.events',
        'authService'
    ];

    angular
        .module('routeConfigOnRun', _requires)
        .run(routeConfigOnRun);

    routeConfigOnRun.$inject = ['$rootScope', '$state', '$window', 'authService'];
    /**
     * Fires on routeConfig init
     * Watch state changes
     * @param {object} $rootScope: AngularJS global scope
     * @param {object} $state: ui.router state service
     * @param {object} $window: AngularJS document.window service
     * @param {object} authService: Liftnec Authentication service
     */
    function routeConfigOnRun ($rootScope, $state, $window, authService) {
        $rootScope.$state = $state;
        $rootScope.$on('$stateChangeStart', stateChangeStart);

        /**
         * Fires on before state changing
         *
         * @module: ui.router.state.events
         * @event: $stateChangeStart
         * @param {object} event
         * @param {object} toState
         * @param {object} toParams
         */
        function stateChangeStart (event, toState, toParams) {
            $window.manageLoadingView(true);
            let stateData = toState.data||{};
            let loginRequired = stateData.loginRequired;

            if ( loginRequired && ! authService.isAuthenticated() ) {
                event.preventDefault();
                // TODO:Hasan: Kurulum tamamlanınca. State değişme anında login dialog gösterilmesini sağlayalım
                return $state.go('login');
                // authService
                //     .getAccessToken('test_1@test_1.com', 'asd')
                //     .then((response)=>{
                //         $window.manageLoadingView(false);
                //         return $state.go(toState.name, toParams);
                //     }).catch((response)=>{
                //         $window.manageLoadingView(false);
                //         return $state.go('login');
                //     });
            } else {
                $window.manageLoadingView(false);
            }
        }
    }
})();
