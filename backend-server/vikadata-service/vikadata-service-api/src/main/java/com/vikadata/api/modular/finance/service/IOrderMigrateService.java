package com.vikadata.api.modular.finance.service;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface IOrderMigrateService {
    void migrateBusinessOrder() throws JsonProcessingException;
}
