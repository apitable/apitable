# hadolint ignore=DL3007
FROM gitpod/workspace-full:latest

RUN bash -c ". /home/gitpod/.sdkman/bin/sdkman-init.sh"

# hadolint ignore=DL3059
RUN bash -c 'VERSION="16.15.0" && source $HOME/.nvm/nvm.sh && nvm install $VERSION && nvm use $VERSION && nvm alias default $VERSION'

# hadolint ignore=DL3059
RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix