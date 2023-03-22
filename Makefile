install: 
	npm ci

lint:
	npx eslint .

dev:
	npx webpack serve	

build:
	NODE_ENV=production npx webpack

