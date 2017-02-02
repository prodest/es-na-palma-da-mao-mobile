#!/bin/bash
pwd && ls -a

echo ">>>> Compilando projeto:"
yarn build

echo ">>>> Gerando demo online para versão $TRAVIS_TAG:"

echo ">>>> Conteúdo da pasta www:"
ls www -la

echo ">>>> Copiando arquivos de www para /tmp/espm/:"
# copia build para fora do git
rm -rf /tmp/espm/
cp -rfv www /tmp/espm/

echo ">>>> Mudando para branch gh-pages:"
# muda para branch gh-pages
git checkout gh-pages

echo ">>>> Criando diretórios latest e old/$TRAVIS_TAG:"
# limpa pasta que contém o build ad última versão
rm -rf latest

# copia arquivos build de volta para branch
mkdir -p old/$TRAVIS_TAG 
mkdir -p latest 

echo ">>>> Copiando arquivos de volta, de /tmp/espm/ para www:"
cp -rfv /tmp/espm/** old/$TRAVIS_TAG
cp -rfv /tmp/espm/** latest

echo ">>>> Conteúdo da pasta latest:"
ls latest -la

echo ">>>> Conteúdo da pasta old/$TRAVIS_TAG:"
ls old/$TRAVIS_TAG -la

echo ">>>> Criando novo commit:"
# adiciona build ao git, comita, e faz o push
git add --all .
git -c user.name='travis' -c user.email='travis' commit -m "feat(geral): cria demo online para versão $TRAVIS_TAG"

# ref: http://stackoverflow.com/questions/23277391/how-to-publish-to-github-pages-from-travis-ci
# Make sure to make the output quiet, or else the API token will leak!
# This works because the API key can replace your password.
echo ">>>> Pushing to https://github.com/$TRAVIS_REPO_SLUG.git gh-pages"
               
git push -fq https://$GITHUB_API_KEY@github.com/$TRAVIS_REPO_SLUG.git gh-pages 

echo ">>>> Deploy realizado com sucesso"
