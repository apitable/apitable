package com.apitable.shared.context;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.apitable.AbstractIntegrationTest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Disabled
public class SessionContextTest extends AbstractIntegrationTest {

    @Test
    public void testGetUserId_WhenRequestParamNotNull() {
        Long expectedUserId = 67890L;
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setParameter("userId", expectedUserId.toString());
        ServletRequestAttributes attributes = new ServletRequestAttributes(mockRequest);
        RequestContextHolder.setRequestAttributes(attributes);
        assertEquals(expectedUserId, SessionContext.getUserId());
    }
}