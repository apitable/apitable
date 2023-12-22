# .InternalServiceNodePermissionInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMultiNodePermissions**](InternalServiceNodePermissionInterfaceApi.md#getMultiNodePermissions) | **POST** /internal/node/permission | Get permission set for multiple nodes
[**getNodePermission**](InternalServiceNodePermissionInterfaceApi.md#getNodePermission) | **GET** /internal/node/{nodeId}/permission | Get Node permission


# **getMultiNodePermissions**
> ResponseDataListDatasheetPermissionView getMultiNodePermissions(internalPermissionRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceNodePermissionInterfaceApi(configuration);

let body:.InternalServiceNodePermissionInterfaceApiGetMultiNodePermissionsRequest = {
  // InternalPermissionRo
  internalPermissionRo: {
    nodeIds: ["fomtujwf5eSWKiMaVw","dstbw4CZFURbchgP17"],
    shareId: "shr8T8vAfehg3yj3McmDG",
    userId: "usrddddd",
  },
};

apiInstance.getMultiNodePermissions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **internalPermissionRo** | **InternalPermissionRo**|  |


### Return type

**ResponseDataListDatasheetPermissionView**

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

# **getNodePermission**
> ResponseDataDatasheetPermissionView getNodePermission()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceNodePermissionInterfaceApi(configuration);

let body:.InternalServiceNodePermissionInterfaceApiGetNodePermissionRequest = {
  // string | Node ID
  nodeId: "dstCgcfixAKyeeNsaP",
  // string | Share ID (optional)
  shareId: "shrFPXT8qnyFJglX6elJi",
};

apiInstance.getNodePermission(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | Node ID | defaults to undefined
 **shareId** | [**string**] | Share ID | (optional) defaults to undefined


### Return type

**ResponseDataDatasheetPermissionView**

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


