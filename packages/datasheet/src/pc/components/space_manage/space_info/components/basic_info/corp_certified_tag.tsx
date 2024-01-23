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

import classnames from 'classnames';
import { Strings, t } from '@apitable/core';
// eslint-disable-next-line no-restricted-imports
import { Tooltip } from 'pc/components/common';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import { buildSpaceCertSheetUrl } from './helper';
import styles from './corp_certified_tag.module.less';

type Props = {
  spaceId: string;
  isSocialEnabled: boolean;
  certified: boolean;
};

const CorpCertifiedTag = ({ certified, isSocialEnabled, spaceId }: Props) => {
  if (isSocialEnabled) {
    return null;
  }

  return <>{certified ? <CertifiedTag /> : <UncertifiedTag spaceId={spaceId} />}</>;
};

const CertifiedTag = () => (
  <span className={classnames(styles.tag, styles.tagCorpCertified)}>
    <span className={styles.text}>{t(Strings.space_corp_certified)}</span>
  </span>
);

const UncertifiedTag = ({ spaceId }: { spaceId: string }) => {
  const formUrl = buildSpaceCertSheetUrl(spaceId);

  if (isMobileApp() || !getEnvVariables().SPACE_ENTERPRISE_CERTIFICATION_FORM_URL) {
    return null;
  }

  return (
    <Tooltip title={t(Strings.space_corp_uncertified_tooltip)} placement="top">
      <a className={classnames(styles.tag, styles.tagCorpUncertified)} href={formUrl} target="_blank" rel="noopener noreferrer">
        <span className={styles.text}>{t(Strings.space_corp_uncertified)}</span>
      </a>
    </Tooltip>
  );
};

export default CorpCertifiedTag;
