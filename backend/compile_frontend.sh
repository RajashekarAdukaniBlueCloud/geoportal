#!/bin/bash

cd ../frontend/
npm run build.prod -- --scss
cp -fr dist/prod/* ../backend/WebContent/
cd ../backend/
sed -i -- 's/=\"\/css\//=\"css\//g' WebContent/index.html
sed -i -- 's/=\"\/js\//=\"js\//g' WebContent/index.html