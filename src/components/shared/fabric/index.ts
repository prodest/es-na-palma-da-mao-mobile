
import { CrashlyticsService } from './crashlytics.service';
import { AnswersService } from './answers.service';

export default angular.module( 'shared.fabric', [] )
                      .service( 'crashlyticsService', CrashlyticsService )
                      .service( 'answersService', AnswersService );

export * from './models/index'
export * from './crashlytics.service'
export * from './answers.service'
