/*
 * The fallback page displayed when the React global crashes
 */
import { Button, colorVars, LinkButton, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { navigationToUrl } from 'pc/components/route_manager/navigation_to_url';
import * as React from 'react';

const ErrorPage = () => {
  const handleClick = () => {
    window.location.href = '/workbench';
  };

  const handleContactUs = () => {
    navigationToUrl(t(Strings.how_contact_service));
  };

  const handleFeedback = () => {
    navigationToUrl(t(Strings.how_to_report_issues));
  };

  return (
    <div className={'errorPage'}>
      <div className={'errorText'}>
        {t(Strings.error_boundary_crashed)}<span role='img' aria-label='sick'>🤒</span>
      </div>
      <Button color='primary' onClick={handleClick}>{t(Strings.error_boundary_back)}</Button>
      <LinkButton underline={false} onClick={handleContactUs}>
        <Typography className={'contactUs'} variant='body2' color={colorVars.fc0}>{t(Strings.contact_us)}</Typography>
      </LinkButton>
      <LinkButton className={'errorFeedback'} underline color={colorVars.fc3} onClick={handleFeedback}>
        <Typography variant='body2' color={colorVars.fc3}>{t(Strings.error_page_feedback_text)}</Typography>
      </LinkButton>
    </div>
  );
};

export default ErrorPage;
