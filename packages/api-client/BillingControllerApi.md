# .BillingControllerApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancelSubscription**](BillingControllerApi.md#cancelSubscription) | **POST** /billing/cancelSubscription | 
[**changePaymentMethod**](BillingControllerApi.md#changePaymentMethod) | **POST** /billing/changePaymentMethod | 
[**customerPortalUrl**](BillingControllerApi.md#customerPortalUrl) | **POST** /billing/customers/portal | 
[**getInvoices**](BillingControllerApi.md#getInvoices) | **GET** /billing/invoices | 
[**getSubscriptions**](BillingControllerApi.md#getSubscriptions) | **GET** /billing/subscriptions | 
[**updateSubscription**](BillingControllerApi.md#updateSubscription) | **POST** /billing/updateSubscription | 
[**updateSubscriptionConfirm**](BillingControllerApi.md#updateSubscriptionConfirm) | **POST** /billing/updateSubscriptionConfirm | 


# **cancelSubscription**
> ResponseDataBillingSessionVO cancelSubscription()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiCancelSubscriptionRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  subscriptionId: "subscriptionId_example",
};

apiInstance.cancelSubscription(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **subscriptionId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataBillingSessionVO**

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

# **changePaymentMethod**
> ResponseDataBillingSessionVO changePaymentMethod()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiChangePaymentMethodRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.changePaymentMethod(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataBillingSessionVO**

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

# **customerPortalUrl**
> ResponseDataBillingSessionVO customerPortalUrl()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiCustomerPortalUrlRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.customerPortalUrl(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataBillingSessionVO**

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

# **getInvoices**
> ResponseDataCustomerInvoices getInvoices()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiGetInvoicesRequest = {
  // string
  spaceId: "spaceId_example",
  // string (optional)
  startingAfter: "startingAfter_example",
  // string (optional)
  endingBefore: "endingBefore_example",
  // number (optional)
  limit: 10,
};

apiInstance.getInvoices(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **startingAfter** | [**string**] |  | (optional) defaults to undefined
 **endingBefore** | [**string**] |  | (optional) defaults to undefined
 **limit** | [**number**] |  | (optional) defaults to 10


### Return type

**ResponseDataCustomerInvoices**

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

# **getSubscriptions**
> ResponseDataBillingInfo getSubscriptions()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiGetSubscriptionsRequest = {
  // string
  spaceId: "spaceId_example",
};

apiInstance.getSubscriptions(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataBillingInfo**

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

# **updateSubscription**
> ResponseDataBillingSessionVO updateSubscription()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiUpdateSubscriptionRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  subscriptionId: "subscriptionId_example",
  // string (optional)
  action: "action_example",
};

apiInstance.updateSubscription(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **subscriptionId** | [**string**] |  | defaults to undefined
 **action** | [**string**] |  | (optional) defaults to undefined


### Return type

**ResponseDataBillingSessionVO**

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

# **updateSubscriptionConfirm**
> ResponseDataBillingSessionVO updateSubscriptionConfirm()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingControllerApi(configuration);

let body:.BillingControllerApiUpdateSubscriptionConfirmRequest = {
  // string
  spaceId: "spaceId_example",
  // string
  subscriptionId: "subscriptionId_example",
  // string
  priceId: "priceId_example",
};

apiInstance.updateSubscriptionConfirm(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **spaceId** | [**string**] |  | defaults to undefined
 **subscriptionId** | [**string**] |  | defaults to undefined
 **priceId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataBillingSessionVO**

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


