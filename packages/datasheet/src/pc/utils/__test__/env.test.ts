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
