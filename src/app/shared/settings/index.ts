export * from './settings';
import { ISettings } from './settings';
import settingsJson = require( './settings.json' );

export const settings: ISettings = settingsJson;
