/*
eslint
"no-invalid-this": 1,
"angular/timeout-service": 0,
"angular/definedundefined": 0,
"angular/json-functions": 0,
"no-unused-vars": 1
*/

// ES6 gulpfile
// ref: https://markgoodyear.com/2015/06/using-es6-with-gulp/
import bluebird from 'bluebird';
import innerGulp from 'gulp';
import gulpHelp from 'gulp-help';
import yargs from 'yargs';
import runSequence from 'run-sequence';
import fs from 'fs';
import git from 'gulp-git';
import tap from 'gulp-tap';
import gutil from 'gulp-util';
import es from 'event-stream';
import concat from 'gulp-concat';
import order from 'gulp-order';
import gulpif from 'gulp-if';
import bump from 'gulp-bump';
import inquirer from 'inquirer';
import github from 'octonode';
import gulpExec from 'gulp-exec';
import del from 'del';
import semver from 'semver';
import cheerio from 'gulp-cheerio';
import shell from 'gulp-shell';

const gulp = gulpHelp( innerGulp );
const Promise = bluebird;

let paths = {
    packageJson: './package.json',
    cordovaConfig: './config.xml',
    changelog: './CHANGELOG.md'
};

let config = {
    repository: 'https://github.com/prodest/es-na-palma-da-mao-mobile',
    paths: paths,
    masterBranch: 'master',
    developBranch: 'develop'
};

/**
 * Realiza o parse dos argumentos da linha de comando
 */
let argv = yargs.alias( 'p', 'password' )
                .default( 'password', '' )
                .argv;


////////////////////////////////////////// HELPERS /////////////////////////////////////////////////

/**
 * github api client
 */
let client;

/**
 * Lê um arquivo JSON
 *
 * @param {String} file - o path para o arquivo
 *
 * @returns {Object} - uma objeto JSON
 */
const readJsonFile = ( file ) => {
    return JSON.parse( fs.readFileSync( file ) );
};

/**
 * Adiciona novos 'src' ao pipeline do gulp
 *
 * @param {string} src - src para ser adicionado ao pipeline do gulp.
 * @returns {Stream} - uma gulp stream
 *
 * @example
 * gulp.src('')
 * .pipe(addSrc('CHANGELOG.md'))
 * .gulp.dest();
 */
const addSrc = ( src ) => {
    let pass = es.through();
    return es.duplex( pass, es.merge( gulp.src.apply( gulp.src, [ src ] ), pass ) );
};

/**
 * Obtém o email(cadastrado no git) do usuário corrente
 *
 * @returns {Promise} - uma promise
 */
const getEmailAsync = Promise.promisify( git.exec.bind( git, {
    args: 'config --get user.email',
    quiet: false
} ) );

/**
 * Obtém o nome da branch atual
 *
 * @returns {Promise} - uma promise
 */
const getCurrentBranchAsync = Promise.promisify( git.exec.bind( git, {
    args: 'rev-parse --abbrev-ref HEAD',
    quiet: false
} ) );

/**
 * Tenta obter o username de um usuário à partir de seu email no git.
 *
 * @param {String} email - o email do usuário no git
 *
 * @returns {Promise} - uma promise
 */
const getUsernameAsync = ( email ) => {
    return new Promise( ( resolve, reject ) => {
        const query = {
            q: `${email} in:email`
        };

        github.client()
              .get( '/search/users', query, ( err, res, body ) => {
                  if ( err ) {
                      reject( gutil.colors.red( `Error: ${err}` ) );
                  } else {
                      const user = body.items[ 0 ];
                      resolve( user ? user.login : null );
                  }
              } );
    } );
};

/**
 * Executa o prompt que pede ao usuário suas credenciais no github: username e password
 *
 * obs: Só exibe o prompt de username se um username não tiver sido fornecido.
 *
 * @param {String} [username] - O username do usuário
 *
 * @returns {Promise} - uma promise
 */
const prompCredentialsAsync = ( username ) => {
    return new Promise( ( resolve ) => {
        const questions = [
            {
                type: 'input',
                message: 'Digite seu username do github',
                name: 'username',
                default: username,
                validate: ( input ) => {
                    return input !== ''; // obrigatório
                },
                when: () => {
                    return !username; // Só exibe o prompt de username se um username não tiver sido fornecido.
                }
            }, {
                type: 'password',
                message: 'Digite sua senha do github',
                name: 'password',
                validate: ( input ) => {
                    return input !== ''; // obrigatório
                }
            }
        ];

        inquirer.prompt( questions, ( answers ) => {
            resolve( {
                username: answers.username || username,
                password: answers.password
            } );
        } );
    } );
};

/**
 * Autentica o usuário na api do github.
 *
 * @param {Object} tokenOrCredentials - Um token de autenticação ou as credenciais(login e senha)
 * informados pelo usuário
 *
 * @returns {Promise} - uma promise
 */
const authenticateAsync = ( tokenOrCredentials ) => {
    return new Promise( ( resolve, reject ) => {

        // cria client node para api do github, usando credenciais do usuário
        client = github.client( tokenOrCredentials );

        // tenta fazer um requisição que necessita de autenticação para poder verificar
        // o sucesso da mesma
        client.get( '/user', {}, ( err, status, body, headers ) => { //eslint-disable-line no-unused-vars
            if ( err ) {
                reject( `${gutil.colors.red( 'autenticação no github falhou! ' )} resposta do server: ${gutil.colors.yellow( err )}` );
            }
            resolve( gutil.colors.green( 'Autenticou no github com sucesso!' ) );
        } );
    } );
};


// no-op = empty function
gulp.task( 'noop', false, ( cb ) => {
    cb();
} );


gulp.task( 'ensures-develop', false, ( cb ) => {

    /**
     * Loga o erro encontrado.
     *
     * @param {String} err - o erro disparado
     *
     * @returns {void}
     */
    const onError = err => {
        gutil.log( gutil.colors.red( err ) );
    };

    /**
     * Dispara um erro se a branch atual não se chamar config.developBranch
     *
     * @param {String} branch - o nome da branch atual
     *
     * @returns {void}
     */
    const throwErrorIfNotInMaster = branch => {
        if ( branch.trim() !== config.developBranch ) {
            throw new Error( `Branch atual: "${branch.trim()}". Acão permtida somente na branch de desenvolvimento: "${config.developBranch}".` );
        }
        cb();
    };

    getCurrentBranchAsync().then( throwErrorIfNotInMaster )
                           .catch( onError );
} );

gulp.task( 'ensures-master', false, ( cb ) => {

    /**
     * Loga o erro encontrado.
     *
     * @param {String} err - o erro disparado
     *
     * @returns {void}
     */
    const onError = err => {
        gutil.log( gutil.colors.red( err ) );
    };

    /**
     * Dispara um erro se a branch atual não se chamar config.masterBranch
     *
     * @param {String} branch - o nome da branch atual
     *
     * @returns {void}
     */
    const throwErrorIfNotInMaster = branch => {
        if ( branch.trim() !== config.masterBranch ) {
            throw new Error( `Branch atual: "${branch.trim()}". Só é possível criar um release da branch "${config.masterBranch}".` );
        }
        cb();
    };

    getCurrentBranchAsync().then( throwErrorIfNotInMaster )
                           .catch( onError );
} );

gulp.task( 'ensures-release-branch', false, ( cb ) => {

    /**
     * Loga o erro encontrado.
     *
     * @param {String} err - o erro disparado
     *
     * @returns {void}
     */
    const onError = err => {
        gutil.log( gutil.colors.red( err ) );
    };

    /**
     * Dispara um erro se a branch atual não se chamar config.masterBranch
     *
     * @param {String} branch - o nome da branch atual
     *
     * @returns {void}
     */
    const throwErrorIfNotInReleaseBranch = branch => {
        if ( !branch.trim().startsWith( 'release-' ) ) {
            throw new Error( `Branch atual: "${branch.trim()}". Só é possível preparar um release estando numa release branch (release-*).` );
        }
        cb();
    };

    getCurrentBranchAsync().then( throwErrorIfNotInReleaseBranch )
                           .catch( onError );
} );

gulp.task( 'bump', false, ( cb ) => {
    runSequence( 'bump-npm', 'bump-cordova', cb );
} );

gulp.task( 'bump-cordova', false, ( cb ) => {
    const pkg = readJsonFile( config.paths.packageJson );

    gulp.src( config.paths.cordovaConfig )
        .pipe( cheerio( {
            parserOptions: {
                xmlMode: true
            },
            run: ( $ ) => {
                $( 'widget' ).attr( 'version', pkg.version );
            }
        } ) )
        .pipe( gulp.dest( './' ) )
        .on( 'end', cb );
} );

gulp.task( 'bump-npm', false, ( cb ) => {
    let bumpType = 'patch';

    if ( argv.patch ) {
        bumpType = 'patch';
    }
    if ( argv.minor ) {
        bumpType = 'minor';
    }
    if ( argv.major ) {
        bumpType = 'major';
    }
    if ( argv.prerelease ) {
        bumpType = 'prerelease';
    }
    bumpType = process.env.BUMP || bumpType;

    let version = argv.version;

    gulp.src( config.paths.packageJson )
        .pipe( gulpif( version !== undefined, bump( {
            version: version
        } ), bump( {
            type: bumpType
        } ) ) )
        .pipe( gulp.dest( './' ) )
        .on( 'end', cb );
} );

gulp.task( 'commit', false, () => {
    const pkg = readJsonFile( config.paths.packageJson );
    const message = `feat(bump): Atualiza versão para ${pkg.version}`;

    return gulp.src( [ config.paths.packageJson, config.paths.cordovaConfig ] )
        .pipe( git.commit( message ) );
} );

gulp.task( 'tag', false, [ 'ensures-master' ], ( cb ) => {
    const pkg = readJsonFile( config.paths.packageJson );
    const v = `v${pkg.version}`;
    const message = pkg.version;

    git.tag( v, message, ( err ) => {
        if ( err ) {
            throw new Error( err );
        }
        cb();
    } );
} );

gulp.task( 'push', false, [ 'ensures-master' ], ( cb ) => {
    git.push( 'origin', config.masterBranch, ( err ) => {
        if ( err ) {
            throw new Error( err );
        }
        cb();
    } );
} );

gulp.task( 'push-tags', false, [ 'ensures-master' ], ( cb ) => {
    git.push( 'origin', config.masterBranch, { args: '--tags' }, ( err ) => {
        if ( err ) {
            throw new Error( err );
        }
        cb();
    } );
} );

gulp.task( 'create-release-branch', true, [ 'ensures-develop', 'bump' ], ( cb ) => {
    const pkg = readJsonFile( config.paths.packageJson );
    const branchName = `release-v${pkg.version}`;

    git.checkout( branchName, { args: '-b' }, ( err ) => {
        if ( err ) {
            throw new Error( err );
        }
        runSequence( 'commit', cb );
    } );
} );

gulp.task( 'changelog', true, ( cb ) => {
    const pkg = readJsonFile( config.paths.packageJson );
    const options = argv;
    const version = options.version || pkg.version;
    const from = options.from || '';

    gulp.src( '' )
        .pipe( gulpExec( `node ./gulp/helpers/changelog-script.js ${version} ${from}`, {
            pipeStdout: true
        } ) )
        .pipe( concat( 'updates.md' ) )
        .pipe( addSrc( 'CHANGELOG.md' ) )
        .pipe( order( [ 'updates.md', 'CHANGELOG.md' ] ) )
        .pipe( concat( 'CHANGELOG.md' ) )
        .pipe( gulp.dest( './' ) )
        .on( 'end', cb );
} );

gulp.task( 'github:authenticate', false, [ 'ensures-master' ], () => {
    const authToken = process.env.GITHUB_AUTH_TOKEN;

    if ( authToken ) {
        gutil.log( gutil.colors.blue( 'Autenticando no Github via token contido em "process.env.GITHUB_AUTH_TOKEN"' ) );
        return authenticateAsync( authToken ).tap( gutil.log );
    } else {
        return getEmailAsync().then( getUsernameAsync )
								.then( prompCredentialsAsync )
								.then( authenticateAsync )
								.tap( gutil.log );
    }
} );

gulp.task( 'github:create-release', false, [ 'ensures-master', 'github:authenticate' ], () => {
    const pkg = readJsonFile( config.paths.packageJson );
    const v = `v${pkg.version}`;
    const isPrerelease = !!semver.parse( pkg.version ).prerelease.length;

    return gulp.src( config.paths.changelog )
               .pipe( tap( ( file ) => {
                   let releaseBody = file.contents.toString();
                   const release = {
                       'tag_name': v,
                       'name': v,
                       'target_commitish': config.masterBranch,
                       'body': releaseBody.slice( releaseBody.indexOf( '###' ) ),
                       'prerelease': isPrerelease
                   };
                   client.post( '/repos/prodest/es-na-palma-da-mao-mobile/releases', release, ( err, res, body ) => { // eslint-disable-line no-unused-vars
                       if ( err ) {
                           gutil.log( gutil.colors.red( `Error: ${err}` ) );
                       } else {
                           del( config.paths.changelog );
                       }
                   } );
               } ) );
} );

gulp.task( 'delay', false, ( cb ) => {
    setTimeout( cb, 3000 );
} );

gulp.task( 'create-release', 'Cria e publica uma nova release no Github e faz upload do changelog.', ( cb ) => {
    return runSequence( 'ensures-master', 'test', 'changelog', 'tag', 'push', 'push-tags', 'delay', 'github:create-release', cb );
} );

gulp.task( 'tree-shaking', false, shell.task( [ 'find ./www -regex ".*\\.ttf$" -delete -or -regex ".*\\.svg$" -delete -or -regex ".*\\.eot$" -delete -or -regex ".*\\.map$" -delete' ] ) );

gulp.task( 'create-apk', true, shell.task( [
    'cordova build android --release -- --keystore=espm.keystore --storePassword=' + argv.password + ' --alias=espm --password=' + argv.password
] ) );


