#!/bin/sh
# APITable <https://github.com/apitable/apitable>
# Copyright (C) 2022 APITable Ltd. <https://apitable.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


## https://stackoverflow.com/questions/19331497/set-environment-variables-from-file-of-key-value-pairs
## Usage:
##   . ./export-env.sh ; $COMMAND
##   . ./export-env.sh ; echo ${MINIENTREGA_FECHALIMITE}

unamestr=$(uname)
if [ "$unamestr" = 'Linux' ]; then

  export $(grep -v '^#' $1 | xargs -d '\n')

elif [ "$unamestr" = 'FreeBSD' ] || [ "$unamestr" = 'Darwin' ]; then

  export $(grep -v '^#' $1 | xargs -0)

fi