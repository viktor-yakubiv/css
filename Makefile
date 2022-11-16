.PHONY=all
all:
	@make scale.css
	@make lint

lint:
	npm x stylelint --fix '**/*.css'

%.css: %.scss lib/_%.scss
	node_modules/.bin/sass --no-charset --no-source-map --no-error-css -I . '$<' '$@'
	@sed -i.bak 's/^\(\t*\)  /\1\t/g' '$@'
	node_modules/.bin/stylelint --fix '$@'
	@rm '$@.bak'
