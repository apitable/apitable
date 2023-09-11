/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { useEffect, useState } from 'react';
import { Strings, t } from '@apitable/core';
import { Modal } from './common/modal';

const VersionUpdater = () => {
  const [versionOutdated, setVersionOutdated] = useState(false);

  useEffect(() => {
    window.addEventListener('newVersionRequired', onUpdateVersion);

    return () => {
      window.removeEventListener('newVersionRequired', onUpdateVersion);
    };
  }, []);

  useEffect(() => {
    if (!versionOutdated) {
      return;
    }

    Modal.error({
      title: t(Strings.front_version_error_title),
      content: t(Strings.front_version_error_desc),
      okText: t(Strings.refresh),
      onOk: () => {
        window.location.reload();
      },
    });
  }, [versionOutdated]);

  const onUpdateVersion = () => {
    setVersionOutdated(true);
  };

  return null;
};

export default VersionUpdater;
