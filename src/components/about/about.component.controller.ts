import { IScope, IWindowService } from 'angular';
import { TeamsApiService, TeamMember, Project } from './shared/index';
import packageJson = require( '../../../package.json' );

export class AboutController {

    public static $inject: string[] = [ '$scope', '$window', 'teamsApiService' ];

    public teamMembers: TeamMember[] = [];
    public project: Project = packageJson;

    /**
     * Creates an instance of AboutController.
     * 
     * @param {IScope} $scope
     * @param {IWindowService} $window
     * @param {TeamsApiService} teamsApiService
     */
    constructor( private $scope: IScope,
        private $window: IWindowService,
        private teamsApiService: TeamsApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public async activate() {
        this.teamMembers = await this.teamsApiService.getTeamMembers();
    }

    /**
     * 
     * 
     * @param {string} url
     */
    public openUrl( url: string ): void {
        this.$window.open( url, '_system' );
    }
}

