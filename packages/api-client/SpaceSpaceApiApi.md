# .SpaceSpaceApiApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel**](SpaceSpaceApiApi.md#cancel) | **POST** /space/cancel/{spaceId} | Undo delete space
[**capacity**](SpaceSpaceApiApi.md#capacity) | **GET** /space/capacity | Get space capacity info
[**create4**](SpaceSpaceApiApi.md#create4) | **POST** /space/create | Create Space
[**del**](SpaceSpaceApiApi.md#del) | **DELETE** /space/del | Delete space immediately
[**delete16**](SpaceSpaceApiApi.md#delete16) | **DELETE** /space/delete/{spaceId} | Delete space
[**feature**](SpaceSpaceApiApi.md#feature) | **GET** /space/features | Get space feature
[**getCreditUsages**](SpaceSpaceApiApi.md#getCreditUsages) | **GET** /space/{spaceId}/credit/chart | Gets message credit chart data for the space
[**getSpaceResource**](SpaceSpaceApiApi.md#getSpaceResource) | **GET** /space/resource | Get user space resource
[**info1**](SpaceSpaceApiApi.md#info1) | **GET** /space/info/{spaceId} | Get space info
[**list2**](SpaceSpaceApiApi.md#list2) | **GET** /space/list | Get space list
[**quit**](SpaceSpaceApiApi.md#quit) | **POST** /space/quit/{spaceId} | Quit space
[**remove**](SpaceSpaceApiApi.md#remove) | **POST** /space/remove/{spaceId} | Remove hot point in space
[**subscribe**](SpaceSpaceApiApi.md#subscribe) | **GET** /space/subscribe/{spaceId} | Gets subscription information for the space
[**switchSpace**](SpaceSpaceApiApi.md#switchSpace) | **POST** /space/{spaceId}/switch | switch space
[**update3**](SpaceSpaceApiApi.md#update3) | **POST** /space/update | Update space
[**updateMemberSetting**](SpaceSpaceApiApi.md#updateMemberSetting) | **POST** /space/updateMemberSetting | Update member setting
[**updateSecuritySetting**](SpaceSpaceApiApi.md#updateSecuritySetting) | **POST** /space/updateSecuritySetting | Update security setting
[**updateWorkbenchSetting**](SpaceSpaceApiApi.md#updateWorkbenchSetting) | **POST** /space/updateWorkbenchSetting | Update workbench setting


# **cancel**
> ResponseDataVoid cancel()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiCancelRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.cancel(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


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

# **capacity**
> ResponseDataSpaceCapacityVO capacity()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiCapacityRequest = {
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.capacity(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataSpaceCapacityVO**

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

# **create4**
> ResponseDataCreateSpaceResultVo create4(spaceOpRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiCreate4Request = {
  // SpaceOpRo
  spaceOpRo: {
    name: "This is a space",
  },
};

apiInstance.create4(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceOpRo** | **SpaceOpRo**|  |


### Return type

**ResponseDataCreateSpaceResultVo**

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

# **del**
> ResponseDataVoid del()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:any = {};

apiInstance.del(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **delete16**
> ResponseDataVoid delete16(spaceDeleteRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiDelete16Request = {
  // SpaceDeleteRo
  spaceDeleteRo: {
    type: "sms_code",
    code: "123456",
  },
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.delete16(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceDeleteRo** | **SpaceDeleteRo**|  |
 **spaceId** | [**string**] | space id | defaults to undefined


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

# **feature**
> ResponseDataSpaceGlobalFeature feature()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiFeatureRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.feature(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataSpaceGlobalFeature**

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

# **getCreditUsages**
> ResponseDataCreditUsages getCreditUsages()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiGetCreditUsagesRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
  // string (optional)
  timeDimension: "WEEKDAY",
};

apiInstance.getCreditUsages(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined
 **timeDimension** | [**string**] |  | (optional) defaults to 'WEEKDAY'


### Return type

**ResponseDataCreditUsages**

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

# **getSpaceResource**
> ResponseDataUserSpaceVo getSpaceResource()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiGetSpaceResourceRequest = {
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.getSpaceResource(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **xSpaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataUserSpaceVo**

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

# **info1**
> ResponseDataSpaceInfoVO info1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiInfo1Request = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.info1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataSpaceInfoVO**

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

# **list2**
> ResponseDataListSpaceVO list2()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiList2Request = {
  // boolean | Whether to query only the managed space list. By default, not include (optional)
  onlyManageable: true,
};

apiInstance.list2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **onlyManageable** | [**boolean**] | Whether to query only the managed space list. By default, not include | (optional) defaults to undefined


### Return type

**ResponseDataListSpaceVO**

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

# **quit**
> ResponseDataVoid quit()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiQuitRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.quit(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


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

# **remove**
> ResponseDataVoid remove()

Scenario: Remove the red dot in the inactive space

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiRemoveRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.remove(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


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

# **subscribe**
> ResponseDataSpaceSubscribeVo subscribe()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiSubscribeRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.subscribe(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataSpaceSubscribeVo**

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

# **switchSpace**
> ResponseDataVoid switchSpace()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiSwitchSpaceRequest = {
  // string | space id
  spaceId: "spc8mXUeiXyVo",
};

apiInstance.switchSpace(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


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

# **update3**
> ResponseDataVoid update3(spaceUpdateOpRo, )

at least one item is name and logo

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiUpdate3Request = {
  // SpaceUpdateOpRo
  spaceUpdateOpRo: {
    name: "This is a new space name",
    logo: "https://...",
  },
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.update3(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceUpdateOpRo** | **SpaceUpdateOpRo**|  |
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateMemberSetting**
> ResponseDataVoid updateMemberSetting(spaceMemberSettingRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiUpdateMemberSettingRequest = {
  // SpaceMemberSettingRo
  spaceMemberSettingRo: {
    invitable: true,
    joinable: false,
    mobileShowable: false,
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.updateMemberSetting(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceMemberSettingRo** | **SpaceMemberSettingRo**|  |
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateSecuritySetting**
> ResponseDataVoid updateSecuritySetting(spaceSecuritySettingRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiUpdateSecuritySettingRequest = {
  // SpaceSecuritySettingRo
  spaceSecuritySettingRo: {
    fileSharable: true,
    invitable: true,
    joinable: false,
    allowDownloadAttachment: true,
    allowCopyDataToExternal: true,
    mobileShowable: false,
    watermarkEnable: false,
    exportLevel: 2,
    orgIsolated: false,
    rootManageable: false,
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.updateSecuritySetting(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceSecuritySettingRo** | **SpaceSecuritySettingRo**|  |
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **updateWorkbenchSetting**
> ResponseDataVoid updateWorkbenchSetting(spaceWorkbenchSettingRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .SpaceSpaceApiApi(configuration);

let body:.SpaceSpaceApiApiUpdateWorkbenchSettingRequest = {
  // SpaceWorkbenchSettingRo
  spaceWorkbenchSettingRo: {
    nodeExportable: true,
    watermarkEnable: true,
  },
  // string | space id
  xSpaceId: "spczJrh2i3tLW",
};

apiInstance.updateWorkbenchSetting(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceWorkbenchSettingRo** | **SpaceWorkbenchSettingRo**|  |
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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


