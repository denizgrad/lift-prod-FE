(function(angular){
    'use strict';
    const _requires = [
        'toastr',
        'ngMaterial',
    ];
    angular
        .module('themeConfig', _requires)
        .config(themeConfig);

    themeConfig.$inject = ['$mdThemingProvider', '$mdDateLocaleProvider', 'toastrConfig'];

    function themeConfig($mdThemingProvider, $mdDateLocaleProvider, toastrConfig){
        /**
         * Theme colors config
         */
        const customIndigo = $mdThemingProvider.extendPalette('indigo', {
            '500': '#445a7a',
            '100': '#778899',
            '700': '#1f2f46',
            'contrastDefaultColor': 'light'
        });
        $mdThemingProvider
            .theme('default')
            .primaryPalette('customIndigo', {
                'default': '500',
                'hue-1': '100',
                'hue-2': '700'
            })
            .accentPalette('blue-grey', {
                'default': '700',
                'hue-1': '300',
                'hue-2': '900'
            })
            .warnPalette('pink', {
                    'default': 'A200',
                    'hue-1':'A100',
                    'hue-2':'A400',
                }
            );
        $mdThemingProvider
            .definePalette('customIndigo', customIndigo);
        //Mobile Browser color conf
        $mdThemingProvider
            .enableBrowserColor({
                theme: 'default',
                palette: 'primary',
                hue: '500'
            });
        /**
         * md-date-picker local provider default config
         */
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        $mdDateLocaleProvider.months = ['Ocak', 'Şubat', 'Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
        $mdDateLocaleProvider.shortMonths = ['Oca', 'Şub', 'Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara' ];
        $mdDateLocaleProvider.days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba','Perşembe','Cuma','Cumartesi'];
        $mdDateLocaleProvider.shortDays = ['Pz', 'Pt', 'Sa', 'Ça','Pe','Cm','Ct'];
        $mdDateLocaleProvider.parseDate = function(dateString) {
            const m = moment(dateString, 'L', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
        $mdDateLocaleProvider.formatDate = function(date) {
            const m = moment(date);
            return m.isValid() ? m.format('DD.MM.YYYY') : '';
        };
        $mdDateLocaleProvider.monthHeaderFormatter = function(date) {
            return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
        };
        $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
            return 'Hafta ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Takvim';
        $mdDateLocaleProvider.msgOpenCalendar = 'Takvimi Aç';
        $mdDateLocaleProvider.firstRenderableDate = new Date(2000, 1, 1);
        $mdDateLocaleProvider.lastRenderableDate = new Date(2030, 12, 31);
        /**
         * Toastr default config
         */
        angular.extend(toastrConfig,{
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast',
            allowHtml: true,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            progressBar: false,
            tapToDismiss: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
        });
    }
})(window.angular);