# .BasicModuleAttachmentInterfaceApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cite**](BasicModuleAttachmentInterfaceApi.md#cite) | **POST** /base/attach/cite | Changes in the number of references to space attachment resources
[**readReviews**](BasicModuleAttachmentInterfaceApi.md#readReviews) | **GET** /base/attach/readReviews | Paging query pictures that need manual review
[**submitAuditResult**](BasicModuleAttachmentInterfaceApi.md#submitAuditResult) | **POST** /base/attach/submitAuditResult | Submit image review results
[**upload**](BasicModuleAttachmentInterfaceApi.md#upload) | **POST** /base/attach/upload | Upload resources
[**urlUpload**](BasicModuleAttachmentInterfaceApi.md#urlUpload) | **POST** /base/attach/urlUpload | Image URL upload interface


# **cite**
> ResponseDataVoid cite(spaceAssetOpRo)

The same attachment needs to pass the token repeatedly

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAttachmentInterfaceApi(configuration);

let body:.BasicModuleAttachmentInterfaceApiCiteRequest = {
  // SpaceAssetOpRo
  spaceAssetOpRo: {
    addToken: [
      {
        token: "token_example",
        name: "name_example",
      },
    ],
    removeToken: [
      {
        token: "token_example",
        name: "name_example",
      },
    ],
    nodeId: "dst10",
  },
};

apiInstance.cite(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceAssetOpRo** | **SpaceAssetOpRo**|  |


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

# **readReviews**
> ResponseDataPageInfoAssetsAuditVo readReviews()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAttachmentInterfaceApi(configuration);

let body:.BasicModuleAttachmentInterfaceApiReadReviewsRequest = {
  // Page
  page: {
    records: [
      {},
    ],
    total: 1,
    size: 1,
    current: 1,
    orders: [
      {
        column: "column_example",
        asc: true,
      },
    ],
    optimizeCountSql: true,
    searchCount: true,
    optimizeJoinOfCountSql: true,
    countId: "countId_example",
    maxLimit: 1,
    pages: 1,
  },
  // string | Page params
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
};

apiInstance.readReviews(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | Page params | defaults to undefined


### Return type

**ResponseDataPageInfoAssetsAuditVo**

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

# **submitAuditResult**
> ResponseDataVoid submitAuditResult(assetsAuditRo)

Submit the image review results, enter the reviewer\'s name when submitting

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAttachmentInterfaceApi(configuration);

let body:.BasicModuleAttachmentInterfaceApiSubmitAuditResultRequest = {
  // AssetsAuditRo
  assetsAuditRo: {
    assetlist: [
      {
        assetFileUrl: "space/2020/03/27/1243592950910349313",
        auditResultSuggestion: "block",
      },
    ],
    auditorUserId: "0122454826077721",
    auditorName: "name",
  },
};

apiInstance.submitAuditResult(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **assetsAuditRo** | **AssetsAuditRo**|  |


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

# **upload**
> ResponseDataAssetUploadResult upload()

Upload resource files, any file type is unlimited

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAttachmentInterfaceApi(configuration);

let body:.BasicModuleAttachmentInterfaceApiUploadRequest = {
  // AttachOpRo (optional)
  attachOpRo: {
    file: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
    type: 0,
    nodeId: "dst10",
    data: "FutureIsComing",
  },
};

apiInstance.upload(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **attachOpRo** | **AttachOpRo**|  |


### Return type

**ResponseDataAssetUploadResult**

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

# **urlUpload**
> ResponseDataAssetUploadResult urlUpload()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BasicModuleAttachmentInterfaceApi(configuration);

let body:.BasicModuleAttachmentInterfaceApiUrlUploadRequest = {
  // AttachUrlOpRo (optional)
  attachUrlOpRo: {
    url: "url_example",
    type: 0,
    nodeId: "dst10",
  },
};

apiInstance.urlUpload(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **attachUrlOpRo** | **AttachUrlOpRo**|  |


### Return type

**ResponseDataAssetUploadResult**

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


