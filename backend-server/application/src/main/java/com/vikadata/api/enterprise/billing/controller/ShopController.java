package com.vikadata.api.enterprise.billing.controller;

import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.enterprise.billing.model.ProductPriceVo;
import com.vikadata.api.enterprise.billing.service.IShopService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Store API
 */
@RestController
@Api(tags = "Store API")
@ApiResource(path = "/shop")
@Slf4j
public class ShopController {

    @Resource
    private IShopService iShopService;

    @GetResource(path = "/prices", requiredPermission = false)
    @ApiOperation(value = "Get A Price List for A Product", notes = "Self-operated product price list")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "product", value = "product name", required = true, dataTypeClass = String.class, paramType = "query", example = "SILVER"),
    })
    public ResponseData<List<ProductPriceVo>> getPrices(@RequestParam("product") String productName) {
        List<ProductPriceVo> prices = iShopService.getPricesByProduct(productName);
        return ResponseData.success(prices);
    }
}
