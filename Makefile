SHELL = /usr/bin/env bash

icons = icon128.png icon512.png
sources = background.js jquery-3.5.1.min.js LICENSE manifest.json theater-mode.css
all_sources = $(icons) $(sources)

jre-spotify-theater-mode.zip: $(all_sources)
	@# We explicitly remove old archives. We can obviously refresh and partially update the zip, but
	@# just in case we don't want to include something else we prevent unintentionally including things
	@# by building from scratch
	[ ! -f $@ ] || rm -f $@
	zip $@ $(all_sources)

icon.png: icon.afdesign
	rm -f icon.png
	@echo "Currently we need to manually force ourselves to export the image, we can't actually use the terminal with AffinityDesigner"
	@echo "Maybe replace AffinityDesigner with something else?"

$(icons): icon.png
	convert $? -resize $$(echo $@ | sed 's/[^0-9]*//g')x$$(echo $@ | sed 's/[^0-9]*//g') $@

# https://developer.spotify.com/documentation/general/design-and-branding/#using-our-logo
# https://stackoverflow.com/a/4320498/1478636
# https://linuxconfig.org/how-to-extract-a-number-from-a-string-using-bash-example
