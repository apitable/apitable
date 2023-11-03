# .CliAuthorizationAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**authLogin**](CliAuthorizationAPIApi.md#authLogin) | **POST** /developer/auth/login | Login authorization, using the developer\&#39;s Api Key.
[**graphql**](CliAuthorizationAPIApi.md#graphql) | **GET** /developer/graphql | GraphQL Query
[**newApplet**](CliAuthorizationAPIApi.md#newApplet) | **GET** /developer/new/applet | New Cloud application
[**newToken**](CliAuthorizationAPIApi.md#newToken) | **GET** /developer/new/token | Create Developer Token
[**newWebhook**](CliAuthorizationAPIApi.md#newWebhook) | **GET** /developer/new/webhook | Creating a Cloud Hook
[**publishApplet**](CliAuthorizationAPIApi.md#publishApplet) | **GET** /developer/publish/applet | Publish cloud applications
[**showApplets**](CliAuthorizationAPIApi.md#showApplets) | **GET** /developer/show/applets | Listing cloud applications
[**showSpaces**](CliAuthorizationAPIApi.md#showSpaces) | **GET** /developer/show/spaces | space list
[**showWebhooks**](CliAuthorizationAPIApi.md#showWebhooks) | **GET** /developer/show/webhooks | Listing cloud hooks
[**uploadPlugin**](CliAuthorizationAPIApi.md#uploadPlugin) | **GET** /developer/upload/plugin | Upload plug-ins


# **authLogin**
> ResponseDataDevelopUserVo authLogin()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiAuthLoginRequest = {
  // string
  apiKey: "api_key_example",
};

apiInstance.authLogin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **apiKey** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataDevelopUserVo**

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

# **graphql**
> ResponseDataString graphql()

Query using Graph QL

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiGraphqlRequest = {
  // string | developer token
  developerToken: "AABBCC",
};

apiInstance.graphql(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **developerToken** | [**string**] | developer token | defaults to undefined


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

# **newApplet**
> ResponseDataString newApplet()

Create a new cloud application in the specified space.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiNewAppletRequest = {
  // string
  spaceId: "spaceId_example",
  // string | developer token
  developerToken: "AABBCC",
};

apiInstance.newApplet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **developerToken** | [**string**] | developer token | defaults to undefined


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

# **newToken**
> ResponseDataDeveloperVo newToken()

The developer token is passed for login. The network verifies whether the token is valid. The user name is returned and cached locally.   Generally speaking, this API is not used by vika-cli, but for Web side web page operations.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiNewTokenRequest = {
  // string | Normal login Session Token of the user.
  userSessionToken: "AAABBB",
};

apiInstance.newToken(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userSessionToken** | [**string**] | Normal login Session Token of the user. | defaults to undefined


### Return type

**ResponseDataDeveloperVo**

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

# **newWebhook**
> ResponseDataString newWebhook()

Creates a cloud hook in the specified applet.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiNewWebhookRequest = {
  // string | developer token
  developerToken: "AABBCC",
};

apiInstance.newWebhook(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **developerToken** | [**string**] | developer token | defaults to undefined


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

# **publishApplet**
> ResponseDataString publishApplet()

Specifies that the applet is published to the marketplace.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiPublishAppletRequest = {
  // string | developer token
  developerToken: "AABBCC",
};

apiInstance.publishApplet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **developerToken** | [**string**] | developer token | defaults to undefined


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

# **showApplets**
> ResponseDataString showApplets()

Lists all cloud applications in the specified space.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiShowAppletsRequest = {
  // string
  spaceId: "spaceId_example",
  // string | developer token
  developerToken: "AABBCC",
  // string | space id
  xSpaceId: "spcyQkKp9XJEl",
};

apiInstance.showApplets(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **developerToken** | [**string**] | developer token | defaults to undefined
 **xSpaceId** | [**string**] | space id | defaults to undefined


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

# **showSpaces**
> ResponseDataListSpaceShowcaseVo showSpaces()

List the space owned by the user.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:any = {};

apiInstance.showSpaces(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ResponseDataListSpaceShowcaseVo**

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

# **showWebhooks**
> ResponseDataString showWebhooks()

Lists all cloud hooks in the specified applet.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiShowWebhooksRequest = {
  // string
  appletId: "appletId_example",
  // string | developer token
  developerToken: "AABBCC",
};

apiInstance.showWebhooks(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **appletId** | [**string**] |  | defaults to undefined
 **developerToken** | [**string**] | developer token | defaults to undefined


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

# **uploadPlugin**
> ResponseDataString uploadPlugin()

Specifies the applet upload plug-in.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .CliAuthorizationAPIApi(configuration);

let body:.CliAuthorizationAPIApiUploadPluginRequest = {
  // string | developer token
  developerToken: "AABBCC",
};

apiInstance.uploadPlugin(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **developerToken** | [**string**] | developer token | defaults to undefined


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


