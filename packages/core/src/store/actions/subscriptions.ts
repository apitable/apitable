import { ActionConstants } from 'store';
import { ISubscriptions } from 'store/interface';
import { getSubscriptions } from 'api/datasheet_api';

// 获取当前datasheet/mirror已关注record Ids
export const getSubscriptionsAction = (datasheetId: string, mirrorId?: string) => async(dispatch) => {
  const { data } = await getSubscriptions(datasheetId, mirrorId);

  if (data?.success) {
    dispatch(setSubscriptionsAction(data.data || []));
  }
};

// update当前关注record Ids
export const setSubscriptionsAction = (recordIds: ISubscriptions) => ({
  type: ActionConstants.SET_SUBSCRIPTIONS,
  payload: recordIds,
});
