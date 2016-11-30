import './highlight.component.scss';
const directive = () => {
    return {
        template: '<div class="msg-highlight accent" flex><ng-transclude></ng-transclude></div>',
        transclude: true,
        restrict: 'E',
        replace: true,
        scope: true
    };
};

export default directive;