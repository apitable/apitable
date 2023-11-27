# .SpaceInviteLinkApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete6**](SpaceInviteLinkApiApi.md#delete6) | **DELETE** /space/link/delete | Delete link
[**generate**](SpaceInviteLinkApiApi.md#generate) | **POST** /space/link/generate | Generate or refresh link
[**join**](SpaceInviteLinkApiApi.md#join) | **POST** /space/link/join | Join the space using the public link
[**list1**](SpaceInviteLinkApiApi.md#list1) | **GET** /space/link/list | Get a list of links
[**valid**](SpaceInviteLinkApiApi.md#valid) | **POST** /space/link/valid | Valid invite link token


# **delete6**
> ResponseDataVoid delete6(spaceLinkOpRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceInviteLinkApiApi(configuration);

let body:.SpaceInviteLinkApiApiDelete6Request = {
  // SpaceLinkOpRo
  spaceLinkOpRo: {
    teamId: 1254,
    nodeId: "dst***",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.delete6(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceLinkOpRo** | **SpaceLinkOpRo**|  |
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

# **generate**
> ResponseDataString generate(spaceLinkOpRo, )

return token，the front end stitching $DOMAIN/invite/link?token=:token

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceInviteLinkApiApi(configuration);

let body:.SpaceInviteLinkApiApiGenerateRequest = {
  // SpaceLinkOpRo
  spaceLinkOpRo: {
    teamId: 1254,
    nodeId: "dst***",
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.generate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceLinkOpRo** | **SpaceLinkOpRo**|  |
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataString**

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

# **join**
> ResponseDataVoid join(inviteValidRo)

If return code status 201,the user redirects to the login page due to unauthorized.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceInviteLinkApiApi(configuration);

let body:.SpaceInviteLinkApiApiJoinRequest = {
  // InviteValidRo
  inviteValidRo: {
    token: "b10e5e36cd7249bdaeab3e424308deed",
    nodeId: "dst****",
    data: "FutureIsComing",
  },
};

apiInstance.join(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteValidRo** | **InviteValidRo**|  |


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

# **list1**
> ResponseDataListSpaceLinkVo list1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceInviteLinkApiApi(configuration);

let body:.SpaceInviteLinkApiApiList1Request = {
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.list1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataListSpaceLinkVo**

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

# **valid**
> ResponseDataSpaceLinkInfoVo valid(inviteValidRo)

After the verification is successful, it can obtain related invitation information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceInviteLinkApiApi(configuration);

let body:.SpaceInviteLinkApiApiValidRequest = {
  // InviteValidRo
  inviteValidRo: {
    token: "b10e5e36cd7249bdaeab3e424308deed",
    nodeId: "dst****",
    data: "FutureIsComing",
  },
};

apiInstance.valid(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inviteValidRo** | **InviteValidRo**|  |


### Return type

**ResponseDataSpaceLinkInfoVo**

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


