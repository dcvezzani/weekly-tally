#!/bin/bash

if [ "$1" == "" ]; then
  echo "Usage ./prep.sh prod; ./prep.sh dev"
  exit 1
fi

if [ "$1" == "dev" ]; then
  sed -i -e 's#^[[:space:]]*baseURL: [^,]*,$#	baseURL: "http://10.0.0.236:3000/api/",#g' ../src/api.js ../src/App.vue
  sed -i -e 's#^[[:space:]]*<meta name="google-signin-client_id" content="[^"]*">[[:space:]]*$#		<meta name="google-signin-client_id" content="38977793520-u51b5kpvkfuokp2ev9vb3vllfkl6oaqo.apps.googleusercontent.com">#g' ../index.html
fi

if [ "$1" == "prod" ]; then
  sed -i -e 's#^[[:space:]]*baseURL: [^,]*,$#	baseURL: "https://reliacode.com/api/",#g' ../src/api.js ../src/App.vue
  sed -i -e 's#^[[:space:]]*<meta name="google-signin-client_id" content="[^"]*">[[:space:]]*$#		<meta name="google-signin-client_id" content="38977793520-2eute2ed36ddd4kjj6ss91d7vecsukpj.apps.googleusercontent.com">#g' ../index.html
fi


