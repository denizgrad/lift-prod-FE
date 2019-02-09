(function (angular){
    'use strict';
    angular
        .module('headerBarComponent')
        .controller('headerBarController', headerBarController);

    headerBarController.$inject = [
        '$rootScope',
        '$mdMedia',
        '$mdSidenav',
        'userService'
    ];

    function headerBarController (
        $rootScope,
        $mdMedia,
        $mdSidenav,
        userService
    ){        
        let vm = this;
        vm.$onInit = onInit;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleFullScreen = toggleFullScreen;
        vm.logOut = userService.logOut;
        vm.fullscreenEnabled = false;
        vm.notifications = [];
        
        function onInit (){
            $rootScope.lockLeft = false;
            vm.current_user = $rootScope.currentUser;
        }
        
        function toggleSidenav (menuId) {
            if(menuId === 'leftStatic'){
                $rootScope.lockLeft = !$rootScope.lockLeft;
            }
            $mdSidenav(menuId).toggle();
        }
        /**
         * Çağırıldığı zaman sayfayı tam ekran yapar veya tam ekrandan çıkar
         */
        function toggleFullScreen (elementId=false){
            let elem = elementId 
                ? document.getElementById(elementId) 
                : document.documentElement;
            if (!document.fullscreenElement && !document.mozFullScreenElement &&
                !document.webkitFullscreenElement && !document.msFullscreenElement) {
                vm.fullscreenEnabled = true;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }else{
                    // Eğer tam ekran kullanma özelliği kullanamıyorsa bilgilendirme yap
                    vm.fullscreenEnabled = false;
                    httpFact.fireToastr(
                        "info",
                        "Tam Ekran Kullanılamıyor",
                        "Tarayıcınız bu özelliği desteklemiyor ya da izin vermiyor."
                    );
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                vm.fullscreenEnabled = false;
            }
        }
    }
})(window.angular);