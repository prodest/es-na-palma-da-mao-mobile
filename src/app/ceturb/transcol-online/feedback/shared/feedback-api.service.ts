import { IHttpService } from 'angular';
import { ISettings } from '../../../../shared/shared.module';
import { FeedBack } from '../feedback-form/feedback-form.component.controller';
import { AuthenticationService } from '../../../../security/shared/authentication.service';

/**
 * 
 * 
 * @export
 * @class CeturbApiService
 */
export class FeedBackApiService {

    public static $inject: string[] = [ '$http', 'settings', 'authenticationService' ];

    /**
     * Creates an instance of FeedBackApiService.
     * @param {IHttpService} http 
     * @memberof FeedBackApiService
     */
    constructor(
        private http: IHttpService,
        private settings: ISettings,
        private authService: AuthenticationService ) { }

    /**
     * 
     * 
     * @param {number} originId 
     * @param {number} destinationId 
     * @returns {Promise<number[]>} 
     * @memberof FeedBackApiService
     */
    public async saveFeedBack( feedback: FeedBack ): Promise<any> {
        
        // preenche o usuário que reportou o feedback
        feedback.user = this.authService.user;

        const response: any = await this.http.post( `${ this.settings.api.feedback }/demands`, {
            'type': feedback.type,
            'description': 'Transcol Online - FeedBack',
            'approved': false,
            'payload': feedback
        });
        return response.data;
    }
}
