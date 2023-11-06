# .WeChatMiniAppAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authorize**](WeChatMiniAppAPIApi.md#authorize) | **GET** /wechat/miniapp/authorize | Authorized Login(wx.login user)
[**getInfo**](WeChatMiniAppAPIApi.md#getInfo) | **GET** /wechat/miniapp/getInfo | Get User Information
[**info**](WeChatMiniAppAPIApi.md#info) | **GET** /wechat/miniapp/info | Synchronize WeChat User Information
[**operate**](WeChatMiniAppAPIApi.md#operate) | **GET** /wechat/miniapp/operate | The Operation of The Applet Code
[**phone**](WeChatMiniAppAPIApi.md#phone) | **GET** /wechat/miniapp/phone | User authorized to use WeChat mobile number


# **authorize**
> ResponseDataLoginResultVo authorize()

Mini Program Authorized Login (Silent Authorization)

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMiniAppAPIApi(configuration);

let body:.WeChatMiniAppAPIApiAuthorizeRequest = {
  // string | Wechat login credentials obtained by wx.login
  code: "code_example",
};

apiInstance.authorize(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | [**string**] | Wechat login credentials obtained by wx.login | defaults to undefined


### Return type

**ResponseDataLoginResultVo**

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

# **getInfo**
> ResponseDataWechatInfoVo getInfo()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMiniAppAPIApi(configuration);

let body:any = {};

apiInstance.getInfo(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataWechatInfoVo**

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

# **info**
> ResponseDataVoid info()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMiniAppAPIApi(configuration);

let body:.WeChatMiniAppAPIApiInfoRequest = {
  // string | signature
  signature: "signature_example",
  // string | data
  rawData: "rawData_example",
  // string | encrypted data
  encryptedData: "encryptedData_example",
  // string | initial vector for encryption algorithm
  iv: "iv_example",
};

apiInstance.info(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **signature** | [**string**] | signature | defaults to undefined
 **rawData** | [**string**] | data | defaults to undefined
 **encryptedData** | [**string**] | encrypted data | defaults to undefined
 **iv** | [**string**] | initial vector for encryption algorithm | defaults to undefined


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

# **operate**
> ResponseDataVoid operate()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMiniAppAPIApi(configuration);

let body:.WeChatMiniAppAPIApiOperateRequest = {
  // number | type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account)
  type: 1,
  // string | mini program code unique identifier
  mark: "mark_example",
};

apiInstance.operate(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type** | [**number**] | type (0: Enter verification validity; 1: Confirm the login (the WeChat account of the Weige account is bound); 2: Cancel the login/bind the account; 3: Confirm the binding account) | defaults to undefined
 **mark** | [**string**] | mini program code unique identifier | defaults to undefined


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

# **phone**
> ResponseDataLoginResultVo phone()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeChatMiniAppAPIApi(configuration);

let body:.WeChatMiniAppAPIApiPhoneRequest = {
  // string | encrypted data
  encryptedData: "encryptedData_example",
  // string | initial vector for encryption algorithm
  iv: "iv_example",
  // string | mini program code unique identifier (optional)
  mark: "mark_example",
};

apiInstance.phone(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **encryptedData** | [**string**] | encrypted data | defaults to undefined
 **iv** | [**string**] | initial vector for encryption algorithm | defaults to undefined
 **mark** | [**string**] | mini program code unique identifier | (optional) defaults to undefined


### Return type

**ResponseDataLoginResultVo**

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


