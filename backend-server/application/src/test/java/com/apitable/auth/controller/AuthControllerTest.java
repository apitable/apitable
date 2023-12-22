package com.apitable.auth.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.apitable.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

public class AuthControllerTest extends AbstractIntegrationTest {

    @Test
    public void loginWhenValidCsrfTokenThenSuccess() throws Exception {
        createSingleUserAndSpace();
        mockMvc.perform(post("/api/v1/signIn").with(csrf())
                .accept(MediaType.APPLICATION_JSON)
                .param("username", "test_user@apitable.com")
                .param("password", "123456"))
            .andExpect(status().is2xxSuccessful());
    }

    @Test
    public void logoutWhenValidCsrfTokenThenSuccess() throws Exception {
        this.mockMvc.perform(post("/api/v1/signOut").with(csrf())
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().is2xxSuccessful());
    }
}
