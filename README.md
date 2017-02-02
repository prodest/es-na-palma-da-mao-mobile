
# ES na palma da mão
[![Build Status][travis-image]][travis-url] 
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coveralls-image]][coveralls-url]
[![Gitter][gitter-image]][gitter-url]

> O **[ES NA PALMA DA MÃO](http://www.slideshare.net/rcolnago2/es-na-palma-da-mo-governo-mobile)** é um programa do **Governo do Estado do Espírito Santo** que reúne **iniciativas e serviços do Governo em plataforma móvel (aplicativo) e web, com unidade de experiência do cidadão**. Por meio do **ES NA PALMA DA MÃO**, diversos serviços governamentais podem ser acessados através da web e dispositivos móveis (sistemas operacionais iOS e Android) utilizando uma interface comum.

===============================================================================================================================

**Demos online**

> Clique [aqui](http://prodest.github.io/es-na-palma-da-mao-mobile/latest) para ver o demo da última versão, online. Para as demais versões (a partir da 3.3.2), substitua "latest" por "old/${versão desejada}" na url do demo online. Por exemplo: [Versão v3.3.0](http://prodest.github.io/es-na-palma-da-mao-mobile/old/v3.3.2)

===============================================================================================================================

<a href="https://play.google.com/store/apps/details?id=br.gov.es.prodest.espm&referrer=utm_source%3Dgithub%26utm_medium%3Dreadme">
<img src="https://play.google.com/intl/en_us/badges/images/generic/pt-br_badge_web_generic.png" width="230px" />
</a>

<a href="https://itunes.apple.com/br/app/es-na-palma-da-mao/id1154273691?mt=8" style="display: inline-block; overflow: hidden; background: url('https://linkmaker.itunes.apple.com/assets/shared/badges/pt-br/appstore-lrg.svg') no-repeat; background-size: contain; width: 200px; height: 60px; margin: 0 14px;"></a>

**Tabela de Conteúdo**  

- [Principais Tecnologias Utilizadas](#principais-tecnologias-utilizadas)
	- [Typescript](#typescript)
	- [angularJS](#angularjs)
	- [UI-Router](#ui-router)
	- [Ionic](#ionic)
	- [webpack](#webpack)
	- [Gulp](#gulp)
  - [Sass](#sass)
- [Visão Geral](#visão-geral)
	- [Build System](#build-system)
	- [Estrutura de arquivos](#estrutura-de-arquivos)
	- [Configuração de testes](#configuração-de-testes)
- [Passo a passo](#passo-a-passo)
	- [Dependências](#dependências)
	- [Instalando](#instalando)
	- [Executando](#executando)
		- [Tasks](#tasks)
		- [Testes](#testes)
	- [Gerando componentes](#gerando-componentes)

# Principais Tecnologias Utilizadas
Essas são as principais ferramentas, *frameworks* e *libraries* que dão suporte ao projeto:

## [Typescript](https://www.typescriptlang.org/)
TypeScript é uma linguagem para desenvolvimento JavaScript em larga escala. 
Com TypeScript podemos escrever código utilizando uma estrutura fortemente tipada e ter este código compilado para JavaScript puro. 
Nem todas as features do ES2105 já são suportados pelos browsers. TypeScript permite desfrutar de todas as novas características da linguage hoje, 
covertendo código ES2105 em código equivalente em ES5. Qualquer navegador. Qualquer host.

## [angularJS](https://angularjs.org)
angularJS é um framework estrutural para aplicações web dinâmicas.


## [UI-Router](http://angular-ui.github.io/ui-router/)
O Router nativo do Angular vem com uma série de limitações, como por exemplo a ausência de suporte para views aninhadas. UI Router permite essa e muitas
outras facilidades, e por isso tem se tornado, de fato, o router padrão das aplicações Angular.

## [Ionic](http://ionicframework.com/)
Ionic é um framework que visa a criação de aplicações híbridas para dispositivos móveis. 
Ele nada mais é do que uma pilha de componentes e outros frameworks como angularJS e ui-router.

## [webpack](https://github.com/systemjs/systemjs)

webpack é um empacotador de módulos (javascript e cia) que cria bundles de assets à partir das dependências(assets) 
do projeto.

## [Sass](http://sass-lang.com/)

SASS é uma poderosa extensão da linguagem CSS que permite uma escrita profissional e completa das folhas de estilo de forma muito 
mais dinâmica e produtiva. 

1. Permite fazer o pré-processamento de arquivos “diferentes” (coffee, es6, ts, sass, less, jade, imagens, etc) que 
os tornam “utilizáveis” através de função require() ou import(ES2015);
2. Possibilidade de carregar dependências sob demanda (code splitting), sem precisar
colocar tudo num grande e pesado bundle.

## [Gulp](http://gulpjs.com)
O automatizador de tarefas de build da aplicação.

# Visão Geral
## Build System
O *build system* do **ES na Palma da Mão** usa yarn scripts, Gulp, and Webpack juntos.

`Webpack` trata das seguintes questões:
* Transpila código typescript para ES2015
* Carrega arquivos HTML como módulos
* Transpila .scss em .css e o adiciona ao DOM
* Atualiza o browser e recompila se arquivos são alterados
* Hot module replacement para CSS
* Gera o *bundle* da aplicação
* Carrega todos os módulos
* Faz todos os passos acima para `*.specs.ts` também

`Gulp`:
* Gera componentes para a aplicação em tempo de desenvolvimento usando o padrão e estilo adotado
no **ES na Palma da Mão** (diminui repetição de digitação e erros)

`yarn scripts`:
* Chamadas às todas a tarefas úteis em tempo de desenvolvimento. Encapsula chamadas ao webpack e gulp, além de outras Leia mais [abaixo](#tasks).

## Estrutura de arquivos
Utilizamos uma abordagem componentizada no **ES na Palma da Mão**. Este será o padrão final, 
bem como uma ótima maneira de garantir uma transição mais suave para o Angular 2 quando este estiver maduro.
Tudo - ou quase tudo - é um componente. Um componente é autônomo - pode ser uma "feature" ou elemento bem definido da UI (como um cabeçalho,
rodapé, etc). Uma característica de um componente é que ele é auto-contido, usando suas próprias folhas de estilo, modelos, controladores, rotas,
serviços e especificações. Esta encapsulação nos permite o conforto de isolamento e localidade estrutural. Aqui está como a app está estruturada:

```
src
..index.html
..main.ts           * ponto de entrada da app
..app/
....app.component.controller.ts         /* controller da app
....app.component.scss                   
....app.component.html                  
....app.component.ts                    
....app.module.ts                       /* módulo principal da app  (registra rotas, componentes, serviços, etc)
....vendors.ts                          
....shared/     * funconalidades compartilhadas pelas features
....featureA/
......shared/       * funcionalidades compartilhadas dentro da feature
......featureA.component.controller.ts 
......featureA.component.scss 
......featureA.component.html
......featureA.component.ts
......featureA.module.ts  
....featureB/
......shared/      
......featureB.component.controller.ts 
......featureB.component.scss 
......featureB.component.html
......featureB.component.ts
......featureB.module.ts 
....featureC/
......shared/      
......featureC.module.ts     * modulo da feature (registra rotas, componentes, serviços, etc)
......subFeatureC1/
........subFeatureC1.component.controller.ts 
........subFeatureC1.component.scss 
........subFeatureC1.component.html
........subFeatureC1.component.ts
......subFeatureC2/
........subFeatureC2.component.controller.ts 
........subFeatureC2.component.scss 
........subFeatureC2.component.html
........subFeatureC2.component.ts
.
.
.
```

## Configuração de testes
Todos os testes também são escritos em Typescript. Usamos o Webpack para cuidar da logística de fazer com que esses arquivos sejam executados. 
Esta é a nossa *stack* de testes:

* Karma
* Webpack
* Mocha
* Chai
* SinonJS

Para rodar os testes, digite `yarn test` no terminal. Leia mais sobre testes [abaixo](#testes).

# Começando
## Dependências
Ferramentas necessárias para rodar a aplicação:
* `node` and `yarn`

## Instalando
1. `fork` este repositório
2. `clone` o seu fork
3. execute o comando `yarn` para instalar as dependências

## Executando

O **ES na Palma da Mão** usa webpack para compilar a aplicação e executar o ambiente de desenvolvimento.
Depois de instaladas todas as dependências, você deve *rodar* a aplicação. O comando `yarn server:start` irá usar
o `webpack` para compilar e gerar um *bundle* a aplicação, *subir* um servidor de desenvolvimento e *escutar* por alterações
em todos os arquivos. A porta usada é a 3000.
 
### Tasks
Lista de *task* disponíveis, executadas com o comando `yarn nome-da-task`: 

 * `rimraf`,
    * Referência local à biblioteca rimraf.
 * `clean:packages`
    * Limpa a pasta *node_modules*.
 * `clean:coverage`
    * Limpa a pasta *coverage* (pasta com a saída do relatório de code coverage).
 * `clean:build`
    * Limpa a pasta *www* (pasta com resultado do build).
 * `clean:cache`
    * Limpa cache do yarn e do loader *awesome-typescript* do webpack.
 * `clean`
    * Limpa caches, build, coverage e packages.
 * `reinstall`
    * Limpa a pasta *node_modules* e reinstala dependências.
 * `tslint`
    * Executa *tslint* nos arquivos typescript dentro de *src/app*.
 * `htmlhint`
    * Executa *htmlhint* nos arquivos html dentro de *src/app*.
 * `lint`
    * Executa tasks *tslint* e *htmlhint* paralelamente.
 * `pretest`
    * Task executada automaticamente antes da task *test*. Executa task *tslint*
 * `test`
    * Executa testes usando *karma*
 * `test:watch`
    * Executa testes usando *karma* e fica *escutando* por alterações. Re-executa os testes algum arquivo for modificado.
 * `pretest:coverage`
    * Task executada automaticamente antes da task *test:coverage*. Limpa pasta *coverage*
 * `test:coverage`
    * Executa testes usando *karma* e gera relatório de *code coverage*
 * `test:coverage:watch`
    * Executa testes usando *karma* e gera relatório de *code coverage* e fica *escutando* por alterações. Re-executa os testes algum arquivo for modificado.
 * `test:coverage:all`
    * Executa testes usando *karma* e gera relatório de *code coverage*. Considera **todos** os arquivos da app no relatório, e não somente os referenciados nos testes.
 * `test:coverage:all:watch`
    * Executa testes usando *karma* e gera relatório de *code coverage* e fica *escutando* por alterações. Considera **todos** os arquivos da app no relatório, e não somente os referenciados nos testes.
 * `webpack`
    * Executa webpack com indicador de progresso do build
 * `webpack-dev-server`
    * Executa o dev server do webpack
 * `build:debug`
    * Executa task *webpack* adicionalmente exibindo detalhamento dos bundles
 * `build:vendor`
    * Executa webpack (com indicador de progresso) para realizar o build parcial (arquivos de vendors)
 * `build:dev:app`
    * Executa webpack (com indicador de progresso) para realizar o build parcial (arquivos do espm), usando configuração de desenvolvimento
 * `prebuild:dev`
    * Task executada automaticamente antes da task *build:dev*. Limpa pasta *www*
 * `build:dev`
    * Executa webpack (com indicador de progresso) para realizar o build completo(vendor + espm), usando configuração de desenvolvimento
 * `prebuild:stats`
    * Task executada automaticamente antes da task *build:stats*. Executa build de desenvolvimento.
 * `build:stats`
    * Executa webpack (com indicador de progresso) para realizar o build completo(vendor + espm), usando configuração de desenvolvimento e em seguida exibe estatísticas
    a respeitos dos bundles ( vendors e app) gerados.
 * `build:prod:app`
   * Executa webpack (com indicador de progresso) para realizar o build parcial (arquivos do espm), usando configuração de produção
 * `prebuild:prod`,
    * Task executada automaticamente antes da task *build:prod*. Limpa pasta *www*
 * `build:prod`
    * Executa webpack (com indicador de progresso) para realizar o build completo(vendor + espm), usando configuração de produção
 * `build`
    * Executa task *build:prod* 
 * `preserver:restart`
    * Task executada automaticamente antes da task *server:restart*. Abre navegador
 * `server:restart`
    * Executa dev server do webpack (com indicador de progresso) para realizar o build parcial (arquivos do espm), usando configuração de desenvolvimento
 * `preserver:start`
    * Task executada automaticamente antes da task *server:start*. Abre navegador
 * `server:start`
    * Executa dev server do webpack (com indicador de progresso) para realizar o build completo(vendor + espm), usando configuração de desenvolvimento
 * `server:`
    * Executa task *server:start 
 * `server:hmr:restart`
    * Executa dev server do webpack (com HMR habilitado e indicador de progresso) para realizar o build parcial (arquivos do espm), usando configuração de desenvolvimento
 * `preserver:hmr:start`
    * Task executada automaticamente antes da task *server:hmr:restart*. Limpa pasta *www*
 * `server:hmr:start`
    * Executa dev server do webpack (com HMR habilitado e indicador de progresso) para realizar o build completo (spm + vendor), usando configuração de desenvolvimento
 * `show:build`
    * Inicia um servidor local para servir arquivos na pasta *www* (build)
 * `show:coverage`
    * Inicia um servidor local para servir relatório de code coverage como páginas html
 * `show:stats:app`
    * Exibe estatísticas do bundle contendo código da app. Obs: requer que o bundle da app tenha sido gerado previamente.
 * `show:stats:vendors`
    * Exibe estatísticas do bundle contendo código de terceiros usados na app. Obs: requer que o bundle de vendors tenha sido gerado previamente.
 * `github:release`
    * Executa script que gera um novo release da aplicação e faz upload pro github
 * `component`
    * Cria um novo componente simples. [Leia abaixo](#generating-components) para detalhes.-->
 * `state`
    * Cria um novo componente roteado. [Leia abaixo](#generating-components) para detalhes.-->

### Testes
Para executar os testes, rode `yarn test`.

Para executar os testes e ficar *escutando* por alterações no código ou nos testes, rode `yarn test:watch`.

Para executar os testes exibindo relatório de cobertura de código no terminal, rode `yarn test:coverage`.

Para executar os testes exibindo relatório de cobertura de código no terminal, e ficar *escutando* por alterações 
no código ou nos testes, rode `yarn test:coverage:watch`.

`Karma` combinado com Webpack executa todos os arquivos `*.specs.ts` dentro da pasta `app`. Isso nos permite manter os testes próximos ao componentes(incentivando modularidade).
Certifique-se de definir seus arquivos `*.specs.ts` dentro dos diretórios de seus respectivos componentes. 

`Mocha` é a suíte de testes.

`Chai` é a biblioteca de *assertions*.

## Gerando componentes

Devido à previsibilidade proporcionada pela estrutura de diretórios consistente do projeto, podemos usar
as tasks automatizadas para gerar componentes com a seguinte estrutura:

```
⋅⋅⋅⋅⋅⋅componentName/
⋅⋅⋅⋅⋅⋅⋅⋅componentName.module.ts               // modulo que registra o componente no angular
⋅⋅⋅⋅⋅⋅⋅⋅componentName.component.ts            // ponto de entrada do componente (carrega todas as dependências)
⋅⋅⋅⋅⋅⋅⋅⋅componentName.component.controller.ts // controller do component
⋅⋅⋅⋅⋅⋅⋅⋅componentName.component.specs.ts      // unit tests do component
⋅⋅⋅⋅⋅⋅⋅⋅componentName.component.html                    
⋅⋅⋅⋅⋅⋅⋅⋅componentName.component.scss           //.scss com style que se aplica somente ao componente
```

Para gerar um componente, execute `yarn component -- --name componentName` para componentes que representam rotas(routed components) ou
`yarn state -- --name componentName` para gerar componentes simples.

O parâmetro que segue o flag --name é o nome do componente a ser criado. Certifique-se de que é único ou então
o componente gerado substituirá o componente preexistente identicamente-nomeado.

O componente será criado, por padrão, dentro da pasta *src/app*. Para alterar isso, aplique o flag --parent, seguido
por um caminho relativo a *src/app*.

Por exemplo, executando `yarn component -- --name login --parent auth` irá criar um componente *src/app/auth/login*.

Executando `yarn component -- --name footer --parent common`, será criado um componente *footer* dentro *src/common*.

O nome do componente pode ser escrito em pascal-case, camel-case ou dash-case, e sempre será normalizado para
pascal-case( nomes dos controllers) e dash-case(nomes dos arquivos).


[travis-image]: http://travis-ci.org/prodest/es-na-palma-da-mao-mobile.svg
[travis-url]: https://travis-ci.org/prodest/es-na-palma-da-mao-mobile
[daviddm-image]: http://david-dm.org/prodest/es-na-palma-da-mao-mobile/dev-status.svg
[daviddm-url]: https://david-dm.org/prodest/es-na-palma-da-mao-mobile?type=dev
[coveralls-image]: http://coveralls.io/repos/github/prodest/es-na-palma-da-mao-mobile/badge.svg?branch=develop
[coveralls-url]: https://coveralls.io/github/prodest/es-na-palma-da-mao-mobile?branch=develop
[gitter-image]: https://img.shields.io/gitter/room/nwjs/nw.js.svg?maxAge=2592000
[gitter-url]: https://gitter.im/es-na-palma-da-mao/Lobby#
