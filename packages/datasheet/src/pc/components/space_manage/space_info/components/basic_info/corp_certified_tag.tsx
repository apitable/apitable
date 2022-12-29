import { colorVars } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import classnames from 'classnames';
import { Tooltip } from 'pc/components/common';
import { getEnvVariables, isMobileApp } from 'pc/utils/env';
import IconCertified from 'static/icon/space/space_icon_certified.svg';
import styles from './corp_certified_tag.module.less';
import { buildSpaceCertSheetUrl } from './helper';

type Props = {
  spaceId: string;
  isSocialEnabled: boolean;
  certified: boolean;
};

const CorpCertifiedTag = ({ certified, isSocialEnabled, spaceId }: Props) => {
  if (isSocialEnabled) {
    return null;
  }

  return <>
    {certified ? <CertifiedTag /> : <UncertifiedTag spaceId={spaceId} />}
  </>;
};

const CertifiedTag = () => (
  <span className={classnames(styles.tag, styles.tagCorpCertified)}>
    <span className={styles.icon}>
      <IconCertified fill={colorVars.fc0} />
    </span>
    <span className={styles.text}>{t(Strings.space_corp_certified)}</span>
  </span>
);

const UncertifiedTag = ({ spaceId }: {spaceId: string}) => {
  const formUrl = buildSpaceCertSheetUrl(spaceId);

  if (isMobileApp() || !getEnvVariables().SPACE_ENTERPRISE_CERTIFICATION_FORM_URL) {
    return null;
  }

  return (
    <Tooltip title={t(Strings.space_corp_uncertified_tooltip)} placement="top">
      <a className={classnames(styles.tag, styles.tagCorpUncertified)}
        href={formUrl} target="_blank" rel="noopener noreferrer">
        <span className={styles.icon}>
          <IconCertified fill={colorVars.fc3} />
        </span>
        <span className={styles.text}>{t(Strings.space_corp_uncertified)}</span>
      </a>
    </Tooltip>
  );
};

export default CorpCertifiedTag;
