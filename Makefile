exec = bun x

.PHONY=all
all:
	@make scale.css
	@make lint

.PHONY=lint
lint:
	$(exec) stylelint --fix '**/*.css'

%.css: %.scss lib/_%.scss
	$(exec) sass --no-charset --no-source-map --no-error-css -I . '$<' '$@'
	@sed -i.bak 's/^\(\t*\)  /\1\t/g' '$@'
	$(exec) stylelint --fix '$@'
	@rm '$@.bak'
