
# ES na palma da mão
[![Build Status][travis-image]][travis-url] 
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coveralls-image]][coveralls-url]
[![Gitter][gitter-image]][gitter-url]

> O **ES NA PALMA DA MÃO** é um programa do **Governo do Estado do Espírito Santo** que reúne **iniciativas e serviços do Governo em plataforma móvel (aplicativo) e web, com unidade de experiência do cidadão**. Por meio do **ES NA PALMA DA MÃO**, diversos serviços governamentais podem ser acessados através da web e dispositivos móveis (sistemas operacionais iOS e Android) utilizando uma interface comum.

[Apresentação @ Slideshare](http://www.slideshare.net/rcolnago2/es-na-palma-da-mo-governo-mobile)

==================================================================================

<a href="https://play.google.com/store/apps/details?id=br.gov.es.prodest.espm&referrer=utm_source%3Dgithub%26utm_medium%3Dreadme">
<img src="https://play.google.com/intl/en_us/badges/images/generic/pt-br_badge_web_generic.png" width="30%" />
</a>

## Tabela de Conteúdo
- [Tecnologias utilizadas](#what-s-included)
    - [SystemJS](#systemjs)
    - [JSPM](#jspm)
    - [AngularJS](#angularjs)
    - [UI Router](#ui-router)
    - [UI Router Extras](#ui-router-extras)
    - [ocLazyLoad](#oclazyload)
    - [Babel](#babel)
    - [Gulp](#gulp)
- [Gulp tasks](#gulp-tasks)
    - [help](#help)
    - [default](#default)
    - [run](#run)
    - [recompile](#recompile)
    - [compile](#compile)
    - [html](#html)
    - [css](#css)
    - [babel](#babel)
    - [json](#json)
    - [assets](#assets)
    - [eslint-src](#eslint-src)
    - [eslint-gulp](#eslint-gulp)
    - [index.html](#index.html)
    - [serve](#serve)
    - [watch](#watch)


## Tecnologias utilizadas
Essas são as principais ferramentas, *frameworks* e *libraries* que dão suporte ao projeto:

### [SystemJS](https://github.com/systemjs/systemjs)

SystemJS é um carregador universal de módulos. Construído *sobre* o recém-lançado ECMAScript 2015, que torna mais fácil a modularização do código *client side* bem 
como o carregamento dinâmico desses módulo sobre demanda. Como a maioria dos navegadores ainda não implementa nativamente um sistema de carregamento de
módulos, o SystemJS usa o [ES2015 Module Loader Polyfill](https://github.com/ModuleLoader/es6-module-loader) "por baixo dos panos" para preencher essa lacuna.

AMD e Commonjs ainda são os sistemas de módulos mais utilizados. SystemJS implementa *adapters* para esses sistemas de módulos de forma que permita a
utilização de bibliotecas populares como AngularJS ou Lodash que ainda não utilizam a nova sintaxe de importação/exportação do ECMAScript 2015. Como SystemJS
entende qualquer um desses formatos: ES6, CommonJS, AMD e global, ganha-se, junto com o carregamento assícrono que o SystemJS oferece, a flexibilidade de
escrever o código na maneira que seja mais confortável para o desenvolvedor.

### [JSPM](https://jspm.io)
[NPM](https://www.npmjs.com) é um excelente gerenciador de pacotes mas foi inicialmente projetado para ser usado no lado do servidor. Ainda não
existe uma maneira direta de carregar módulos npm no browser em *runtime*. JSPM facilita esse processo e também sobrescreve algumas propriedades do
package.json quando necessário, como por exemplo o campo *main*.  


### [AngularJS](https://angularjs.org)
AngularJS é um framework estrutural para aplicações web dinâmicas.

### [UI Router](http://angular-ui.github.io/ui-router/)
O Router nativo do Angular vem com uma série de limitações, como por exemplo a ausência de suporte para views aninhadas. UI Router permite essa e muitas
outras facilidades, e por isso tem se tornado, de fato, o router padrão das aplicações Angular.

### [UI Router Extras](http://christopherthielen.github.io/ui-router-extras)
UI Router Extras adiciona ainda mais funcionalidades para o router do UI Router. A mais importante delas é 
[Future States](http://christopherthielen.github.io/ui-router-extras/#/future) a qual nos permite descrever, de forma abstrata,
o que os *states* da aplicação são e onde o código para eles reside, sem na realidade carrega-lós. O *state* é então
carregado tardiamente(lazy load) em *runtime*, quando o  usuário tenta acessá-lo pela primeira vez. Permite, por exemplo, o carregamento de 
states definidos num arquivo JSON montado dinâmicamente.

### [ocLazyLoad](https://oclazyload.readme.io)
Por padrão, o Angular nos obriga o carregamento de toda a aplicação antes da inicialização(boot). Isso funciona bem para aplicações pequenas.
Para aplicações grandes, essa abordagem introduz um tempo alto de carregamento que impacta negativamente na experiência do usuário, além de obrigar
o carregamento de partes da aplicação que não são acessadas com frequência pelo usuário. ocLazyLoad permite
o carregamento de módulos para o Angular em tempo de execução.

### [Babel](http://babeljs.io/)
Nem todas as *features* do ES2105 já são suportados pelos browsers. Babel nos permite desfrutar de todas as novas características da linguage hoje,
covertendo código ES6 em código equivalente em ES5.

### [Gulp](http://gulpjs.com)
O automatizador de tarefas de build da aplicação. Veja as tarefas definidas para o projeto em [Gulp tasks](#gulp-tasks).


## Gulp tasks

Cada gulp task é implementada como uma *receita* que pode ser reaproveitada. Cada uma dessas *receitas* reside no seu próprio arquivo, tornando mais
fácil a navegação até seu código fonte, melhorando a mantenabilidade, bem como clarificando quais as dependências cada task possui.

### help

> $: gulp help

Exibe a lista de tasks definidas na aplicação, bem como suas descrições e opções de configuração.

### default

> $: gulp

Atalho para [run](#run)


### run

> $: gulp run

Atalho para [recompile](#recompile) ➔ [eslint](#eslint) ➔ [index.html](#index.html) ➔ [serve](#serve) ➔ [watch](#watch) 


### recompile

> $: gulp recompile

Atalho para [clean](#clean) ➔ [compile](#compile) 

### clean

> $: gulp clean

Limpa diretório/arquivos para onde será copiada a aplicação compilada


### compile

> $: gulp compile

Atalho para [css](#css) ➔ [html](#html) ➔ [babel](#babel) ➔ [json](#json) ➔ [assets](#assets) 


### css

> $: gulp css

Aplica transformações(autoprefixer) no CSS e copia para pasta destino.


### html

> $: gulp html

Copia arquivos .html para pasta destino.


### babel

> $: gulp babel

Compila ES6 => ES5 e copia para pasta destino.


### json

> $: gulp json

Copia arquivos .json para pasta destino.


### assets

> $: gulp assets

Copia imagens e fontes para pasta destino.


### eslint-src

> $: gulp eslint-src

Realiza uma análize de qualdade de código Javascript da aplicação usando [ESLint](http://eslint.org/). Verifica se o código se conforma
com o *code style* [Idiomatic Code Style](https://github.com/rwaldron/idiomatic.js/) e exibe erros e warnings.

### eslint-gulp

> $: gulp eslint-gulp

Realiza uma análize de qualdade do código relacionado a automação de build (gulpfile,  gulp tasks, etc) usando [ESLint](http://eslint.org/). Verifica se o código se conforma
com o *code style* [Idiomatic Code Style](https://github.com/rwaldron/idiomatic.js/) e exibe erros e warnings.


### index.html

> $: gulp index.html

Copia o arquivos principa da aplicação *index.tpl.html* para pasta destino e o renomeia para *index.html*.


### serve

> $: gulp serve

Inicia um servidor [nodemon](http://nodemon.io/) para servir a aplicação com [browser Sync](https://www.browsersync.io/) configurado.

### watch

> $: gulp watch

Inicia um *watcher* que compila a aplicação sempre que o código muda.

[travis-image]: http://travis-ci.org/prodest/es-na-palma-da-mao-mobile.svg
[travis-url]: https://travis-ci.org/prodest/es-na-palma-da-mao-mobile
[daviddm-image]: http://david-dm.org/prodest/es-na-palma-da-mao-mobile/dev-status.svg
[daviddm-url]: https://david-dm.org/prodest/es-na-palma-da-mao-mobile?type=dev
[coveralls-image]: http://coveralls.io/repos/github/prodest/es-na-palma-da-mao-mobile/badge.svg?branch=develop
[coveralls-url]: https://coveralls.io/github/prodest/es-na-palma-da-mao-mobile?branch=develop
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000
[gitter-url]: https://gitter.im/es-na-palma-da-mao/Lobby#
