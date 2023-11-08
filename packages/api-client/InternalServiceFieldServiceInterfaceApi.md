# .InternalServiceFieldServiceInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**urlContentsAwareFill**](InternalServiceFieldServiceInterfaceApi.md#urlContentsAwareFill) | **POST** /internal/field/url/awareContents | get url related information


# **urlContentsAwareFill**
> ResponseDataUrlAwareContentsVo urlContentsAwareFill(urlsWrapperRo)

get url related information

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServiceFieldServiceInterfaceApi(configuration);

let body:.InternalServiceFieldServiceInterfaceApiUrlContentsAwareFillRequest = {
  // UrlsWrapperRo
  urlsWrapperRo: {
    urls: [
      "urls_example",
    ],
  },
};

apiInstance.urlContentsAwareFill(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **urlsWrapperRo** | **UrlsWrapperRo**|  |


### Return type

**ResponseDataUrlAwareContentsVo**

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


