import { FC } from 'react';
import { getCustomConfig, isPrivateDeployment, Navigation, Settings, Strings, t } from '@vikadata/core';
import { LinkButton, ButtonGroup } from '@vikadata/components';

import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';

import { isMobileApp } from 'pc/utils/env';

import styles from './style.module.less';

export const HomeFooter: FC = props => {
  const navigationTo = useNavigation();

  const { siteUrl } = getCustomConfig();

  if (isMobileApp()) {
    return (
      <ButtonGroup className={styles.homeFooter} withSeparate>
        <LinkButton
          component="button"
          underline={false}
          onClick={() => navigationTo({ path: Navigation.TEMPLATE })}
        >
          {t(Strings.nav_templates)}
        </LinkButton>
      </ButtonGroup>
    );
  }

  return (
    <>
      <ButtonGroup className={styles.homeFooter} withSeparate>
        {!isPrivateDeployment() &&
          <LinkButton
            component="button"
            underline={false}
          >
            <a href={`${window.location.origin}/chatgroup/`} target="_blank" style={{ color: 'inherit' }} rel="noreferrer">{t(Strings.feedback)}</a>
          </LinkButton>}
        <LinkButton
          component="button"
          underline={false}
        >
          <a href="/help/" target="_blank" style={{ color: 'inherit' }}>{t(Strings.support)}</a>
        </LinkButton>
        <LinkButton
          component="button"
          underline={false}
          onClick={() => navigationTo({ path: Navigation.TEMPLATE })}
        >
          {t(Strings.nav_templates)}
        </LinkButton>
      </ButtonGroup>
      <ButtonGroup className={styles.homeFooter} withSeparate>
        <LinkButton
          component="button"
          underline={false}
          onClick={() => {
            if (siteUrl) {
              window.open(siteUrl, '__blank');
              return;
            }
            navigationTo({ path: Navigation.HOME, method: Method.NewTab, query: { home: 1 }});
          }}>{t(Strings.enter_official_website)}
        </LinkButton>
        <LinkButton
          component="button"
          underline={false}
        >
          <a href={Settings.private_deployment_form.value} target="_blank" style={{ color: 'inherit' }} rel="noreferrer">{t(Strings.self_hosting)}</a>
        </LinkButton>
      </ButtonGroup>
    </>
  );
};
