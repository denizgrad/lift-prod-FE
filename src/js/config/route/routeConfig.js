(function (angular, paths){
    'use strict';

    const _requires = [
        'ui.router',
        'ui.router.state.events',
        'routeConfigOnRun'
    ];
    angular
        .module('routeConfig', _requires)
        .config(routeConfig);

    // Set routeConfig $injects
    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    /**
     * @config App Route Config
     * @description: Application handles routes by ui.router
     */
    function routeConfig ($stateProvider, $urlRouterProvider, $locationProvider) {
        // ==== Application State List ====
        const
            TEMPLATE_PATH = paths.PAGES_PATH,
            TEMPLATE_VERSION = paths.version,
            STATES = [
                {
                    name: 'login',
                    url: '/login',
                    templateUrl: `${TEMPLATE_PATH}/login.html?v=${TEMPLATE_VERSION}`,
                    controller: 'loginPageController',
                    controllerAs: 'vm',
                    data: { loginRequired: false}
                },
                {
                    name: 'app',
                    templateUrl: `${TEMPLATE_PATH}/app.layout.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    data: { loginRequired: true }
                },
                {
                    name: 'app.home',
                    url: '/home',
                    templateUrl: `${TEMPLATE_PATH}/app/home.html?v=${TEMPLATE_VERSION}`
                },
                {
                    name: 'app.stock',
                    templateUrl: `${TEMPLATE_PATH}/app/stock.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    controller: 'stockPageController',
                    controllerAs: 'vm',
                },
                {
                    name: 'app.stock.list',
                    url: '/stok',
                    component: 'stockTable',
                },
                {
                    name: 'app.stock.actionlist',
                    url: '/stok-hareketleri',
                    component: 'stockActionTable',
                },
                {
                    name: 'app.stock.bulkaction',
                    url: '/stok-toplu-islem',
                    component: 'stockActionBulkJob',
                },
                {
                    name: 'app.account',
                    templateUrl: `${TEMPLATE_PATH}/app/account.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    controller: 'accountPageController',
                    controllerAs: 'vm',
                },
                {
                    name: 'app.account.list',
                    url: '/account',
                    component: 'accountTable',
                },
                {
                    name: 'app.contact',
                    templateUrl: `${TEMPLATE_PATH}/app/contact.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    controller: 'contactPageController',
                    controllerAs: 'vm',
                },
                {
                    name: 'app.contact.list',
                    url: '/contact',
                    component: 'contactTable',
                },
                {
                    name: 'app.brand',
                    templateUrl: `${TEMPLATE_PATH}/app/brand.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    controller: 'brandPageController',
                    controllerAs: 'vm',
                },
                {
                    name: 'app.brand.list',
                    url: '/brand',
                    component: 'brandTable',
                }
                ,{
                    name: 'app.project',
                    templateUrl: `${TEMPLATE_PATH}/app/project.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    controller: 'projectPageController',
                    controllerAs: 'vm',
                },
                {
                    name: 'app.project.list',
                    url: '/project',
                    component: 'projectTable',
                }
                ,
                {
                    name: 'app.project.quoteList',
                    url: '/teklif',
                    component: 'quoteTable',
                }
                ,
                {
                    name: 'app.analysis',
                    templateUrl: `${TEMPLATE_PATH}/app/analysis.html?v=${TEMPLATE_VERSION}`,
                    abstract: true,
                    controller: 'analysisPageController',
                    controllerAs: 'vm',
                },
                {
                    name: 'app.analysis.list',
                    url: '/analiz-kalemleri',
                    component: 'analysisCategoryTable',
                },
                {
                    name: 'app.analysis.itemList',
                    url: '/analiz-kalem-tipleri',
                    component: 'analysisItemTable',
                },
                {
                    name: 'app.analysis_settings',
                    url: '/analiz-tanimlamalari',
                    templateUrl: `${TEMPLATE_PATH}/app/analysis_settings.html?v=${TEMPLATE_VERSION}`,
                    controller: 'analysisSettingsPageController',
                    controllerAs: 'vm',
                },
            ];
        /**
         * Liftnec uses html5mode for SPA
         *  If html5Mode is false => {domain}/#!/page
         *  If html5Mode is true  => {domain}/page
         */
        $locationProvider.html5Mode(true);
        // Set default url
        // https://github.com/angular-ui/ui-router/issues/2183#issuecomment-149261238
        $urlRouterProvider.otherwise(function($injector){
            let $state = $injector.get("$state");
            $state.go('app.stock.list');
        });
        // Register Application States
        angular.forEach(STATES, (_state) => {
            $stateProvider.state(_state.name, _state)
        })
    }
})(window.angular, window.paths);
