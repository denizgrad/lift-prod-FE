(function (angular, paths){
    'use strict';
    angular
        .module('sideBarMenuComponent', [])
        .component('sideBarMenu', sideBarMenuComponent());

    function sideBarMenuComponent () {
        return {
            templateUrl: `${paths.COMPONENTS_PATH}/sideBarMenu/sideBarMenu.html?v=${paths.version}`,
        }
    }

})(window.angular, window.paths);