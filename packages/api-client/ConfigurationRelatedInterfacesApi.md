# .ConfigurationRelatedInterfacesApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**general**](ConfigurationRelatedInterfacesApi.md#general) | **POST** /config/general | General configuration
[**get2**](ConfigurationRelatedInterfacesApi.md#get2) | **GET** /config/get | Get configuration information


# **general**
> ResponseDataVoid general(configRo)

Scenario: novice guidance, announcement

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ConfigurationRelatedInterfacesApi(configuration);

let body:.ConfigurationRelatedInterfacesApiGeneralRequest = {
  // ConfigRo
  configRo: {
    type: 1,
    content: "json",
    rollback: true,
    lang: "zh-CN",
  },
};

apiInstance.general(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **configRo** | **ConfigRo**|  |


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

# **get2**
> ResponseDataObject get2()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ConfigurationRelatedInterfacesApi(configuration);

let body:.ConfigurationRelatedInterfacesApiGet2Request = {
  // string | language (optional)
  lang: "zh_CN",
};

apiInstance.get2(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **lang** | [**string**] | language | (optional) defaults to undefined


### Return type

**ResponseDataObject**

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


