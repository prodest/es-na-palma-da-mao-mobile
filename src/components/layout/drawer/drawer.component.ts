/**
 * Native-like Framework
 * Depends on Hammer.js
 * for smooth touch handeling
 *
 * This module was mainly developed for android apps build with Ionic
 * but can be used within any Angular project.
 */


import './drawer.component.css';
import template = require('./drawer.component.html');
import DrawerController from './drawer.component.controller';

const directive = () => {
    return {
        template: template,
        controller: DrawerController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
