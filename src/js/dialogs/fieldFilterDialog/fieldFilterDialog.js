(function(angular, paths){
    angular
        .module('fieldFilterDialog', [])
        .factory('fieldFilterService', fieldFilterService)
        .controller('fieldFilterController', fieldFilterController);

    function fieldFilterService($mdDialog) {
        const
            equalTypes = [
                {id: '$eq', display: 'Eşit', selected: true},
                {id: '$ne', display: 'Eşit Değil'}
            ],
            numberTypes = [
                ...equalTypes,
                {id: '$gt', display: 'Büyük'},
                {id: '$gte', display: 'Büyük Eşit'},
                {id: '$lt', display: 'Küçük'},
                {id: '$lte', display: 'Küçük Eşit'},
            ],
            textTypes = [
                ...equalTypes,
                {id: '$regex', display: 'Benzer', selected: true},
            ];
        let vm = this;
        vm.showDialog = showDialog;
        vm.getTypeMap = getTypeMap;
        vm.editSelected = null;
        vm.fieldFilterList = [];
        return vm;

        function showDialog(args) {
            if (args instanceof Object) {
                vm.fieldFilterList = args.fieldFilterList || vm.fieldFilterList;
                vm.editSelected = args.editSelected || null;
            } else {
                args = {}
            }
            if (vm.fieldFilterList.length === 0) {
                throw TypeError('*** fieldFilterList should contains an object')
            }
            return $mdDialog.show({
                controller: 'fieldFilterController',
                controllerAs: 'vm',
                templateUrl: `${paths.DIALOGS_PATH}/fieldFilterDialog/fieldFilterDialog.tmpl.html?v=${paths.version}`,
                targetEvent: args.targetEvent||angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: true
            });
        }

        function getTypeMap () {
            return  {
                datetime: numberTypes,
                number: numberTypes,
                text: textTypes,
            };
        }
    }
    function fieldFilterController ($mdDialog, fieldFilterService) {
        const SELECTED_FILTER = {
            field: {},
            operator: '',
            value: null
        };
        let vm = this;
        vm.$onInit = onInit;
        vm.checkFieldSelected = checkFieldSelected;
        vm.checkOptionSelected = checkOptionSelected;
        vm.changeOperatorList = changeOperatorList;
        vm.keyEventListener = keyEventListener;
        vm.closePrompt = closePrompt;
        vm.initDone = false;
        vm.operatorList = [];

        function onInit () {
            vm.fieldFilterList = fieldFilterService.fieldFilterList;
            vm.editSelected = fieldFilterService.editSelected;
            vm.typesMap = fieldFilterService.getTypeMap();
            vm.selectedFilter = vm.editSelected||SELECTED_FILTER;
            vm.initDone = true;
        }
        function closePrompt (accepted=true, removed=false) {
            if (accepted) {
                fieldFilterService.fieldFilterList = vm.fieldFilterList;
            }
            vm.result=accepted;
            vm.removed=removed;
            $mdDialog.hide(vm);
        }

        function changeOperatorList () {
            vm.operatorList = vm.typesMap[vm.selectedFilter.field.type];
        }

        function checkFieldSelected(field) {
            if (vm.editSelected) {
                return field.slug === vm.editSelected.field.slug;
            }
            return field.selected||false;
        }

        function checkOptionSelected (operator) {
            if (vm.editSelected) {
                return operator.id === vm.editSelected.operator.id;
            }
            return operator.selected||false;
        }

        function keyEventListener (event) {
            if (event.keyCode === 13) {
                // If enter pressed
                let value = vm.selectedFilter.value;
                if (value === 0 || value) {
                    return closePrompt(true, false);
                }
            }
        }
    }

    fieldFilterService.$inject = ['$mdDialog'];
    fieldFilterController.$inject = ['$mdDialog', 'fieldFilterService']
})(window.angular, window.paths);