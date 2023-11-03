# .ApplicationManagementApplicationManagementRelatedServiceInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createAppInstance**](ApplicationManagementApplicationManagementRelatedServiceInterfaceApi.md#createAppInstance) | **POST** /appInstances | Create an application instance
[**delete17**](ApplicationManagementApplicationManagementRelatedServiceInterfaceApi.md#delete17) | **DELETE** /appInstances/{appInstanceId} | Delete app
[**fetchAppInstances**](ApplicationManagementApplicationManagementRelatedServiceInterfaceApi.md#fetchAppInstances) | **GET** /appInstances | Query the application instance list
[**getAppInstance**](ApplicationManagementApplicationManagementRelatedServiceInterfaceApi.md#getAppInstance) | **GET** /appInstances/{appInstanceId} | Get the configuration of a single application instance


# **createAppInstance**
> ResponseDataAppInstance createAppInstance(createAppInstance)

Opening an application instance

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationManagementApplicationManagementRelatedServiceInterfaceApi(configuration);

let body:.ApplicationManagementApplicationManagementRelatedServiceInterfaceApiCreateAppInstanceRequest = {
  // CreateAppInstance
  createAppInstance: {
    spaceId: "spc21u12h3",
    appId: "app-jh1237123",
  },
};

apiInstance.createAppInstance(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createAppInstance** | **CreateAppInstance**|  |


### Return type

**ResponseDataAppInstance**

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

# **delete17**
> ResponseDataVoid delete17()

The space actively deletes applications

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationManagementApplicationManagementRelatedServiceInterfaceApi(configuration);

let body:.ApplicationManagementApplicationManagementRelatedServiceInterfaceApiDelete17Request = {
  // string | Application instance ID
  appInstanceId: "ai-xxxxx",
};

apiInstance.delete17(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appInstanceId** | [**string**] | Application instance ID | defaults to undefined


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

# **fetchAppInstances**
> ResponseDataPageInfoAppInstance fetchAppInstances()

At present, the interface is full query, and the paging query function will be provided later, so you don\'t need to pass paging parameters

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationManagementApplicationManagementRelatedServiceInterfaceApi(configuration);

let body:.ApplicationManagementApplicationManagementRelatedServiceInterfaceApiFetchAppInstancesRequest = {
  // string | Space ID
  spaceId: "spc123456",
  // string | Page Index (optional)
  pageIndex: "1",
  // string | Quantity per page (optional)
  pageSize: "50",
  // string | Sort field (optional)
  orderBy: "createdAt",
  // string | Collation,asc=positive sequence,desc=Reverse order (optional)
  sortBy: "desc",
};

apiInstance.fetchAppInstances(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | Space ID | defaults to undefined
 **pageIndex** | [**string**] | Page Index | (optional) defaults to undefined
 **pageSize** | [**string**] | Quantity per page | (optional) defaults to undefined
 **orderBy** | [**string**] | Sort field | (optional) defaults to undefined
 **sortBy** | [**string**] | Collation,asc&#x3D;positive sequence,desc&#x3D;Reverse order | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoAppInstance**

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

# **getAppInstance**
> ResponseDataAppInstance getAppInstance()

Get the configuration according to the application instance ID

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ApplicationManagementApplicationManagementRelatedServiceInterfaceApi(configuration);

let body:.ApplicationManagementApplicationManagementRelatedServiceInterfaceApiGetAppInstanceRequest = {
  // string | Application instance ID
  appInstanceId: "ai-xxxxx",
};

apiInstance.getAppInstance(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appInstanceId** | [**string**] | Application instance ID | defaults to undefined


### Return type

**ResponseDataAppInstance**

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


