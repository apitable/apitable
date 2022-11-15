import styles from './corp_certified_tag.module.less';
import classnames from 'classnames';
import { Strings, t, isPrivateDeployment } from '@apitable/core';
import IconCertified from 'static/icon/space/space_icon_certified.svg';
import { colorVars } from '@apitable/components';
import { Tooltip } from 'pc/components/common';
import { buildSpaceCertSheetUrl } from './helper';
import { isMobileApp } from 'pc/utils/env';

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

  if (isMobileApp() || isPrivateDeployment()) {
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
