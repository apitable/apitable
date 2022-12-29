import axios from 'axios';
import * as actions from '../../../shared/store/action_constants';

export function setPageParams(payload: { [path: string]: string | undefined }) {
  if (payload.spaceId) {
    axios.defaults.headers.common['X-Space-Id'] = payload.spaceId;
  }
  return {
    type: actions.SET_PAGE_PARAMS,
    payload,
  };
}
