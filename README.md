
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
- [Tecnologias utilizadas](#tecnologias-utilizadas)
    - [Typescript](#typescript)
    - [angularJS (1.x.x)](#angularjs)
    - [UI-Router](#ui-router)
    - [Ionic (1.x.x)](#ionic)
    - [webpack](#webpack)
    - [Gulp](#gulp)

## Tecnologias utilizadas
Essas são as principais ferramentas, *frameworks* e *libraries* que dão suporte ao projeto:

### [Typescript](https://www.typescriptlang.org/)
TypeScript é uma linguagem para desenvolvimento JavaScript em larga escala. 
Com TypeScript podemos escrever código utilizando uma estrutura fortemente tipada e ter este código compilado para JavaScript puro. 
Nem todas as features do ES2105 já são suportados pelos browsers. TypeScript permite desfrutar de todas as novas características da linguage hoje, 
covertendo código ES2105 em código equivalente em ES5. Qualquer navegador. Qualquer host.

### [angularJS](https://angularjs.org)
angularJS é um framework estrutural para aplicações web dinâmicas.


### [UI-Router](http://angular-ui.github.io/ui-router/)
O Router nativo do Angular vem com uma série de limitações, como por exemplo a ausência de suporte para views aninhadas. UI Router permite essa e muitas
outras facilidades, e por isso tem se tornado, de fato, o router padrão das aplicações Angular.

### [Ionic](http://ionicframework.com/)
Ionic é um framework que visa a criação de aplicações híbridas para dispositivos móveis. 
Ele nada mais é do que uma pilha de componentes e outros frameworks como angularJS e ui-router.

### [webpack](https://github.com/systemjs/systemjs)

webpack é um empacotador de módulos (javascript e cia) que cria bundles de assets à partir das dependências(assets) 
do projeto.

1. Permite fazer o pré-processamento de arquivos “diferentes” (coffee, es6, ts, sass, less, jade, imagens, etc) que 
os tornam “utilizáveis” através de função require() ou import(ES2015);
2. Possibilidade de carregar dependências sob demanda (code splitting), sem precisar
colocar tudo num grande e pesado bundle.

### [Gulp](http://gulpjs.com)
O automatizador de tarefas de build da aplicação.


[travis-image]: http://travis-ci.org/prodest/es-na-palma-da-mao-mobile.svg
[travis-url]: https://travis-ci.org/prodest/es-na-palma-da-mao-mobile
[daviddm-image]: http://david-dm.org/prodest/es-na-palma-da-mao-mobile/dev-status.svg
[daviddm-url]: https://david-dm.org/prodest/es-na-palma-da-mao-mobile?type=dev
[coveralls-image]: http://coveralls.io/repos/github/prodest/es-na-palma-da-mao-mobile/badge.svg?branch=develop
[coveralls-url]: https://coveralls.io/github/prodest/es-na-palma-da-mao-mobile?branch=develop
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000
[gitter-url]: https://gitter.im/es-na-palma-da-mao/Lobby#
