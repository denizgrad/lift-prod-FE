/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 27 January 2019 11:00 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name analysisSettingsCardComponent:analysisSettingsCard
     * @restrict 'E'
     * @description
            Analiz özellik veri listesi kartı
     * @example
        <analysis-settings-card></analysis-settings-card>
     */
    angular
        .module('analysisSettingsCardComponent', ['analysisSettingsCardController'])
        .component('analysisSettingsCard', analysisSettingsCard());

    function analysisSettingsCard () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/analysisSettingsCard/analysisSettingsCard.html?v=${paths.version}`,
            controller: 'analysisSettingsCardController',
            controllerAs: 'vm',
            bindings: {
                settingsKey: '<',
                deleteCallback: '<',
                updateCallback: '<',
                createCallback: '<',
            }
        }
    }
})(window.angular, window.paths);