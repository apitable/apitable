# .WidgetUploadAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**generateWidgetPreSignedUrl**](WidgetUploadAPIApi.md#generateWidgetPreSignedUrl) | **POST** /asset/widget/{packageId}/uploadPreSignedUrl | Get widget file upload pre signed url
[**getWidgetUploadMeta**](WidgetUploadAPIApi.md#getWidgetUploadMeta) | **POST** /asset/widget/uploadMeta | get widget upload meta


# **generateWidgetPreSignedUrl**
> ResponseDataListWidgetUploadTokenVo generateWidgetPreSignedUrl(widgetAssetUploadCertificateRO, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetUploadAPIApi(configuration);

let body:.WidgetUploadAPIApiGenerateWidgetPreSignedUrlRequest = {
  // WidgetAssetUploadCertificateRO
  widgetAssetUploadCertificateRO: {
    filenames: [
      "filenames_example",
    ],
    fileType: 1,
    count: 1,
    version: "version_example",
    fileExtName: [
      "fileExtName_example",
    ],
  },
  // string
  packageId: "packageId_example",
};

apiInstance.generateWidgetPreSignedUrl(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **widgetAssetUploadCertificateRO** | **WidgetAssetUploadCertificateRO**|  |
 **packageId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataListWidgetUploadTokenVo**

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

# **getWidgetUploadMeta**
> ResponseDataWidgetUploadMetaVo getWidgetUploadMeta()

get widget upload meta

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WidgetUploadAPIApi(configuration);

let body:any = {};

apiInstance.getWidgetUploadMeta(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataWidgetUploadMetaVo**

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


