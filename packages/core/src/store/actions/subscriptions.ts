import { ActionConstants } from 'store';
import { ISubscriptions } from 'store/interface';
import { getSubscriptions } from 'api/datasheet_api';

/**
 * get current datasheet/mirrors' subscribed(followed) record ids
 * @param datasheetId 
 * @param mirrorId 
 * @returns 
 */
export const getSubscriptionsAction = (datasheetId: string, mirrorId?: string) => async(dispatch) => {
  const { data } = await getSubscriptions(datasheetId, mirrorId);

  if (data?.success) {
    dispatch(setSubscriptionsAction(data.data || []));
  }
};

/**
 * update current subscribed(followed) records ids
 * @param recordIds 
 * @returns 
 */
export const setSubscriptionsAction = (recordIds: ISubscriptions) => ({
  type: ActionConstants.SET_SUBSCRIPTIONS,
  payload: recordIds,
});
