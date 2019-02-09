/**
 * Liftnec içinde global olarak kullanılması gereken $rootScope variable değerleri burada tanımlıdır
 *  $rootScope üzerinde tanımlı olan tüm değerler tüm application içerisinden erişilebilir
 */
(function (angular){
    'use strict';

    angular
        .module('liftnecApp')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$filter'];

    function appRun ($rootScope, $filter) {
        /**
         * Login olmuş kullanıcı
         *
         * @type: {Object}
         */
        $rootScope.projectStates = ['Askıda', 'Açık', 'Sonlandı']
        /**
         * Login olmuş kullanıcı
         *
         * @type: {Object}
         */
        $rootScope.currentUser = $rootScope.currentUser||undefined;
        /**
         * Server tarafında tanımlı olan para birimi listesi
         *
         * @type: {Array}
         */
        $rootScope.currencies = $rootScope.currencies||undefined;
        /**
         * ui.router $state servisi
         *
         * @type {Object}
         */
        $rootScope.$state = $rootScope.$state||undefined;
        /**
         * @type {function}
         * @usage: $rootScope.fixDigits(1234.41611515151) -> 1234.42
         */
        $rootScope.fixDigits = fixDigits;
        /**
         * @type {function}
         * @usage: $rootScope.formatCurrency(1234.41611515151, '', 2) -> $1,234.42
         */
        $rootScope.formatCurrency = formatCurrency;
        /**
         * @type {function}
         * @usage $rootScope.formatDate(STRING_OR_NUMBER_OR_OBJECT)
         * @usage-with-formatString $rootScope.formatDate(STRING_OR_NUMBER_OR_OBJECT, 'dd.MM.yyyy')
         * @usage-with-timezone $rootScope.formatDate(STRING_OR_NUMBER_OR_OBJECT, 'dd.MM.yyyy', '+3')
         */
        $rootScope.formatDate = formatDate;
        /**
         * @param {int|float} amount
         * @param {string} symbol
         * @param {int} digit
         * @returns {float}
         */
        function formatCurrency (amount, symbol, digit) {
            switch (symbol) {
                case 'TRY':
                    symbol = '₺';
                    break;
                case 'USD':
                    symbol = '$';
                    break;
                case 'EUR':
                    symbol = '€';
                    break;
            }
            if (typeof amount === 'number') {
                symbol = symbol||'';
                digit = digit||2;
                return $filter('currency')(amount, symbol, digit)
            }
            return amount
        }
        /**
         * @param {int|float} numberToFix
         */
        function fixDigits (numberToFix) {
            if (typeof numberToFix === 'number') {
                return parseFloat(numberToFix.toFixed(2))
            }
            return numberToFix
        }
        /**
         * IF dateValue type is string will return self.
         * IF dateValue type is integer (unixtime) or ISOString convert to dateformat
         * IF dateValue type is Object than check $date key and convert to dateformat
         * @param dateValue: {String|Integer|Object} (Object must contains $date key)
         * @param dateFormat: string
         * @param timezone: string | Increment date hours by timezone value should be like "+0", "+1", "+2" etc.
         */
        function formatDate(dateValue, timezone=false, dateFormat="dd.MM.yyyy") {
            // if dateValue = {$date: 1521097058492}
            if (dateValue instanceof Object && typeof dateValue['$date'] === "number"){
                return $filter('date')(dateValue['$date'], dateFormat, timezone);
                // if dateValue = 1521097058492 or 2018-12-26T12:00:00.123Z
            }else if (typeof dateValue === "number" || (typeof dateValue === 'string' && dateValue.indexOf('T')>-1)){
                return $filter('date')(dateValue, dateFormat, timezone);
            }else{
                return dateValue;
            }
        }
    }
})(window.angular);
