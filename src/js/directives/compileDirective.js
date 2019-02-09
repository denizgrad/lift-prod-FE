/**
 * @created_by: Hasan BUDAK <hasan.budak@soft-nec.com>
 * @created_at: 29 January 2019 16:15 AM
 */
(function (angular, paths){
    'use strict';
    /**
     * @ngdoc directive
     * @name compileDirectiveDirective:compileDirective
     * @restrict 'A'
     * @description
     *      Attribute compiler
     * @example
     <element soft-compile="'<my-component></my-component>'"></stock-autocomplete>
     */
    angular
        .module('compileDirective', [])
        .directive('softCompile', compileDirective);

    compileDirective.$inject = ['$compile'];
    /**
     * compileDirective Directive Service
     */
    function compileDirective ($compile){
        return {
            // @param restrict | directive type as 'E' meaning 'Element'.
            restrict: 'A',
            link: (scope, element, attrs) => {
                console.log(["*** compile triggered", scope, element, attrs]);
                scope.$watch(
                    function (scope) {
                        return scope.$eval(attrs.softCompile);
                    },
                    function (value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            }
        }
    }
})(window.angular, window.paths);