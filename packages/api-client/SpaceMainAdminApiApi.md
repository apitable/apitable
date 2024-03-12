# .SpaceMainAdminApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getMainAdminInfo**](SpaceMainAdminApiApi.md#getMainAdminInfo) | **GET** /space/manager | Get main admin info
[**replace**](SpaceMainAdminApiApi.md#replace) | **POST** /space/changeManager | Change main admin


# **getMainAdminInfo**
> ResponseDataMainAdminInfoVo getMainAdminInfo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceMainAdminApiApi(configuration);

let body:.SpaceMainAdminApiApiGetMainAdminInfoRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getMainAdminInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataMainAdminInfoVo**

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

# **replace**
> ResponseDataVoid replace(spaceMainAdminChangeOpRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceMainAdminApiApi(configuration);

let body:.SpaceMainAdminApiApiReplaceRequest = {
  // SpaceMainAdminChangeOpRo
  spaceMainAdminChangeOpRo: {
    memberId: 123456,
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.replace(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceMainAdminChangeOpRo** | **SpaceMainAdminChangeOpRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


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


