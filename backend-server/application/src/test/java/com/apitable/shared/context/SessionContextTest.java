package com.apitable.shared.context;

import com.apitable.Application;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


@SpringBootTest(classes = Application.class)
public class SessionContextTest {

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