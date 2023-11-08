# .WorkbenchNodeShareApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**disableShare**](WorkbenchNodeShareApiApi.md#disableShare) | **POST** /node/disableShare/{nodeId} | Disable node sharing
[**nodeShareInfo**](WorkbenchNodeShareApiApi.md#nodeShareInfo) | **GET** /node/shareSettings/{nodeId} | Get node share info
[**readShareInfo**](WorkbenchNodeShareApiApi.md#readShareInfo) | **GET** /node/readShareInfo/{shareId} | Get share node info
[**storeShareData**](WorkbenchNodeShareApiApi.md#storeShareData) | **POST** /node/storeShareData | Sotre share data
[**updateNodeShare**](WorkbenchNodeShareApiApi.md#updateNodeShare) | **POST** /node/updateShare/{nodeId} | Update node share setting


# **disableShare**
> ResponseDataVoid disableShare()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeShareApiApi(configuration);

let body:.WorkbenchNodeShareApiApiDisableShareRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
};

apiInstance.disableShare(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined


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

# **nodeShareInfo**
> ResponseDataNodeShareSettingInfoVO nodeShareInfo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeShareApiApi(configuration);

let body:.WorkbenchNodeShareApiApiNodeShareInfoRequest = {
  // string | node id
  nodeId: "nodRTGSy43DJ9",
};

apiInstance.nodeShareInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node id | defaults to undefined


### Return type

**ResponseDataNodeShareSettingInfoVO**

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

# **readShareInfo**
> ResponseDataNodeShareInfoVO readShareInfo()

get shared content according to share id

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeShareApiApi(configuration);

let body:.WorkbenchNodeShareApiApiReadShareInfoRequest = {
  // string | share id
  shareId: "shrRTGSy43DJ9",
};

apiInstance.readShareInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shareId** | [**string**] | share id | defaults to undefined


### Return type

**ResponseDataNodeShareInfoVO**

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

# **storeShareData**
> ResponseDataStoreNodeInfoVO storeShareData(storeShareNodeRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeShareApiApi(configuration);

let body:.WorkbenchNodeShareApiApiStoreShareDataRequest = {
  // StoreShareNodeRo
  storeShareNodeRo: {
    spaceId: "spc20cjiwis2",
    shareId: "shrSJ921CNsj",
  },
  // string | user socket id (optional)
  xSocketId: "QkKp9XJEl",
};

apiInstance.storeShareData(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **storeShareNodeRo** | **StoreShareNodeRo**|  |
 **xSocketId** | [**string**] | user socket id | (optional) defaults to undefined


### Return type

**ResponseDataStoreNodeInfoVO**

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

# **updateNodeShare**
> ResponseDataShareBaseInfoVo updateNodeShare(updateNodeShareSettingRo, )

Update node share setting  stringObjectParams share setting parameter description: <br/> There are three option parameters for sharing settings. Only one can be set true, and more than two cannot be set to true at the same time.<br/>onlyRead: Bool, whether to set sharing only for others to view.<br/>canBeEdited: Bool, whether to set up sharing to others for collaborative editing.<br/>canBeStored: Bool, whether to set up sharing to others and save as a copy.<br/>Example: Set <Share Only for Others to View>, parameters:{\"onlyRead\": true}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WorkbenchNodeShareApiApi(configuration);

let body:.WorkbenchNodeShareApiApiUpdateNodeShareRequest = {
  // UpdateNodeShareSettingRo
  updateNodeShareSettingRo: {
    props: "{"onlyRead": true}",
  },
  // string | node id
  nodeId: "nodRTGSy43DJ9",
};

apiInstance.updateNodeShare(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateNodeShareSettingRo** | **UpdateNodeShareSettingRo**|  |
 **nodeId** | [**string**] | node id | defaults to undefined


### Return type

**ResponseDataShareBaseInfoVo**

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


