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

import { getReleaseVersion, getSpaceIdFormTemplate } from '../env';
declare const window: any;

describe('getSpaceIdFormTemplate', () => {
  afterEach(() => {
    delete window.__initialization_data__;
  });

  it('returns null when no userInfo', () => {
    window.__initialization_data__ = {};
    expect(getSpaceIdFormTemplate()).toBeNull();
  });

  it('returns null when no spaceId inside userInfo', () => {
    window.__initialization_data__ = {
      userInfo: {},
    };
    expect(getSpaceIdFormTemplate()).toBeNull();
  });

  it('returns spaceId from userInfo', () => {
    const spaceId = '12345';
    window.__initialization_data__ = {
      userInfo: { spaceId },
    };
    expect(getSpaceIdFormTemplate()).toEqual(spaceId);
  });
});

describe('getReleaseVersion', () => {
  afterEach(() => {
    delete window.__initialization_data__;
  });

  const defaultVersion = 'development';

  it('returns default when no version', () => {
    window.__initialization_data__ = {};
    expect(getReleaseVersion()).toEqual(defaultVersion);
  });

  it('returns spaceId from userInfo', () => {
    const version = 'v12345';
    window.__initialization_data__ = { version };
    expect(getReleaseVersion()).toEqual(version);
  });
});
