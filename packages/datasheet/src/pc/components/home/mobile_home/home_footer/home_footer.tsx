import { ButtonGroup, LinkButton } from '@vikadata/components';
import { getCustomConfig, isPrivateDeployment, Navigation, Settings, Strings, t } from '@vikadata/core';
import { Router } from 'pc/components/route_manager/router';
import { isMobileApp } from 'pc/utils/env';
import { FC } from 'react';

import styles from './style.module.less';

export const HomeFooter: FC = props => {
  const { siteUrl } = getCustomConfig();

  if (isMobileApp()) {
    return (
      <ButtonGroup className={styles.homeFooter} withSeparate>
        <LinkButton
          component='button'
          underline={false}
          onClick={() => Router.push(Navigation.TEMPLATE)}
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
            component='button'
            underline={false}
          >
            <a href={`${window.location.origin}/chatgroup/`} target='_blank' style={{ color: 'inherit' }} rel='noreferrer'>{t(Strings.feedback)}</a>
          </LinkButton>}
        <LinkButton
          component='button'
          underline={false}
        >
          <a href='/help/' target='_blank' style={{ color: 'inherit' }}>{t(Strings.support)}</a>
        </LinkButton>
        <LinkButton
          component='button'
          underline={false}
          onClick={() => Router.push(Navigation.TEMPLATE)}
        >
          {t(Strings.nav_templates)}
        </LinkButton>
      </ButtonGroup>
      <ButtonGroup className={styles.homeFooter} withSeparate>
        <LinkButton
          component='button'
          underline={false}
          onClick={() => {
            if (siteUrl) {
              window.open(siteUrl, '__blank');
              return;
            }
            Router.newTab(Navigation.HOME, { query: { home: 1 }});
          }}>{t(Strings.enter_official_website)}
        </LinkButton>
        <LinkButton
          component='button'
          underline={false}
        >
          <a href={Settings.private_deployment_form.value} target='_blank' style={{ color: 'inherit' }} rel='noreferrer'>{t(Strings.self_hosting)}</a>
        </LinkButton>
      </ButtonGroup>
    </>
  );
};
