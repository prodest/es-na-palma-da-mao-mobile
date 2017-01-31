

export class AnswersService {

    /**
     * 
     * 
     * @static
     * @type {string[]}
     */
    public static $inject: string[] = ['$window'];

    /**
     * Creates an instance of AnswersService.
     * 
     * @param {any} $window
     */
    constructor(private $window) {
    }

    /**
     * 
     * 
     * @readonly
     * @private
     * @type {boolean}
     */
    private get hasPlugin(): boolean {
        if (angular.isDefined(this.$window.plugins) && angular.isDefined(this.$window.plugins.digits)) {
            return true;
        }
        return false;
    }

    /**
     * 
     * 
     * @private
     * @param {string} name
     * @param {*} attributes
     */
    private sendCustomEvent(name: string, attributes: any) {
        this.$window.plugins.digits.sendCustomEvent(name, attributes);
    }

    /**
     * 
     * 
     * @param {string} method
     * @param {boolean} success
     * @param {any} attributes
     */
    public sendLogin(method: string, success: boolean, attributes) {
        if (this.hasPlugin) {
            this.$window.plugins.digits.sendLogIn(method, success, attributes);
        }
    }

    /**
     * 
     * 
     * @param {*} response
     */
    public sendResponseErrorEvent(response: any) {
        if (this.hasPlugin) {

            let attributes: any = {
                method: response.config.method,
                status: response.status,
                guid: '',
                handled: false
            };

            if ( response.data && response.data.error) {
                attributes.error = response.data.error;
            }

            if ( response.data && response.data.handled) {
                attributes.handled = response.data.handled;
            }

            this.sendCustomEvent( response.config.url, attributes );
        }
    }
}
