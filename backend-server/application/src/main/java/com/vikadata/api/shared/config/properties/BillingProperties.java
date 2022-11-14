package com.vikadata.api.shared.config.properties;

import lombok.Data;

import com.vikadata.api.enterprise.billing.util.model.ProductChannel;

import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "vikadata.billing")
public class BillingProperties {

    private ProductChannel channel = ProductChannel.VIKA;
}
