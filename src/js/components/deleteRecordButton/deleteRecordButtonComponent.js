/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 13 January 2018 01:00 PM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc component
     * @name deleteRecordButtonComponent:deleteRecordButton
     * @restrict 'E'
     * @description
            Kayıt Sil
     * @example
        <delete-record-button endpoint="'REST_ENDPOINT'"
                              record-id="'HERE_RECORD_ID'">
        </delete-record-button>
     */
    angular
        .module('deleteRecordButtonComponent', ['deleteRecordButtonComponentController'])
        .component('deleteRecordButton', deleteRecordButton());

    function deleteRecordButton () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/deleteRecordButton/deleteRecordButton.html?v=${paths.version}`,
            controller: 'deleteRecordButtonComponentController',
            controllerAs: 'vm',
            bindings: {
                recordId: '=',
                callbackArgs: '=',
                endpoint: '<',
                callbackOnDelete: '<',
            }
        }
    }
})(window.angular, window.paths);