import { IHttpService } from 'angular';
import { ISettings } from '../../../../shared/shared.module';
import { FeedBack } from '../feedback-form/feedback-form.component.controller';

/**
 * 
 * 
 * @export
 * @class CeturbApiService
 */
export class FeedBackApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of FeedBackApiService.
     * @param {IHttpService} http 
     * @memberof FeedBackApiService
     */
    constructor( private http: IHttpService, private settings: ISettings ) { }

    /**
     * 
     * 
     * @param {number} originId 
     * @param {number} destinationId 
     * @returns {Promise<number[]>} 
     * @memberof FeedBackApiService
     */
    public async saveFeedBack( feedback: FeedBack ): Promise<any> {
        const response: any = await this.http.post( `${ this.settings.api.feedback }/demands`, {
            'type': feedback.type,
            'description': 'Transcol Online - FeedBack',
            'approved': false,
            'payload': feedback
        });
        return response.data;
    }
}
