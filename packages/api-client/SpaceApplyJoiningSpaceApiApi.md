# .SpaceApplyJoiningSpaceApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apply**](SpaceApplyJoiningSpaceApiApi.md#apply) | **POST** /space/apply/join | Applying to join the space
[**process**](SpaceApplyJoiningSpaceApiApi.md#process) | **POST** /space/apply/process | Process joining application


# **apply**
> ResponseDataVoid apply(spaceJoinApplyRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceApplyJoiningSpaceApiApi(configuration);

let body:.SpaceApplyJoiningSpaceApiApiApplyRequest = {
  // SpaceJoinApplyRo
  spaceJoinApplyRo: {
    spaceId: "spczdmQDfBAn5",
  },
};

apiInstance.apply(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceJoinApplyRo** | **SpaceJoinApplyRo**|  |


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **process**
> ResponseDataVoid process(spaceJoinProcessRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceApplyJoiningSpaceApiApi(configuration);

let body:.SpaceApplyJoiningSpaceApiApiProcessRequest = {
  // SpaceJoinProcessRo
  spaceJoinProcessRo: {
    notifyId: 761263712638,
    agree: true,
  },
};

apiInstance.process(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceJoinProcessRo** | **SpaceJoinProcessRo**|  |


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
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


