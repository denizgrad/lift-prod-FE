(function (angular){
    'use strict';
    const _requires = [
        'stockService',
        'enumService'
    ];
    angular
        .module('stockDialog', _requires)
        .controller('stockDialogController', stockDialogController);

    stockDialogController.$inject = [
        '$q',
        '$http',
        '$scope',
        '$mdDialog',
        'toastr',
        'stockService',
        'uriService',
        'enumService',
        'currencyService',
        'autoCompleteService',
    ];

    function stockDialogController (
        $q,
        $http,
        $scope,
        $mdDialog,
        toastr,
        stockService,
        uriService,
        enumService,
        currencyService,
        autoCompleteService,
    ) {
        const
            includes = '_key_brand,_key_category_item',
            STOCK_ID = stockService.stockDialogOptions.stock_id,
            SAVE_BTN = {
                label: 'Oluştur',
                onClick: createStock
            },
            PROMISES = {
                fetching: false,
                createOrUpdate: false,
            },
            ERROR = {
                hasError: false,
                message: '',
                detail: '',
                status: 200,
            },
            FORM_OPTIONS = {
                stockTypes: enumService.getStockTypes(),
                unitTypes: enumService.getUnitTypes(),
                subUnitTypes: enumService.getSubUnitTypes(),
            },
            BRAND_ACMP_SETTINGS = {
                onChange: onBrandChange,
                prepareParams: prepareCategoryParams,
                endPoint: uriService.ENDPOINT.BRAND,
                searchLengthLimit: 0
            };

        let vm = this;
        vm.$onInit = onInit;
        vm.cancelDialog = cancelDialog;
        vm.checkOptionIsSelected = checkOptionIsSelected;
        vm.loadAnalysisCategories = loadAnalysisCategories;
        vm.loadAnalysisItems = loadAnalysisItems;
        vm.onCategoryChange = onCategoryChange;
        vm.acmpBrandSettings = autoCompleteService.getAutoCompleteOptions(BRAND_ACMP_SETTINGS);
        vm.saveBtnOptions = SAVE_BTN;
        vm.formOptions = FORM_OPTIONS;
        vm.promises = PROMISES;
        vm.error = ERROR;
        vm.analysisCategories = [];
        vm.analysisItems = [];
        vm.formScope = {};
        vm.stock = {};
        vm.searchAnalysisCategory = {name: ''};
        vm.searchAnalysisItem = {name: ''};
        vm.initDone = false;
        vm.is_update = false;
        vm.analysisCategoryKey = undefined;

        function onInit () {
            vm.loadAnalysisCategories();
            currencyService.setCurrenciesToRootScope();
            if (STOCK_ID) {
                // If dialog mode is edit
                vm.saveBtnOptions.label = 'Güncelle';
                vm.saveBtnOptions.onClick = updateStock;
                vm.is_update = true;
                setActiveStock()
            } else {
                setCreateDefaults()
            }
            vm.initDone = true;
        }

        function cancelDialog () {
            console.log(["**** cancelDialog fired"]);
            $mdDialog.cancel();
        }

        function setActiveStock () {
            vm.error.hasError = false;
            vm.promises.fetching = true;
            let defer = $q.defer();
            $http
                .get(`${uriService.ENDPOINT.STOCK}/${STOCK_ID}`, {params: {include: includes}})
                .then(
                    (response)=> { defer.resolve(resolvedSetActiveStock(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function createStock () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            vm.stock = checkBrandValue(vm.stock);
            let defer = $q.defer();
            $http
                .post(uriService.ENDPOINT.STOCK, {data: vm.stock})
                .then(
                    (response)=> { defer.resolve(resolvedCreate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function updateStock () {
            vm.error.hasError = false;
            vm.promises.createOrUpdate = true;
            let copyStock = angular.copy(vm.stock);
            copyStock = checkBrandValue(copyStock);
            let defer = $q.defer();
            $http
                .put(`${uriService.ENDPOINT.STOCK}/${STOCK_ID}`, {data: copyStock})
                .then(
                    (response)=> { defer.resolve(resolvedUpdate(response)) },
                    (errorResponse) => { defer.reject(showErrorMessageFromResponse(errorResponse)); }
                );
            return defer.promise;
        }

        function checkBrandValue (stockObject) {
            if (! vm.acmpBrandSettings.selected_item) {
                if (vm.acmpBrandSettings.searchText && vm.acmpBrandSettings.searchText.length >= 2) {
                    stockObject._key_brand = vm.acmpBrandSettings.searchText;
                }
            }
            return stockObject
        }

        function resolvedSetActiveStock (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            }
            vm.stock = response.data.attributes;
            vm.stock.analysis_settings = vm.stock.analysis_settings||{};
            vm.stock.use_analysis_settings = vm.stock.use_analysis_settings||false;
            if (vm.stock._key_currency) {
                vm.stock._key_currency = vm.stock._key_currency.$oid;
            }
            if (vm.stock._key_brand) {
                vm.acmpBrandSettings.selected_item = vm.stock._key_brand;
                vm.stock._key_brand = vm.stock._key_brand.$oid;
            }
            if (vm.stock._key_category) {
                // vm.acmpCategorySettings.selected_item = vm.stock._key_category;
                vm.stock._key_category = vm.stock._key_category.$oid;
                vm.loadAnalysisItems(vm.stock._key_category);
                checkAnalysisSettings();
            }
            if (vm.stock._key_category_item) {
                // vm.acmpCategoryItemSettings.selected_item = vm.stock._key_category_item;
                vm.stock._key_category_item = vm.stock._key_category_item._id.$oid;
            }
            vm.promises.fetching = false;
            return response
        }

        function resolvedCreate (response) {
            if (response.status !== 201) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Yeni stok kaydı yaptınız', 'Başarılı');
                // setCreateDefaults();
                return response
            }
        }

        function resolvedUpdate (response) {
            if (response.status !== 200) {
                return showErrorMessageFromResponse(response);
            } else {
                vm.promises.createOrUpdate = false;
                toastr.success('Stok başarıyla güncellendi', 'Başarılı');
                $mdDialog.hide(response.data.attributes);
                return response
            }
        }

        function showErrorMessageFromResponse (response) {
            vm.promises.fetching = false;
            vm.promises.createOrUpdate = false;
            if (response.data.error && response.data.error.message) {
                vm.error.message = response.data.error.message;
                if (response.data.error.message === enumService.ERRORS.UNIQUE) {
                    vm.error.detail = 'Stok kodu ile eşleşen bir başka ürün bulunmaktadır';
                } else {
                    vm.error.detail = response.data.error.detail
                }
            } else {
                vm.error.detail = 'Beklenmeyen bir hata oluştu';
                vm.error.message = 'Üzgünüz!'
            }
            vm.error.status = response.status;
            vm.error.hasError = true;
            toastr.error(vm.error.detail, vm.error.message);
            return response
        }

        function setCreateDefaults () {
            vm.stock = {...stockService.MODEL_DEFAULTS};
            // $timeout(function() {
            //     $scope.stockForm.$setPristine();
            //     $scope.stockForm.$setUntouched();
            //     $scope.stockForm.$submitted = false;
            // });
        }

        function checkOptionIsSelected (stockField, selectableObject) {
            if (!vm.stock[stockField] && selectableObject.defaultSelected) {
                vm.stock[stockField] = selectableObject.id;
            }
        }

        function onBrandChange (item) {
            if (! item) {
                delete vm.stock._key_brand;
                return false;
            }
            vm.stock._key_brand = item._id ? item._id.$oid : item._id.$oid;
        }

        function onCategoryChange (item) {
            if (! item) {
                delete vm.stock._key_category;
                return false;
            }
            // vm.stock._key_category = item._id ? item._id.$oid : item._id.$oid;
            vm.loadAnalysisItems(vm.stock._key_category);
            checkAnalysisSettings();
        }

        function prepareCategoryParams (searchText) {
            return {query: {name: {'$regex': searchText, '$options': 'i'}}}
        }

        function loadAnalysisCategories () {
            let params = {page:1, limit: 100};
            vm.analysisCategories = [];
            $http
                .get(uriService.ENDPOINT.ANALYSIS_CATEGORY, {params})
                .then((response)=>{
                if (response.status === 200) {
                    vm.analysisCategories = response.data.data;
                }
            })
        }

        function loadAnalysisItems (analysisCategoryId) {
            vm.analysisItems = [];
            let params = {page:1, limit: 100, query: {_key_analysis_category: analysisCategoryId}};
            $http
                .get(uriService.ENDPOINT.ANALYSIS_CATEGORY_ITEM, {params})
                .then((response)=>{
                    if (response.status === 200) {
                        vm.analysisItems = response.data.data;
                    }
                })
        }

        function checkAnalysisSettings () {
            try{
                vm.analysisCategories.map((category)=>{
                    if (category._id.$oid === vm.stock._key_category) {
                        vm.analysisCategoryKey = category.category_type;
                    }
                });
            } catch (e) {
                vm.analysisCategoryKey = undefined
            }
        }
    }
})(window.angular);