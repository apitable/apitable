# .WeChatMpAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callback1**](WeChatMpAPIApi.md#callback1) | **GET** /wechat/mp/web/callback | Web Page Authorization Callback
[**poll**](WeChatMpAPIApi.md#poll) | **GET** /wechat/mp/poll | Scan poll
[**qrcode**](WeChatMpAPIApi.md#qrcode) | **GET** /wechat/mp/qrcode | Get qrcode
[**signature**](WeChatMpAPIApi.md#signature) | **POST** /wechat/mp/signature | Get wechat signature


# **callback1**
> ResponseDataString callback1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMpAPIApi(configuration);

let body:.WeChatMpAPIApiCallback1Request = {
  // string | coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection
  code: "ABC123",
  // string | declare value. Used to prevent replay attacks
  state: "STATE",
};

apiInstance.callback1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] | coding. JS gets the loginTmpCode, redirects and returns after jumping to the specified connection | defaults to undefined
 **state** | [**string**] | declare value. Used to prevent replay attacks | defaults to undefined


### Return type

**ResponseDataString**

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

# **poll**
> ResponseDataString poll()

Scene: Scan code login, account binding polling results

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMpAPIApi(configuration);

let body:.WeChatMpAPIApiPollRequest = {
  // number | type (0: scan code to log in; 1: account binding)
  type: 0,
  // string | the unique identifier of the qrcode
  mark: "mark11",
};

apiInstance.poll(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | [**number**] | type (0: scan code to log in; 1: account binding) | defaults to undefined
 **mark** | [**string**] | the unique identifier of the qrcode | defaults to undefined


### Return type

**ResponseDataString**

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

# **qrcode**
> ResponseDataQrCodeVo qrcode()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMpAPIApi(configuration);

let body:any = {};

apiInstance.qrcode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataQrCodeVo**

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

# **signature**
> ResponseDataWxJsapiSignature signature(mpSignatureRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMpAPIApi(configuration);

let body:.WeChatMpAPIApiSignatureRequest = {
  // MpSignatureRo
  mpSignatureRo: {
    url: "https://...",
  },
};

apiInstance.signature(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **mpSignatureRo** | **MpSignatureRo**|  |


### Return type

**ResponseDataWxJsapiSignature**

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


