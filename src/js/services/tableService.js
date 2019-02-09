(function (angular){
    'use strict';
    angular
        .module('tableService', [])
        .factory('tableService', tableService);

    tableService.$inject = [];

    function tableService() {

        return {
            getTableDefaults,
        };

        function getTableDefaults () {
            return {
                query: getQueryDefaults(),
                multiple: false,
                selectable: true,
                pageSelect: true,
                boundaryLinks: true,
                label: {page:'Sayfa', rowsPerPage:'Gösterilen Adet'},
                limitOptions: [5, 10, 25, 50]
            }
        }

        function getQueryDefaults () {
            return {
                promise: false,
                page: 1,
                limit: 5,
                total: 5,
                data: [],
                selected: [],
                order: '-id',
            }
        }
    }
})(window.angular);