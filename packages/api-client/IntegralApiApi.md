# .IntegralApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**integralRecords**](IntegralApiApi.md#integralRecords) | **GET** /user/integral/records | Page by page query of integral revenue and expenditure details
[**integrals**](IntegralApiApi.md#integrals) | **GET** /user/integral | Query account integral information
[**inviteCodeReward**](IntegralApiApi.md#inviteCodeReward) | **POST** /user/invite/reward | Fill in invitation code reward


# **integralRecords**
> ResponseDataPageInfoIntegralRecordVO integralRecords()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IntegralApiApi(configuration);

let body:.IntegralApiApiIntegralRecordsRequest = {
  // Page
  page: {
    records: [
      {},
    ],
    total: 1,
    size: 1,
    current: 1,
    orders: [
      {
        column: "column_example",
        asc: true,
      },
    ],
    optimizeCountSql: true,
    searchCount: true,
    optimizeJoinOfCountSql: true,
    countId: "countId_example",
    maxLimit: 1,
    pages: 1,
  },
  // string | Page parameter
  pageObjectParams: "{"pageNo":1,"pageSize":20,"order":"createTime,updateTime","sort":"asc,desc"}",
};

apiInstance.integralRecords(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | Page parameter | defaults to undefined


### Return type

**ResponseDataPageInfoIntegralRecordVO**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **integrals**
> ResponseDataUserIntegralVo integrals()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IntegralApiApi(configuration);

let body:any = {};

apiInstance.integrals(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataUserIntegralVo**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **inviteCodeReward**
> ResponseDataVoid inviteCodeReward(inviteCodeRewardRo)

Users fill in the invitation code and get rewards

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .IntegralApiApi(configuration);

let body:.IntegralApiApiInviteCodeRewardRequest = {
  // InviteCodeRewardRo
  inviteCodeRewardRo: {
    inviteCode: "12345678",
  },
};

apiInstance.inviteCodeReward(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteCodeRewardRo** | **InviteCodeRewardRo**|  |


### Return type

**ResponseDataVoid**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


