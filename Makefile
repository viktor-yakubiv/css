.PHONY=all
all:
	@make scale.css

%.css: src/%.scss lib/_%.scss
	node_modules/.bin/sass --no-charset --no-source-map --no-error-css -I . $< $@
