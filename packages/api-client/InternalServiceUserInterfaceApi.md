# .InternalServiceUserInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**closePausedUserAccount**](InternalServiceUserInterfaceApi.md#closePausedUserAccount) | **POST** /internal/users/{userId}/close | Close and log off the cooling-off period user account
[**getPausedUsers**](InternalServiceUserInterfaceApi.md#getPausedUsers) | **GET** /internal/users/paused | get cooling off users
[**getUserHistories**](InternalServiceUserInterfaceApi.md#getUserHistories) | **POST** /internal/getUserHistories | get the cooling-off period user operation record
[**meSession**](InternalServiceUserInterfaceApi.md#meSession) | **GET** /internal/user/session | check whether logged in
[**userBaseInfo**](InternalServiceUserInterfaceApi.md#userBaseInfo) | **GET** /internal/user/get/me | get the necessary information


# **closePausedUserAccount**
> ResponseDataBoolean closePausedUserAccount()

Close and log off the cooling-off period user account

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceUserInterfaceApi(configuration);

let body:.InternalServiceUserInterfaceApiClosePausedUserAccountRequest = {
  // number
  userId: 1,
};

apiInstance.closePausedUserAccount(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**number**] |  | defaults to undefined


### Return type

**ResponseDataBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getPausedUsers**
> ResponseDataListUserInPausedDto getPausedUsers()

get cooling off users

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceUserInterfaceApi(configuration);

let body:any = {};

apiInstance.getPausedUsers(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataListUserInPausedDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getUserHistories**
> ResponseDataListPausedUserHistoryDto getUserHistories(pausedUserHistoryRo)

get the cooling-off period user operation record

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceUserInterfaceApi(configuration);

let body:.InternalServiceUserInterfaceApiGetUserHistoriesRequest = {
  // PausedUserHistoryRo
  pausedUserHistoryRo: {
    limitDays: 1,
  },
};

apiInstance.getUserHistories(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **pausedUserHistoryRo** | **PausedUserHistoryRo**|  |


### Return type

**ResponseDataListPausedUserHistoryDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **meSession**
> ResponseDataBoolean meSession()

get the necessary information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceUserInterfaceApi(configuration);

let body:any = {};

apiInstance.meSession(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataBoolean**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **userBaseInfo**
> ResponseDataUserBaseInfoVo userBaseInfo()

get the necessary information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceUserInterfaceApi(configuration);

let body:any = {};

apiInstance.userBaseInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataUserBaseInfoVo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


