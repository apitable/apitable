# .InternalServiceDataTableFieldPermissionInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**disableRoles**](InternalServiceDataTableFieldPermissionInterfaceApi.md#disableRoles) | **POST** /internal/datasheet/{dstId}/field/permission/disable | turn off multiple field permissions
[**getFieldPermission**](InternalServiceDataTableFieldPermissionInterfaceApi.md#getFieldPermission) | **GET** /internal/node/{nodeId}/field/permission | get field permissions
[**getMultiFieldPermissionViews**](InternalServiceDataTableFieldPermissionInterfaceApi.md#getMultiFieldPermissionViews) | **POST** /internal/node/field/permission | get field permission set for multiple nodes


# **disableRoles**
> ResponseDataVoid disableRoles()

room layer ot delete field operation call

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceDataTableFieldPermissionInterfaceApi(configuration);

let body:.InternalServiceDataTableFieldPermissionInterfaceApiDisableRolesRequest = {
  // string | table id
  dstId: "dstGxznHFXf9pvF1LZ",
  // string | list of field ids
  fieldIds: "fldB7uWmwYrQf,fldB7uWmwYrQf",
};

apiInstance.disableRoles(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dstId** | [**string**] | table id | defaults to undefined
 **fieldIds** | [**string**] | list of field ids | defaults to undefined


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getFieldPermission**
> ResponseDataFieldPermissionView getFieldPermission()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceDataTableFieldPermissionInterfaceApi(configuration);

let body:.InternalServiceDataTableFieldPermissionInterfaceApiGetFieldPermissionRequest = {
  // string | node id
  nodeId: "dstCgcfixAKyeeNsaP",
  // string | user id
  userId: "123",
  // string | share id (optional)
  shareId: "shrFPXT8qnyFJglX6elJi",
};

apiInstance.getFieldPermission(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **userId** | [**string**] | user id | defaults to undefined
 **shareId** | [**string**] | share id | (optional) defaults to undefined


### Return type

**ResponseDataFieldPermissionView**

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

# **getMultiFieldPermissionViews**
> ResponseDataListFieldPermissionView getMultiFieldPermissionViews(internalPermissionRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceDataTableFieldPermissionInterfaceApi(configuration);

let body:.InternalServiceDataTableFieldPermissionInterfaceApiGetMultiFieldPermissionViewsRequest = {
  // InternalPermissionRo
  internalPermissionRo: {
    nodeIds: ["fomtujwf5eSWKiMaVw","dstbw4CZFURbchgP17"],
    shareId: "shr8T8vAfehg3yj3McmDG",
    userId: "usrddddd",
  },
};

apiInstance.getMultiFieldPermissionViews(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **internalPermissionRo** | **InternalPermissionRo**|  |


### Return type

**ResponseDataListFieldPermissionView**

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


