
/**
 * REF: http://www.bennadel.com/blog/2777-monitoring-http-activity-with-http-interceptors-in-angularjs.htm 
 * 
 * @export
 * @class HttpSnifferService
 */
export class HttpSnifferService {

    // I keep track of the total number of HTTP requests that have been
    // initiated with the application.
    public total = {
        all: 0,
        get: 0,
        post: 0,
        delete: 0,
        put: 0,
        head: 0
    };

    // I keep track of the total number of HTTP requests that have been
    // initiated, but have not yet completed (ie, are still running).
    public pending = {
        all: 0,
        get: 0,
        post: 0,
        delete: 0,
        put: 0,
        head: 0
    };


    /**
     * I start tracking the given HTTP request.
     * 
     * @param {any} httpMethod
     */
    public startRequest( httpMethod ) {

        httpMethod = this.normalizedHttpMethod( httpMethod );

        this.total.all++;
        this.total[ httpMethod ]++;
        this.pending.all++;
        this.pending[ httpMethod ]++;
    }


    /**
     * I stop tracking the given HTTP request.
     * 
     * @param {any} httpMethod
     */
    public endRequest( httpMethod ) {

        httpMethod = this.normalizedHttpMethod( httpMethod );

        this.pending.all--;
        this.pending[ httpMethod ]--;

        // EDGE CASE: In the unlikely event that the interceptors were not
        // able to obtain the config object; or, the method was changed after
        // our interceptor reached it, there's a chance that our numbers will
        // be off. In such a case, we want to try to redistribute negative
        // counts onto other properties.
        if ( this.pending[ httpMethod ] < 0 ) {
            this.redistributePendingCounts( httpMethod );
        }
    }

    /**
     * I make sure the given HTTP method is recognizable. If it's not, it is
     * converted to 'get' for consumption.
     * 
     * @private
     * @param {any} httpMethod
     * @returns
     */
    private normalizedHttpMethod( httpMethod ) {
        httpMethod = ( httpMethod || '' ).toLowerCase();
        switch ( httpMethod ) {
            case 'get':
            case 'post':
            case 'delete':
            case 'put':
            case 'head':
                return ( httpMethod );
        }
        return ( 'get' );
    }


    // I attempt to redistribute an [unexpected] negative count to other
    // non-negative counts. The HTTP methods are iterated in likelihood of
    // execution. And, while this isn't an exact science, it will normalize
    // after all HTTP requests have finished processing.
    private redistributePendingCounts( negativeMethod ) {

        this.pending[ negativeMethod ] = 0;

        let overflow = Math.abs( this.pending[ negativeMethod ] );
        let methods = [ 'get', 'post', 'delete', 'put', 'head' ]; // List in likely order of precedence in the application.

        // Trickle the overflow across the list of methods.
        for ( let i = 0; i < methods.length; i++ ) {

            let method = methods[ i ];

            if ( overflow && this.pending[ method ] ) {

                this.pending[ method ] -= overflow;

                if ( this.pending[ method ] < 0 ) {
                    overflow = Math.abs( this.pending[ method ] );
                    this.pending[ method ] = 0;
                } else {
                    overflow = 0;
                }
            }
        }
    }
}
