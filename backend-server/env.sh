#!/usr/bin/env bash

eval $(op account add --signin --address vikadata.1password.com)

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

# .env inject
op inject -f -i ${SCRIPT_DIR}/.env.template -o ${SCRIPT_DIR}/.env

export $(grep -v '^#' ${SCRIPT_DIR}/.env | xargs)
