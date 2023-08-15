EXEC = bun x

INDEX_FILES := $(shell find . -name 'index.css')
BUNDLE_FILES := $(INDEX_FILES:%/index.css=%/bundle.css)

all: scale.css lint bundle

.PHONY: lint
lint:
	$(EXEC) stylelint --fix --ignore-pattern bundle.css '**/*.css'

%.css: %.scss lib/_%.scss
	$(EXEC) sass --no-charset --no-source-map --no-error-css -I . '$<' '$@'
	@sed -i.bak 's/^\(\t*\)  /\1\t/g' '$@'
	$(EXEC) stylelint --fix '$@'
	@rm '$@.bak'

bundle: $(BUNDLE_FILES)

# Ideally, this could resolve dependencies based on the adajacent files and
# directories; I have no idea how to write this though
.PHONY: $(BUNDLE_FILES)

$(BUNDLE_FILES):
	$(EXEC) postcss -u postcss-import -o $@ $(@D)/index.css
