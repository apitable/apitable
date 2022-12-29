import { Strings, t } from '@apitable/core';
import { useEffect, useState } from 'react';
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
