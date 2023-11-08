# .WorkbenchNodeRubbishApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_delete**](WorkbenchNodeRubbishApiApi.md#_delete) | **POST** /node/rubbish/delete/{nodeId} | Delete node in rubbish
[**delete1**](WorkbenchNodeRubbishApiApi.md#delete1) | **DELETE** /node/rubbish/delete/{nodeId} | Delete node in rubbish
[**list3**](WorkbenchNodeRubbishApiApi.md#list3) | **GET** /node/rubbish/list | Get node in rubbish
[**recover**](WorkbenchNodeRubbishApiApi.md#recover) | **POST** /node/rubbish/recover | Recover node


# **_delete**
> ResponseDataVoid _delete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRubbishApiApi(configuration);

let body:.WorkbenchNodeRubbishApiApiDeleteRequest = {
  // string | node id
  nodeId: "fod8mXUeiXyVo",
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance._delete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


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

# **delete1**
> ResponseDataVoid delete1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRubbishApiApi(configuration);

let body:.WorkbenchNodeRubbishApiApiDelete1Request = {
  // string | node id
  nodeId: "fod8mXUeiXyVo",
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.delete1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


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

# **list3**
> ResponseDataListRubbishNodeVo list3()

If the last node id is passed in, the service status code 422 is returned.It means that the node is no longer in the recovery compartment, the positioning fails, and the last node can be requested again.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRubbishApiApi(configuration);

let body:.WorkbenchNodeRubbishApiApiList3Request = {
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
  // number | expected load quantity（May be because the total number or permissions are not enough） (optional)
  size: 15,
  // boolean | whether to request an overrun node（default FALSE） (optional)
  isOverLimit: true,
  // string | id of the last node in the loaded list (optional)
  lastNodeId: "dstM5qG7",
};

apiInstance.list3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined
 **size** | [**number**] | expected load quantity（May be because the total number or permissions are not enough） | (optional) defaults to undefined
 **isOverLimit** | [**boolean**] | whether to request an overrun node（default FALSE） | (optional) defaults to undefined
 **lastNodeId** | [**string**] | id of the last node in the loaded list | (optional) defaults to undefined


### Return type

**ResponseDataListRubbishNodeVo**

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

# **recover**
> ResponseDataNodeInfoVo recover(nodeRecoverRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeRubbishApiApi(configuration);

let body:.WorkbenchNodeRubbishApiApiRecoverRequest = {
  // NodeRecoverRo
  nodeRecoverRo: {
    nodeId: "nod10",
    parentId: "nod10",
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.recover(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeRecoverRo** | **NodeRecoverRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataNodeInfoVo**

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


