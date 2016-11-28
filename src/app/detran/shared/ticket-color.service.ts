export class TicketColorService {
     /**
     * Lista de possíveis classificações de multas: leve, média, grave ou gravíssima.
     * 
     * @private
     * @type { name: string, color: string }
     */
    private levels = [
        { name: 'leve', color: 'green' },
        { name: 'média', color: 'yellow' },
        { name: 'media', color: 'yellow' },
        { name: 'grave', color: 'red' },
        { name: 'gravíssima', color: 'black' },
        { name: 'gravissima', color: 'black' }
    ];

    /**
     * Obtem a cor relativa à uma classificação de multa. Usado somente na interface.
     * 
     * @param {string} levelName
     * @returns {string}
     */
    public getTicketLevelColor( levelName: string ): string {
        levelName = levelName.toLowerCase();
        let level = this.levels.filter( c => c.name === levelName );

        if ( level && level.length === 1 ) {
            return level[ 0 ].color;
        }

        return '';
    }
}