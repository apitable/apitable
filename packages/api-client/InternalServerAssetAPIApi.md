# .InternalServerAssetAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get**](InternalServerAssetAPIApi.md#get) | **GET** /internal/asset/get | Get Asset Info
[**getSignatureUrls1**](InternalServerAssetAPIApi.md#getSignatureUrls1) | **GET** /internal/asset/signatures | Batch get asset signature url
[**getSpaceCapacity1**](InternalServerAssetAPIApi.md#getSpaceCapacity1) | **GET** /internal/asset/upload/preSignedUrl | Get Upload PreSigned URL


# **get**
> ResponseDataAssetUploadResult get()

scene：Fusion server query the attachment field data before writing

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServerAssetAPIApi(configuration);

let body:.InternalServerAssetAPIApiGetRequest = {
  // string | resource key
  token: "space/2019/12/10/159",
};

apiInstance.get(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | [**string**] | resource key | defaults to undefined


### Return type

**ResponseDataAssetUploadResult**

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

# **getSignatureUrls1**
> ResponseDataListAssetUrlSignatureVo getSignatureUrls1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServerAssetAPIApi(configuration);

let body:.InternalServerAssetAPIApiGetSignatureUrls1Request = {
  // Array<string>
  resourceKeys: [
    "resourceKeys_example",
  ],
};

apiInstance.getSignatureUrls1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **resourceKeys** | **Array&lt;string&gt;** |  | defaults to undefined


### Return type

**ResponseDataListAssetUrlSignatureVo**

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

# **getSpaceCapacity1**
> ResponseDataListAssetUploadCertificateVO getSpaceCapacity1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InternalServerAssetAPIApi(configuration);

let body:.InternalServerAssetAPIApiGetSpaceCapacity1Request = {
  // string | node custom id
  nodeId: "dst123",
  // string | number to create (default 1, max 20) (optional)
  count: "2",
};

apiInstance.getSpaceCapacity1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **nodeId** | [**string**] | node custom id | defaults to undefined
 **count** | [**string**] | number to create (default 1, max 20) | (optional) defaults to undefined


### Return type

**ResponseDataListAssetUploadCertificateVO**

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


