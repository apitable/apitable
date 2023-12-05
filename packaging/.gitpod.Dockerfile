# hadolint ignore=DL3007
FROM gitpod/workspace-full:latest

# hadolint ignore=DL3045
COPY ../.sdkmanrc ./

RUN bash -c ". /home/gitpod/.sdkman/bin/sdkman-init.sh && sdk env install && sdk default java 17.0.9-graal"

# hadolint ignore=DL3059
RUN bash -c 'VERSION="16.15.0" && source $HOME/.nvm/nvm.sh && nvm install $VERSION && nvm use $VERSION && nvm alias default $VERSION'

# hadolint ignore=DL3059
RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

# hadolint ignore=DL3059
RUN bash -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain nightly --profile minimal -y && source \"\$HOME/.cargo/env\""