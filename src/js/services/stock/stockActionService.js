(function (angular) {
    angular
        .module('stockActionService', [])
        .factory('stockActionService', stockActionService);

    stockActionService.$inject = ['$mdDialog'];

    function stockActionService ($mdDialog) {
        const
            ACTION_TYPE = {GIRIS: '1', CIKIS: '2'},
            MODEL_DEFAULTS = {
                quantity: 0,
                unit_price: 0,
                action_type: '1'
            };

        return {
            MODEL_DEFAULTS,
            deleteInvalidValues,
            validateRecordToSave,
        };

        /**
         * Edit a stock item or create a new one
         * @param {object} stockActionRecord:
         * @returns {*}
         */
        function validateRecordToSave (stockActionRecord) {
            let {_key_stock, quantity} = stockActionRecord;
            let response = {hasError: false, errorMsg: '', validatedRecord: angular.copy(stockActionRecord)};
            response.validatedRecord = deleteInvalidValues(response.validatedRecord);
            if (! _key_stock) {
                response.hasError = true;
                response.errorMsg = 'İşlem için stok seçilmelidir!';
                return response
            }
            if (! quantity || quantity <= 0) {
                response.hasError = true;
                response.errorMsg = "İşlem miktarı 0'dan büyük olmalıdır!";
                return response
            }
            if (_key_stock instanceof Object) {
                response.validatedRecord._key_stock = _key_stock._id ? _key_stock._id.$oid : _key_stock.$oid;
            }
            return response
        }

        function deleteInvalidValues (stockActionRecord) {
            try{
                delete stockActionRecord.searchText;
                delete stockActionRecord.errorMsg;
            }catch (e) {}
            return stockActionRecord
        }
    }
})(window.angular);