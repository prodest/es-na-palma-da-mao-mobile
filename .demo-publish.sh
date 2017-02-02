#!/bin/bash
pwd && ls -a

yarn build

echo "Gerando demo online para versão $TRAVIS_TAG"

# copia build para fora do git
cp -Rf www /tmp/espm/

# muda para branch gh-pages
git checkout gh-pages

# limpa pasta que contém o build ad última versão
rm -rf latest

# copia arquivos build de volta para branch
cp -Rf /tmp/espm old/$TRAVIS_TAG 
cp -Rf /tmp/espm latest

# adiciona build ao git, comita, e faz o push
git add .
git -c user.name='travis' -c user.email='travis' commit -m "feat(geral): cria demo online para versão $TRAVIS_TAG"

# ref: http://stackoverflow.com/questions/23277391/how-to-publish-to-github-pages-from-travis-ci
# Make sure to make the output quiet, or else the API token will leak!
# This works because the API key can replace your password.
echo "Pushing to https://github.com/$TRAVIS_REPO_SLUG.git gh-pages"
               
git push -fq https://$GITHUB_API_KEY@github.com/$TRAVIS_REPO_SLUG.git gh-pages &2>/dev/null

echo "Deploy realizado com sucesso"
