(function (angular, paths) {
    angular
        .module('stockService', [])
        .factory('stockService', stockService);

    stockService.$inject = ['$mdDialog', '$q'];

    function stockService ($mdDialog, $q) {
        const
            DIALOG_PATH = paths.DIALOGS_PATH,
            STOCK_DIALOG_PATH = `${DIALOG_PATH}/stock/stockDialog.html?v=${paths.version}`,
            STOCK_DIALOG_OPTIONS = {stock_id: null},
            MODEL_DEFAULTS = {
                vat_rate: 18,
                low_stock_alarm: 0,
                analysis_settings: {},
                use_analysis_settings: false,
            };

        const servicePublic = {
            showStockDialog: showStockDialog,
            MODEL_DEFAULTS: MODEL_DEFAULTS,
            stockDialogOptions: STOCK_DIALOG_OPTIONS,
        };

        // Return accessible service vars
        return servicePublic;

        /**
         * Edit a stock item or create a new one
         * @param {event} targetEvent
         * @param {string|null} stock_id: Set if editing
         * @param {object|null} args: Dialog options
         * @returns {*}
         */
        function showStockDialog (targetEvent, stock_id, args) {
            servicePublic.stockDialogOptions.stock_id = stock_id || null;
            args = args && typeof args === 'object'
                ? args
                : {};
            let defer = $q.defer();
            $mdDialog.show({
                templateUrl: STOCK_DIALOG_PATH,
                controller: 'stockDialogController',
                controllerAs: 'vm',
                targetEvent: targetEvent||angular.element(document.body),
                clickOutsideToClose: args.clickOutsideToClose||true,
                fullscreen: args.fullscreen||true
            }).then((result)=>{
                servicePublic.stockDialogOptions.stock_id = null;
                defer.resolve(result)
            }, (errorResult)=>{
                servicePublic.stockDialogOptions.stock_id = null;
                defer.reject(errorResult)
            });
            return defer.promise;
        }
    }
})(window.angular, window.paths);