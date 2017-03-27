/* tslint:disable */

import * as angular from 'angular';
import { TransitionService } from './app/shared/shared.module';

declare module 'leaflet' {
    export namespace control {
        export function locate( options: any ): any;
    }

    export function markerClusterGroup( options: any ): any;
}

declare module 'angular' {
    /**
     * HttpService monkey patched to return ESPromises instead of angular.IPromise 
     * see http://docs.angularjs.org/api/ng/service/$http
     */
    interface IHttpService {
        /**
         * Object describing the request to be made and how it should be processed.
         */
        <T>( config: IRequestConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform GET request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        get<T>( url: string, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform DELETE request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        delete<T>( url: string, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform HEAD request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        head<T>( url: string, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform JSONP request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param config Optional configuration object
         */
        jsonp<T>( url: string, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform POST request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        post<T>( url: string, data: any, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform PUT request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        put<T>( url: string, data: any, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Shortcut method to perform PATCH request.
         *
         * @param url Relative or absolute URL specifying the destination of the request
         * @param data Request content
         * @param config Optional configuration object
         */
        patch<T>( url: string, data: any, config?: IRequestShortcutConfig ): Promise<IHttpPromiseCallbackArg<T>>;

        /**
         * Runtime equivalent of the $httpProvider.defaults property. Allows configuration of default headers, withCredentials as well as request and response transformations.
         */
        defaults: IHttpProviderDefaults;

        /**
         * Array of config objects for currently pending requests. This is primarily meant to be used for debugging purposes.
         */
        pendingRequests: IRequestConfig[];
    }

    interface IRootScopeService {
        backButtonPressedOnceToExit: boolean;
    }

    interface IScope {
        isAndroid: boolean;
        isIOS: boolean;
        $ionicGoBack: any;
        $transitionService: TransitionService;
    }
}

declare global {
    interface DateConstructor {
        new ( value: Date ): Date;
    }


    interface Navigator {
        splashscreen: { hide: Function };
    }


    interface CordovaPlugins {
        permissions: any;
    }

    interface Window {
        plugins: any;
    }

    interface Chart {
        plugins: any;
        helpers: any;
    }

    const Chart: Chart;
}





declare module '*';

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: string;
declare var HMR: boolean;

interface GlobalEnvironment {
    ENV: string;
    HMR: boolean;
}

interface Es6PromiseLoader {
    ( id: string ): ( exportName?: string ) => Promise<any>;
}

type FactoryEs6PromiseLoader = () => Es6PromiseLoader;
type FactoryPromise = () => Promise<any>;


type IdleCallbacks = Es6PromiseLoader |
    Function |
    FactoryEs6PromiseLoader |
    FactoryPromise;

interface WebpackModule {
    hot: {
        data?: any,
        idle: any,
        accept( dependencies?: string | string[], callback?: ( updatedDependencies?: any ) => void ): void;
        decline( deps?: any | string | string[] ): void;
        dispose( callback?: ( data?: any ) => void ): void;
        addDisposeHandler( callback?: ( data?: any ) => void ): void;
        removeDisposeHandler( callback?: ( data?: any ) => void ): void;
        check( autoApply?: any, callback?: ( err?: Error, outdatedModules?: any[] ) => void ): void;
        apply( options?: any, callback?: ( err?: Error, outdatedModules?: any[] ) => void ): void;
        status( callback?: ( status?: string ) => void ): void | string;
        removeStatusHandler( callback?: ( status?: string ) => void ): void;
    };
}


interface WebpackRequire {
    ( id: string ): any;
    ( paths: string[], callback: ( ...modules: any[] ) => void ): void;
    ensure( ids: string[], callback: ( req: WebpackRequire ) => void, chunkName?: string ): void;
    context( directory: string, useSubDirectories?: boolean, regExp?: RegExp ): WebpackContext;
}

interface WebpackContext extends WebpackRequire {
    keys(): string[];
}

interface ErrorStackTraceLimit {
    stackTraceLimit: number;
}


// Extend typings
interface NodeRequire extends WebpackRequire { }
interface ErrorConstructor extends ErrorStackTraceLimit { }
interface NodeRequireFunction extends Es6PromiseLoader { }
interface NodeModule extends WebpackModule { }
interface Global extends GlobalEnvironment { }
