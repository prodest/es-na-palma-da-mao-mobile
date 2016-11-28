import * as moment from 'moment';

const fromNowFilter = () => {
    return ( input, startOfDay ) => {
        let date = moment( input );
        if ( !date || !date.isValid() ) {
            return input;
        }
        if ( startOfDay ) {
            return date.from( moment().startOf( 'day' ) );
        }
        return date.fromNow();
    };
};

export default fromNowFilter;
