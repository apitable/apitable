# .BillingOrderAPIApi

All URIs are relative to *http://backend/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**checkOrderPaidStatus**](BillingOrderAPIApi.md#checkOrderPaidStatus) | **GET** /orders/{orderId}/paidCheck | Check Order Payment Status
[**createOrder**](BillingOrderAPIApi.md#createOrder) | **POST** /orders | Create Order
[**createOrderPayment**](BillingOrderAPIApi.md#createOrderPayment) | **POST** /orders/{orderId}/payment | Create Payment Order
[**fetchOrderById**](BillingOrderAPIApi.md#fetchOrderById) | **GET** /orders/{orderId} | Get Order Details
[**generateDryRunOrder**](BillingOrderAPIApi.md#generateDryRunOrder) | **POST** /orders/dryRun/generate | Test run order
[**getOrderPaidStatus**](BillingOrderAPIApi.md#getOrderPaidStatus) | **GET** /orders/{orderId}/paid | Get Order Payment Status


# **checkOrderPaidStatus**
> ResponseDataPaymentOrderStatusVo checkOrderPaidStatus()

check order paid status when client polling is longer

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingOrderAPIApi(configuration);

let body:.BillingOrderAPIApiCheckOrderPaidStatusRequest = {
  // string | order id
  orderId: "SILVER",
};

apiInstance.checkOrderPaidStatus(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**string**] | order id | defaults to undefined


### Return type

**ResponseDataPaymentOrderStatusVo**

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

# **createOrder**
> ResponseDataOrderDetailVo createOrder(createOrderRo)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingOrderAPIApi(configuration);

let body:.BillingOrderAPIApiCreateOrderRequest = {
  // CreateOrderRo
  createOrderRo: {
    spaceId: "spc2123s",
    product: "SILVER",
    seat: 10,
    month: 6,
  },
};

apiInstance.createOrder(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createOrderRo** | **CreateOrderRo**|  |


### Return type

**ResponseDataOrderDetailVo**

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

# **createOrderPayment**
> ResponseDataOrderPaymentVo createOrderPayment(payOrderRo, )


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingOrderAPIApi(configuration);

let body:.BillingOrderAPIApiCreateOrderPaymentRequest = {
  // PayOrderRo
  payOrderRo: {
    orderNo: "SILVER",
    payChannel: "wx_pub_qr",
  },
  // string | order id
  orderId: "SILVER",
};

apiInstance.createOrderPayment(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **payOrderRo** | **PayOrderRo**|  |
 **orderId** | [**string**] | order id | defaults to undefined


### Return type

**ResponseDataOrderPaymentVo**

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

# **fetchOrderById**
> ResponseDataOrderDetailVo fetchOrderById()

fetch order detail by id

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingOrderAPIApi(configuration);

let body:.BillingOrderAPIApiFetchOrderByIdRequest = {
  // string
  orderId: "orderId_example",
};

apiInstance.fetchOrderById(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**string**] |  | defaults to undefined


### Return type

**ResponseDataOrderDetailVo**

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

# **generateDryRunOrder**
> ResponseDataOrderPreview generateDryRunOrder(dryRunOrderArgs)

According to the subscription change type (new subscription, subscription renewal, subscription change, subscription cancellation), preview the orders to be generated by the system in the future

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingOrderAPIApi(configuration);

let body:.BillingOrderAPIApiGenerateDryRunOrderRequest = {
  // DryRunOrderArgs
  dryRunOrderArgs: {
    action: "UPGRADE",
    spaceId: "spc2123s",
    product: "SILVER",
    seat: 10,
    month: 6,
  },
};

apiInstance.generateDryRunOrder(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dryRunOrderArgs** | **DryRunOrderArgs**|  |


### Return type

**ResponseDataOrderPreview**

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

# **getOrderPaidStatus**
> ResponseDataPaymentOrderStatusVo getOrderPaidStatus()

get order paid status when client polling

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .BillingOrderAPIApi(configuration);

let body:.BillingOrderAPIApiGetOrderPaidStatusRequest = {
  // string | order id
  orderId: "SILVER",
};

apiInstance.getOrderPaidStatus(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**string**] | order id | defaults to undefined


### Return type

**ResponseDataPaymentOrderStatusVo**

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


