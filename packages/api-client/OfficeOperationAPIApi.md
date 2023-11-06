# .OfficeOperationAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**officePreview**](OfficeOperationAPIApi.md#officePreview) | **POST** /base/attach/officePreview/{spaceId} | Office document preview conversion


# **officePreview**
> ResponseDataString officePreview(attachOfficePreviewRo, )

Office document preview conversion,call Yongzhong office conversion interface

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .OfficeOperationAPIApi(configuration);

let body:.OfficeOperationAPIApiOfficePreviewRequest = {
  // AttachOfficePreviewRo
  attachOfficePreviewRo: {
    token: "space/2020/03/27/1243592950910349313",
    attname: "Leida Team Books.xls",
  },
  // string
  spaceId: "spaceId_example",
};

apiInstance.officePreview(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **attachOfficePreviewRo** | **AttachOfficePreviewRo**|  |
 **spaceId** | [**string**] |  | defaults to undefined


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
**500** | Internal Server Error |  -  |
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


