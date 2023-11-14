# .TemplateCenterTemplateAlbumAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAlbumContent**](TemplateCenterTemplateAlbumAPIApi.md#getAlbumContent) | **GET** /template/albums/{albumId} | Get The Template Album Content
[**getRecommendedAlbums**](TemplateCenterTemplateAlbumAPIApi.md#getRecommendedAlbums) | **GET** /template/albums/recommend | Get Recommended Template Albums


# **getAlbumContent**
> ResponseDataAlbumContentVo getAlbumContent()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAlbumAPIApi(configuration);

let body:.TemplateCenterTemplateAlbumAPIApiGetAlbumContentRequest = {
  // string | Template Album ID
  albumId: "albnafuwa2snc",
};

apiInstance.getAlbumContent(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **albumId** | [**string**] | Template Album ID | defaults to undefined


### Return type

**ResponseDataAlbumContentVo**

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

# **getRecommendedAlbums**
> ResponseDataListAlbumVo getRecommendedAlbums()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .TemplateCenterTemplateAlbumAPIApi(configuration);

let body:.TemplateCenterTemplateAlbumAPIApiGetRecommendedAlbumsRequest = {
  // string | Exclude Album (optional)
  excludeAlbumId: "albnafuwa2snc",
  // number | Max Count of Load.The number of response result may be smaller than it (optional)
  maxCount: 5,
};

apiInstance.getRecommendedAlbums(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **excludeAlbumId** | [**string**] | Exclude Album | (optional) defaults to undefined
 **maxCount** | [**number**] | Max Count of Load.The number of response result may be smaller than it | (optional) defaults to undefined


### Return type

**ResponseDataListAlbumVo**

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


