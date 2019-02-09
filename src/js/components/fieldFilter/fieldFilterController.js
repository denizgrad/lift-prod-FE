/**
 * @created_by: Deniz Özen
 * @created_at: 24 December 2018 10:00 PM
 */
(function (angular){
    'use strict';
    /**
     * @ngdoc Controller
     * @desc:
     *      fieldFilterComponent:fieldFilter componentinin Controller modülüdür
     */
    angular
        .module('fieldFilterComponentController', [])
        .controller('fieldFilterComponentController', fieldFilterComponentController);

    /**
     * Inject list of fieldFilterComponentController
     * @type {string[]}
     */
    fieldFilterComponentController.$inject = [
        'fieldFilterService',
    ];

    function fieldFilterComponentController(
        fieldFilterService
    ) {

        let vm = this;
        vm.$onInit = onInit;
        vm.addNewFilter = addNewFilter;
        vm.removeFilterByIndex = removeFilterByIndex;

        function onInit(){
            vm.parentController['addNewFilter'] = addNewFilter;
        }


        function addNewFilter (ev, editSelected) {
            let args = {
                targetEvent: ev,
                fieldFilterList: vm.getFilterFields(),
                editSelected: editSelected ? angular.copy(editSelected) : null,
            };
            fieldFilterService.showDialog(args).then(function (obj) {
                if (obj.result){
                    if (! editSelected) {
                        vm.selectedFilters.push(obj.selectedFilter);
                    } else {
                        let selectedIndex = vm.selectedFilters.indexOf(editSelected);
                        if (! obj.removed) {
                            vm.selectedFilters[selectedIndex] = obj.selectedFilter;
                        } else {
                            vm.selectedFilters.splice(selectedIndex, 1);
                        }
                    }
                    fireListChangedEvent()
                }
            })
        }

        function removeFilterByIndex (filterIndex) {
            vm.selectedFilters.splice(filterIndex, 1);
            fireListChangedEvent()
        }

        function fireListChangedEvent () {
            if (vm.onListChanged instanceof Function) {
                vm.onListChanged(vm.selectedFilters);
            }
        }
    }
})(window.angular);