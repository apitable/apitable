# .WeChatOpenPlatformAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**callback**](WeChatOpenPlatformAPIApi.md#callback) | **POST** /wechat/open/callback/{appId} | WeChat Message Push Callback
[**createPreAuthUrl**](WeChatOpenPlatformAPIApi.md#createPreAuthUrl) | **GET** /wechat/open/createPreAuthUrl | Create Pre-authorization URL
[**createWxQrCode**](WeChatOpenPlatformAPIApi.md#createWxQrCode) | **POST** /wechat/open/createWxQrCode | Generates Qrcode
[**delQrCode**](WeChatOpenPlatformAPIApi.md#delQrCode) | **POST** /wechat/open/delQrCode | Delete Qrcode
[**delQrCode1**](WeChatOpenPlatformAPIApi.md#delQrCode1) | **DELETE** /wechat/open/delQrCode | Delete Qrcode
[**getAuthorizerInfo**](WeChatOpenPlatformAPIApi.md#getAuthorizerInfo) | **GET** /wechat/open/createAuthorizerInfo | Obtain the basic information of the authorized account
[**getAuthorizerList**](WeChatOpenPlatformAPIApi.md#getAuthorizerList) | **GET** /wechat/open/getAuthorizerList | Get All Authorized Account Information
[**getComponentVerifyTicket**](WeChatOpenPlatformAPIApi.md#getComponentVerifyTicket) | **POST** /wechat/open/receiveTicket | Receive Verification Ticket
[**getQrCodePage**](WeChatOpenPlatformAPIApi.md#getQrCodePage) | **GET** /wechat/open/getQrCodePage | Query Qrcode pagination list
[**getQueryAuth**](WeChatOpenPlatformAPIApi.md#getQueryAuth) | **GET** /wechat/open/getQueryAuth | Get Authorization Code Get Authorization Information
[**getWechatIpList**](WeChatOpenPlatformAPIApi.md#getWechatIpList) | **GET** /wechat/open/getWechatIpList | Get WeChat server IP list
[**updateWxReply**](WeChatOpenPlatformAPIApi.md#updateWxReply) | **GET** /wechat/open/updateWxReply | Synchronously update WeChat keyword automatic reply rules


# **callback**
> any callback()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiCallbackRequest = {
  // string
  appId: "appId_example",
  // string
  signature: "signature_example",
  // string
  timestamp: "timestamp_example",
  // string
  nonce: "nonce_example",
  // string
  openid: "openid_example",
  // string
  encryptType: "encrypt_type_example",
  // string
  msgSignature: "msg_signature_example",
  // string (optional)
  body: "body_example",
};

apiInstance.callback(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **string**|  |
 **appId** | [**string**] |  | defaults to undefined
 **signature** | [**string**] |  | defaults to undefined
 **timestamp** | [**string**] |  | defaults to undefined
 **nonce** | [**string**] |  | defaults to undefined
 **openid** | [**string**] |  | defaults to undefined
 **encryptType** | [**string**] |  | defaults to undefined
 **msgSignature** | [**string**] |  | defaults to undefined


### Return type

**any**

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

# **createPreAuthUrl**
> ResponseDataString createPreAuthUrl()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiCreatePreAuthUrlRequest = {
  // string | Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed
  authType: "3",
  // string | Authorized Official Account or Mini Program AppId
  componentAppid: "wx3ccd2f6264309a7c",
};

apiInstance.createPreAuthUrl(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authType** | [**string**] | Authorized account type, 1. Only the official account authorization list is displayed, 2. Only the applet authorization list is displayed, 3. Both are displayed | defaults to undefined
 **componentAppid** | [**string**] | Authorized Official Account or Mini Program AppId | defaults to undefined


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

# **createWxQrCode**
> ResponseDataQrCodeVo createWxQrCode()

The scene value cannot be passed at all, and the string type is preferred.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiCreateWxQrCodeRequest = {
  // string | qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE) (optional)
  type: "QR_LIMIT_STR_SCENE",
  // number | the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds. (optional)
  expireSeconds: 2592000,
  // number | scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000) (optional)
  sceneId: 1,
  // string | Scene value ID (ID in string form), string type, length limited from 1 to 64. (optional)
  sceneStr: "weibo",
  // string | wechat public account appId (optional)
  appId: "wx73eb141189",
};

apiInstance.createWxQrCode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | [**string**] | qrcode type, type value (temporary integer value: QR_SCENE, temporary string value: QR_STR_SCENE; permanent integer value: QR_LIMIT_SCENE, permanent string value: QR_LIMIT_STR_SCENE) | (optional) defaults to undefined
 **expireSeconds** | [**number**] | the valid time of the QR code, in seconds. The maximum is not more than 2592000 (that is, 30 days), and the default is 30 seconds. | (optional) defaults to undefined
 **sceneId** | [**number**] | scene value ID, a 32-bit non-zero integer for a temporary QR code, and a maximum value of 100000 for a permanent QR code (current parameters only support 1--100000) | (optional) defaults to undefined
 **sceneStr** | [**string**] | Scene value ID (ID in string form), string type, length limited from 1 to 64. | (optional) defaults to undefined
 **appId** | [**string**] | wechat public account appId | (optional) defaults to undefined


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

# **delQrCode**
> ResponseDataVoid delQrCode()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiDelQrCodeRequest = {
  // string | qrcode ID
  qrCodeId: "12345",
  // string | wechat public account appId (optional)
  appId: "wx73eb141189",
};

apiInstance.delQrCode(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **qrCodeId** | [**string**] | qrcode ID | defaults to undefined
 **appId** | [**string**] | wechat public account appId | (optional) defaults to undefined


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

# **delQrCode1**
> ResponseDataVoid delQrCode1()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiDelQrCode1Request = {
  // string | qrcode ID
  qrCodeId: "12345",
  // string | wechat public account appId (optional)
  appId: "wx73eb141189",
};

apiInstance.delQrCode1(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **qrCodeId** | [**string**] | qrcode ID | defaults to undefined
 **appId** | [**string**] | wechat public account appId | (optional) defaults to undefined


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

# **getAuthorizerInfo**
> ResponseDataWechatAuthorizationEntity getAuthorizerInfo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiGetAuthorizerInfoRequest = {
  // string (optional)
  authorizerAppid: "authorizerAppid_example",
};

apiInstance.getAuthorizerInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorizerAppid** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataWechatAuthorizationEntity**

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

# **getAuthorizerList**
> ResponseDataWxOpenAuthorizerListResult getAuthorizerList()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:any = {};

apiInstance.getAuthorizerList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataWxOpenAuthorizerListResult**

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

# **getComponentVerifyTicket**
> string getComponentVerifyTicket()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiGetComponentVerifyTicketRequest = {
  // string
  timestamp: "timestamp_example",
  // string
  nonce: "nonce_example",
  // string
  signature: "signature_example",
  // string (optional)
  body: "body_example",
  // string (optional)
  encryptType: "encrypt_type_example",
  // string (optional)
  msgSignature: "msg_signature_example",
};

apiInstance.getComponentVerifyTicket(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **string**|  |
 **timestamp** | [**string**] |  | defaults to undefined
 **nonce** | [**string**] |  | defaults to undefined
 **signature** | [**string**] |  | defaults to undefined
 **encryptType** | [**string**] |  | (optional) defaults to undefined
 **msgSignature** | [**string**] |  | (optional) defaults to undefined


### Return type

**string**

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

# **getQrCodePage**
> ResponseDataPageInfoQrCodePageVo getQrCodePage()

Description of Paging: <br/> pageNo: number of paging <br/>pageSize: size of paging。<br/>order: order in current page。<br/>sort: sorting in current page。<br/>simple usage example：{\"pageNo\":1,\"pageSize\":20}<br/>complex usage example：{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiGetQrCodePageRequest = {
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
  // string | page params
  pageObjectParams: "{"pageNo":1,"pageSize":20}",
  // string | wechat public account appId (optional)
  appId: "wx73eb141189",
};

apiInstance.getQrCodePage(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **Page** |  | defaults to undefined
 **pageObjectParams** | [**string**] | page params | defaults to undefined
 **appId** | [**string**] | wechat public account appId | (optional) defaults to undefined


### Return type

**ResponseDataPageInfoQrCodePageVo**

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

# **getQueryAuth**
> ResponseDataWechatAuthorizationEntity getQueryAuth()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiGetQueryAuthRequest = {
  // string (optional)
  authCode: "auth_code_example",
};

apiInstance.getQueryAuth(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authCode** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataWechatAuthorizationEntity**

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

# **getWechatIpList**
> ResponseDataListString getWechatIpList()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiGetWechatIpListRequest = {
  // string (optional)
  appId: "appId_example",
};

apiInstance.getWechatIpList(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataListString**

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

# **updateWxReply**
> ResponseDataVoid updateWxReply()

Be sure to add keyword replies first in the background of the official account

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatOpenPlatformAPIApi(configuration);

let body:.WeChatOpenPlatformAPIApiUpdateWxReplyRequest = {
  // string (optional)
  appId: "appId_example",
};

apiInstance.updateWxReply(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appId** | [**string**] |  | (optional) defaults to undefined


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


