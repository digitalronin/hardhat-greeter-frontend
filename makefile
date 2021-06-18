# https://lithic.tech/blog/2020-05/makefile-dot-env
ifneq (,$(wildcard ./.env))
	include .env
	export
endif


.PHONY: server
server: guard-REACT_APP_GREETER_CONTRACT_ADDRESS cmd-exists-npm
	npm start

# npm run build
# npm test

guard-%:
	@if [ -z '${${*}}' ]; then echo 'ERROR: variable $* not set' && exit 1; fi

cmd-exists-%:
	@hash $(*) > /dev/null 2>&1 || \
	  (echo "ERROR: '$(*)' must be installed and available on your PATH."; exit 1)
