const directive = () => {
    return {
        template: '<div style="color: #999;" flex><ng-transclude></ng-transclude></div>',
        transclude: true,
        restrict: 'E',
        replace: true,
        scope: true
    };
};

export default directive;