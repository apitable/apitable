SHELL := /bin/bash
.PHONE: buildpush
buildpush:
	eval "$$(curl -fsSL https://vikadata.github.io/semver_ci.sh)"; \
	build_docker socket-server
      
.PHONY: patch
patch: # bump version number patch
	docker run --rm -it --user $(id -u):$(id -g) -v "$(shell pwd):/app" vikadata/bumpversion bumpversion patch
