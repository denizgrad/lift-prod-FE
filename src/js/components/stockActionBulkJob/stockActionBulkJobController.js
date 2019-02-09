/**
 * @created_by: HASAN BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 20 December 2018 11:00 AM
 */
(function (){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      stockActionBulkJobComponent:stockActionBulkJob componentinin Controller modülüdür
     */
    angular
        .module('stockActionBulkJobController', [])
        .controller('stockActionBulkJobController', stockActionBulkJobController);

    /**
     * Inject list of stockActionBulkJobController
     * @type {string[]}
     */
    stockActionBulkJobController.$inject = [
        '$http',
        'uriService',
        'stockService',
        'stockActionService',
        'enumService',
        '$timeout',
        'autoCompleteService',
        'toastr',
        '$localStorage'
    ];

    /**
     * @ngdoc controller
     * @param {object} $http: AngularJS main XMLHttpRequest service
     * @param {object} uriService: Application constant strings
     * @param {object} stockService: Stock Module service
     * @param {object} stockActionService: StockAction Module Service
     * @param {object} enumService: Application enum(constant) service
     * @param {function} $timeout: AngularJS setTimeout service
     * @param {object} autoCompleteService: Autocomplete settings service
     * @param {object} toastr: toastr service for notification
     * @param {object} $localStorage: ngStorage service
     */
    function stockActionBulkJobController(
        $http,
        uriService,
        stockService,
        stockActionService,
        enumService,
        $timeout,
        autoCompleteService,
        toastr,
        $localStorage
    ) {
        const
            STORAGE_KEY = 'bulk_action_list',
            ROW_CLASS = 'bulk-data-row',
            ROW_INDEX_ATTR_NAME = 'data-index',
            CELL_CLASS = 'bulk-data-cell',
            UNIT_TYPE_CLASS = 'bulk-data-cell__unit_type',
            MAIN_UNIT_TYPE_CLASS = 'bulk-data-cell__main_unit_type',
            DELETE_BUTTON_CLASS = 'bulk-data-cell__btn-delete',
            ADD_WITH_BARCODE_CLASS = 'add-with-barcode-input',
            DEFAULTS = {
                waybill: 0,
                oneWaybill: true,
                actionType: '1',
                addWithBarcode: '',
            },
            ERRORS = {
                title: 'Bir hata oluştu',
                hasError: false,
                errors: []
            },
            ADD_WITH_BARCODE = {
                notFound: false,
                value: ''
            };
        let vm = this;
        vm.$onInit = onInit;
        vm.deleteRow = deleteRow;
        vm.addNewToList = addNewToList;
        vm.onStockChange = onStockChange;
        vm.keyDownListener = keyDownListener;
        vm.runBulkJob = runBulkJob; //validateRecordToSave
        vm.addwithBarcodeKeyDownListener = addwithBarcodeKeyDownListener;
        vm.findEnumById = enumService.findEnumById;
        vm.addWithBarcode = ADD_WITH_BARCODE;
        vm.bulkDefaults = DEFAULTS;
        vm.bulkErrors = ERRORS;
        vm.bulkDataList = [];
        vm.enumTypes = {};
        vm.acmpSettings = {};

        function onInit(){
            let acmpOptions = {
                onChange: onStockChange,
                endPoint: uriService.ENDPOINT.STOCK,
            };
            vm.acmpSettings = autoCompleteService.getAutoCompleteOptions(acmpOptions);
            vm.enumTypes = {
                actionTypes: enumService.getStockActionTypes(),
                unitTypes: enumService.getUnitTypes(),
                mainUnitTypes: enumService.getSubUnitTypes(),
            };
            initTable()
        }
        /**
         * Delete an item from bulkDataList by $index
         * @param {object} rowItem
         */
        function deleteRow (rowItem) {
            vm.bulkDataList[rowItem]._key_stock = '';
            vm.bulkDataList.splice(rowItem, 1);
            checkDeleteButtonVisibility();
            saveRecordsToLocalStorage()
        }

        /**
         * Add new record to bulkDataList
         */
        function addNewToList (withData) {
            withData = withData || {};
            let itemValues = {...stockActionService.MODEL_DEFAULTS, ...withData};
            itemValues.action_type = vm.bulkDefaults.actionType;
            if (vm.bulkDefaults.oneWaybill) {
                itemValues.waybill = vm.bulkDefaults.waybill
            }
            console.log("*** itemV");
            console.log(itemValues);
            vm.bulkDataList.push(itemValues);
            triggerNewItemJobs()
        }

        function triggerNewItemJobs () {
            checkDeleteButtonVisibility();
            scrollToEndOfTable();
            saveRecordsToLocalStorage()
        }

        /**
         * Fires when stock-autocomplete item changed
         * Work as callback of autocomplete diretive
         *
         * check @directives.autocompletes._key_stockAutocomplete
         *
         * When onStockChange fires method fins record on table and sets types as manuel
         *
         * @param {object} selectedItem: selected stock item
         * @param {object} selectedModel: vm.bulkDataList item reference
         */
        function onStockChange (selectedItem, selectedModel) {
            if (! selectedItem) {
                return false;
            }
            let tableIndex = vm.bulkDataList.indexOf(selectedModel);
            console.log(["*** tableIndex: ", tableIndex, selectedItem]);
            if (tableIndex !== -1) {
                // Set currency type from stock
                vm.bulkDataList[tableIndex]._key_currency = selectedItem._key_currency._id
                    ? selectedItem._key_currency._id.$oid
                    : selectedItem._key_currency.$oid;
                addUnitTypesToTable(tableIndex, selectedItem);
                saveRecordsToLocalStorage();
                console.log(["*** tableIndex on end: ", tableIndex, selectedItem]);
            }
        }

        function addUnitTypesToTable (tableIndex, stockRecord) {
            $timeout(()=> {
                let {unitTypes, mainUnitTypes} = vm.enumTypes;
                let unitType,
                    mainUnitType,
                    unitTypeContent,
                    rowElement,
                    rowSelector;
                // Set types manuel righter than listeners
                rowSelector = `.${ROW_CLASS}[${ROW_INDEX_ATTR_NAME}='${tableIndex}']`;
                rowElement = document.querySelector(rowSelector);
                if (rowElement && stockRecord) {
                    unitType = vm.findEnumById(unitTypes.items, stockRecord.unit_type);
                    mainUnitType = vm.findEnumById(mainUnitTypes.items, stockRecord.main_unit_type);
                    unitTypeContent = `${unitType.display} / ${mainUnitType.display}`;
                    rowElement.querySelector(`.${UNIT_TYPE_CLASS}`).innerHTML = unitTypeContent;
                }
            },100);
        }

        /**
         * Keydown listener on tableBody element
         *
         * When key fires as :ENTER: Add new blank row to list
         *
         * @param {event} event: Javascript keyDownEvent
         */
        function keyDownListener (event) {
            try {
                // let el = angular.element(event.target);
                switch (event.keyCode) {
                    case enumService.KEY_CODE.ENTER:
                        vm.addNewToList({});
                        break;
                    case enumService.KEY_CODE.BACKSPACE:
                    case enumService.KEY_CODE.DELETE:
                        // TODO:Hasan delete & backspace çalıştığında silme kuralları çalıştırılmalı
                        break;
                }
            }catch (e) {}
        }

        /**
         * Toggle delete button
         */
        function checkDeleteButtonVisibility () {
            $timeout(()=> {
                let elementList = document.querySelectorAll(`.${DELETE_BUTTON_CLASS}`);
                if (vm.bulkDataList.length > 1) {
                    elementList.forEach((el) => {
                        el.classList.remove('hide')
                    })
                } else {
                    elementList.forEach((el) => {
                        el.classList.add('hide')
                    })
                }
            }, 100);
        }

        /**
         * Scroll to and of table
         */
        function scrollToEndOfTable() {
            $timeout(()=> {
                let lastIndex = vm.bulkDataList.length - 1;
                let acmpSelector = `input[name=stock_autocomplete-index${lastIndex}]`;
                let inputElement = document.querySelector(acmpSelector);
                inputElement.focus();
            }, 100);
        }

        function runBulkJob () {
            let recordsToSave = [];
            vm.bulkErrors.title = 'Uygunsuz kayıtlar tespit edildi';
            vm.bulkErrors.hasError = false;
            vm.bulkErrors.errors = [];
            vm.bulkDataList.forEach((value, index) => {
                value.waybill = vm.bulkDefaults.waybill;
                let validationResponse = stockActionService.validateRecordToSave(value);
                if (validationResponse.hasError) {
                    vm.bulkErrors.errors.push({index, detail: validationResponse.errorMsg});
                    vm.bulkErrors.hasError = true;
                } else {
                    recordsToSave.push(validationResponse.validatedRecord)
                }
            });
            if (vm.bulkErrors.hasError) {
                toastr.error(vm.bulkErrors.errors[0], 'Hatalı Kayıt Sayısı: ' + vm.bulkErrors.errors.length);
                return false
            }
            $http
                .post(uriService.ENDPOINT.STOCK_ACTION, {data: {bulk_list: recordsToSave}})
                .then(resolvedBulkJob, resolvedBulkJob);
        }

        function resolvedBulkJob(response) {
            if (response.status === 200 || response.status === 201) {
                let errorSectionTitle = 'Kayıtlar oluşturulurken bir hata oluştu!';
                if (response.data.hasError) {
                    if (response.data.createdCount) {
                        errorSectionTitle = 'Bazı kayıtlar oluşturulurken hatalar oluştur';
                        toastr.info(errorSectionTitle, 'Kısmi Başarılı');
                    }else{
                        errorSectionTitle = 'Kayıtlar oluşturulamadı';
                        toastr.error('Kayıtlar oluşturulamadı. Lütfen detayları inceleyiniz', 'Hata!')
                    }
                    response.data.errors.map((errorDetails)=>{
                        vm.bulkDataList[errorDetails.index].errorMsg = errorDetails.detail;
                    });
                    vm.bulkErrors.title = errorSectionTitle;
                    vm.bulkErrors.errors = response.data.errors;
                    vm.bulkErrors.hasError = true;
                } else {
                    toastr.success('Tüm kayıtlar başarıyla oluşturuldu', 'İşlem Başarılı');
                    clearRecordsFromLocalStorage();
                    vm.bulkDataList = [];
                    return true
                }
            } else {
                toastr.error('Beklenmeyen bir hata oluştu', 'Hata!');
            }
            return false;
        }

        function initTable() {
            let fromLocalStorage = $localStorage[STORAGE_KEY];
            if (fromLocalStorage) {
                vm.bulkDataList = angular.fromJson(fromLocalStorage);
                if (vm.bulkDataList.length > 0) {
                    checkDeleteButtonVisibility();
                    vm.bulkDataList.map((record, tableIndex)=>{
                        record = stockActionService.deleteInvalidValues(record);
                        addUnitTypesToTable(tableIndex, record._key_stock)
                    });
                    return true;
                }
            }
            vm.addNewToList({});
            return true;
        }

        /**
         * Save changes on storage
         */
        function saveRecordsToLocalStorage () {
            $timeout(()=> {
                $localStorage[STORAGE_KEY] = angular.toJson(vm.bulkDataList);
            }, 100);
        }

        /**
         * Clear records on storage after saved
         */
        function clearRecordsFromLocalStorage () {
            $localStorage[STORAGE_KEY] = undefined
        }

        /**
         * Barkod ile ekleme input alanı tarafından trigger edilen keyDownEvent listener
         * @param {object} event: {keyDownEvent}
         * @param {string} barcodeText: barcode value
         */
        function addwithBarcodeKeyDownListener (event, barcodeText) {
            if (event.keyCode === enumService.KEY_CODE.ENTER && barcodeText.length > 1) {
                let params = {query: {barcode: barcodeText}, limit: 1};
                let lastIndex = vm.bulkDataList.length - 1;
                let lastItem = vm.bulkDataList[lastIndex];
                $http
                    .get(uriService.ENDPOINT.STOCK, {params})
                    .then((response)=>{
                        if (response.status === 200 && response.data.data.length > 0) {
                            let stock = response.data.data[0];
                            if (! lastItem._key_stock) {
                                lastItem._key_stock = stock;
                                triggerNewItemJobs();
                                addUnitTypesToTable(lastItem, stock)
                            } else {
                                addNewToList({_key_stock: stock, _key_currency: stock._key_currency.$oid});
                                addUnitTypesToTable(lastIndex + 1, stock)
                            }
                            toastr.success(barcodeText, 'Eşleşme sağlandı', {timeOut: 2000});
                            vm.addWithBarcode.value = '';
                            $timeout(()=> {
                                document.querySelector(`.${ADD_WITH_BARCODE_CLASS}`).focus()
                            }, 100);
                        } else {
                            toastr.warning(
                                'Barkod ile eşleşen stok bulunmamakta - ' + barcodeText,
                                'Stok Bulunamadı',
                                {timeOut: 2000})
                        }
                    })
            }
        }
    }
})();