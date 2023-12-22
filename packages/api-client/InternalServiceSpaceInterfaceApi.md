# .InternalServiceSpaceInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**apiRateLimit**](InternalServiceSpaceInterfaceApi.md#apiRateLimit) | **GET** /internal/space/{spaceId}/apiRateLimit | get api qps information of a specified space
[**apiUsages**](InternalServiceSpaceInterfaceApi.md#apiUsages) | **GET** /internal/space/{spaceId}/apiUsages | get api usage information of a specified space
[**getAutomationRunMessage**](InternalServiceSpaceInterfaceApi.md#getAutomationRunMessage) | **GET** /internal/space/{spaceId}/automation/run/message | get space automation run message
[**getCreditUsages1**](InternalServiceSpaceInterfaceApi.md#getCreditUsages1) | **GET** /internal/space/{spaceId}/credit/usages | get space credit used usage
[**getSpaceCapacity**](InternalServiceSpaceInterfaceApi.md#getSpaceCapacity) | **GET** /internal/space/{spaceId}/capacity | get attachment capacity information for a space
[**getSpaceSubscription**](InternalServiceSpaceInterfaceApi.md#getSpaceSubscription) | **GET** /internal/space/{spaceId}/subscription | get subscription information for a space
[**getSpaceUsages**](InternalServiceSpaceInterfaceApi.md#getSpaceUsages) | **GET** /internal/space/{spaceId}/usages | get space used usage information
[**labs**](InternalServiceSpaceInterfaceApi.md#labs) | **GET** /internal/space/{spaceId} | get space information
[**statistics**](InternalServiceSpaceInterfaceApi.md#statistics) | **POST** /internal/space/{spaceId}/statistics | get space information


# **apiRateLimit**
> ResponseDataInternalSpaceApiRateLimitVo apiRateLimit()

Provides the authentication function of the middle layer request, and queries the API aps information in the subscription plan corresponding to the space.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiApiRateLimitRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.apiRateLimit(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataInternalSpaceApiRateLimitVo**

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

# **apiUsages**
> ResponseDataInternalSpaceApiUsageVo apiUsages()

Provides the authentication function of the middle layer request, and queries the API usage information in the subscription plan corresponding to the space.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiApiUsagesRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.apiUsages(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataInternalSpaceApiUsageVo**

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

# **getAutomationRunMessage**
> ResponseDataInternalSpaceAutomationRunMessageV0 getAutomationRunMessage()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiGetAutomationRunMessageRequest = {
  // string | space id
  spaceId: "spczJrh2i3tLW",
};

apiInstance.getAutomationRunMessage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataInternalSpaceAutomationRunMessageV0**

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

# **getCreditUsages1**
> ResponseDataInternalCreditUsageVo getCreditUsages1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiGetCreditUsages1Request = {
  // string | space id
  spaceId: "spczJrh2i3tLW",
};

apiInstance.getCreditUsages1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataInternalCreditUsageVo**

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

# **getSpaceCapacity**
> ResponseDataInternalSpaceCapacityVo getSpaceCapacity()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiGetSpaceCapacityRequest = {
  // string | space id
  spaceId: "spczJrh2i3tLW",
};

apiInstance.getSpaceCapacity(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataInternalSpaceCapacityVo**

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

# **getSpaceSubscription**
> ResponseDataInternalSpaceSubscriptionVo getSpaceSubscription()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiGetSpaceSubscriptionRequest = {
  // string | space id
  spaceId: "spczJrh2i3tLW",
};

apiInstance.getSpaceSubscription(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataInternalSpaceSubscriptionVo**

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

# **getSpaceUsages**
> ResponseDataInternalSpaceUsageVo getSpaceUsages()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiGetSpaceUsagesRequest = {
  // string | space id
  spaceId: "spczJrh2i3tLW",
};

apiInstance.getSpaceUsages(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] | space id | defaults to undefined


### Return type

**ResponseDataInternalSpaceUsageVo**

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

# **labs**
> ResponseDataInternalSpaceInfoVo labs()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiLabsRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.labs(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataInternalSpaceInfoVo**

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

# **statistics**
> ResponseDataVoid statistics(spaceStatisticsRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceSpaceInterfaceApi(configuration);

let body:.InternalServiceSpaceInterfaceApiStatisticsRequest = {
  // SpaceStatisticsRo
  spaceStatisticsRo: {
    viewCount: {
      "key": 1,
    },
    recordCount: 111,
  },
  // string
  spaceId: "spaceId_example",
};

apiInstance.statistics(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceStatisticsRo** | **SpaceStatisticsRo**|  |
 **spaceId** | [**string**] |  | defaults to undefined


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


