import { Button, TextInput, useThemeColors } from '@apitable/components';
import { integrateCdnHost, Navigation, Settings, Strings, t } from '@apitable/core';
import { CopyOutlined, InformationSmallOutlined, NewtabOutlined } from '@apitable/icons';
import Image from 'next/image';
import { ButtonPlus, Tooltip } from 'pc/components/common';
import { Router } from 'pc/components/route_manager/router';
import { useQuery } from 'pc/hooks';
import { copy2clipBoard } from 'pc/utils';
import * as React from 'react';
import styles from './styles.module.less';

const WecomBindSuccess: React.FC = () => {
  const query = useQuery();
  const domainName = query.get('domainName') || '';
  const colors = useThemeColors();
  return (
    <div className={styles.wecomBindSuccess}>
      <span className={styles.successImg}>
        <Image
          src={integrateCdnHost(Settings.integration_wecom_bind_success_icon.value)}
          alt='success-icon'
        />
      </span>

      <div className={styles.title}>{t(Strings.integration_app_wecom_bind_success_title)}</div>
      <div className={styles.infoWrap}>
        <div className={styles.infoTitle}>
          <span>{t(Strings.integration_app_wecom_config_item1_title)}</span>
          <Tooltip title={t(Strings.click_to_view_instructions)}>
            <a
              href={Settings.integration_wecom_custom_subdomain_help_url.value}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <InformationSmallOutlined color={colors.thirdLevelText} size={16} />
            </a>
          </Tooltip>
        </div>
        <div className={styles.infoDesc}>{t(Strings.integration_app_wecom_config_item1_desc)}</div>
        <div className={styles.inputWrap}>
          <TextInput
            className={styles.inputText}
            value={domainName}
            block
            readOnly
          />
          <ButtonPlus.Group style={{ display: 'flex' }}>
            <Tooltip title={t(Strings.copy_link)} placement='top'>
              <Button
                onClick={() => copy2clipBoard(domainName)}
                prefixIcon={<CopyOutlined color={colors.secondLevelText} />}
              />
            </Tooltip>
            <Tooltip title={t(Strings.wecom_new_tab_tooltip)} placement='top'>
              <Button
                onClick={() => {
                  Router.newTab(Navigation.SPACE, { clearQuery: true });
                }}
                prefixIcon={<NewtabOutlined color={colors.secondLevelText} />}
              />
            </Tooltip>
          </ButtonPlus.Group>
        </div>
        <div className={styles.triangleTopRight}>
          <span className={styles.triangleFont}>{t(Strings.integration_app_wecom_bind_success_badge)}</span>
        </div>
      </div>
    </div>
  );
};

export default WecomBindSuccess;
