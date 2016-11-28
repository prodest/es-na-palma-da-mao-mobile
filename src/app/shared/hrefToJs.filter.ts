
const hrefToJsFilter = ( $sanitize, $sce ) => {
    return ( text ) => {
        const regex = /href="([\S]+)"/g;
        const newString = $sanitize( text ).replace( regex, 'onClick="window.open(\'$1\', \'_system\', \'location=yes\')"' );
        return $sce.trustAsHtml( newString );
    };
};

hrefToJsFilter.$inject = [
    '$sanitize',
    '$sce'
];

export default hrefToJsFilter;
