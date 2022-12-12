package com.vikadata.api.shared.security;

public interface PasswordService {

    boolean matches(CharSequence rawPassword, String encodedPassword);

    String encode(CharSequence rawPassword);
}
