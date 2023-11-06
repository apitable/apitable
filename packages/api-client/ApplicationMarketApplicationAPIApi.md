# .ApplicationMarketApplicationAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**blockSpaceApp**](ApplicationMarketApplicationAPIApi.md#blockSpaceApp) | **POST** /marketplace/integration/space/{spaceId}/app/{appId}/stop | Block Application
[**getSpaceAppList**](ApplicationMarketApplicationAPIApi.md#getSpaceAppList) | **GET** /marketplace/integration/space/{spaceId}/apps | Query Built-in Integrated Applications
[**openSpaceApp**](ApplicationMarketApplicationAPIApi.md#openSpaceApp) | **POST** /marketplace/integration/space/{spaceId}/app/{appId}/open | Open Application


# **blockSpaceApp**
> ResponseDataVoid blockSpaceApp()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationMarketApplicationAPIApi(configuration);

let body:.ApplicationMarketApplicationAPIApiBlockSpaceAppRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  appId: "appId_example",
};

apiInstance.blockSpaceApp(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **appId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataVoid**

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

# **getSpaceAppList**
> ResponseDataListMarketplaceSpaceAppVo getSpaceAppList()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationMarketApplicationAPIApi(configuration);

let body:.ApplicationMarketApplicationAPIApiGetSpaceAppListRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.getSpaceAppList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataListMarketplaceSpaceAppVo**

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

# **openSpaceApp**
> ResponseDataVoid openSpaceApp()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationMarketApplicationAPIApi(configuration);

let body:.ApplicationMarketApplicationAPIApiOpenSpaceAppRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  appId: "appId_example",
};

apiInstance.openSpaceApp(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **appId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataVoid**

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


