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

/*
 * The fallback page displayed when the React global crashes
 */
import * as React from 'react';
import { useEffect } from 'react';
import { Button, colorVars, LinkButton, Typography } from '@apitable/components';
import { Strings, t } from '@apitable/core';
import { useAppSelector } from 'pc/store/react-redux';

const ErrorPage = () => {
  useEffect(() => {
    window.parent.postMessage(
      {
        message: 'pageCrash',
      },
      '*',
    );
  }, []);
  const { embedId } = useAppSelector((state) => state.pageParams);

  const handleClick = () => {
    window.location.href = '/workbench';
  };

  const handleContactUs = () => {
    // navigationToUrl(getEnvVariables().CRASH_PAGE_CONTACT_US_URL);
  };

  const handleFeedback = () => {
    // navigationToUrl(getEnvVariables().CRASH_PAGE_REPORT_ISSUES_URL);
  };

  return (
    <div className={'errorPage'}>
      <div className={'errorText'}>
        {t(Strings.error_boundary_crashed)}
        <span role="img" aria-label="sick">
          🤒
        </span>
      </div>
      {!embedId && (
        <Button color="primary" onClick={handleClick}>
          {t(Strings.error_boundary_back)}
        </Button>
      )}
      <LinkButton underline={false} onClick={handleContactUs}>
        <Typography className={'contactUs'} variant="body2" color={colorVars.fc0}>
          {t(Strings.contact_us)}
        </Typography>
      </LinkButton>
      <LinkButton className={'errorFeedback'} underline color={colorVars.fc3} onClick={handleFeedback}>
        <Typography variant="body2" color={colorVars.fc3}>
          {t(Strings.error_page_feedback_text)}
        </Typography>
      </LinkButton>
    </div>
  );
};

export default ErrorPage;
