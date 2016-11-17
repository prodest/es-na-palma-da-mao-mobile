export function removeEmailValidationDirective() {
    return {
        require: 'ngModel',
        link: function ( $scope, element, attrs, ngModel ) {
            ngModel.$validators[ 'email' ] = function () {
                return true;
            };
        }
    };
};
