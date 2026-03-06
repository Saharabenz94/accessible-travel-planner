package com.accessible.travel;

import com.accessible.travel.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class AccessibleTravelPlannerApplicationTests {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void contextLoads() {
        assertThat(jwtTokenProvider).isNotNull();
    }

    @Test
    void jwtTokenGenerationAndValidation() {
        UserDetails userDetails = User.withUsername("test@example.com")
                .password("password")
                .authorities(Collections.emptyList())
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);
        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.extractUsername(token)).isEqualTo("test@example.com");
        assertThat(jwtTokenProvider.validateToken(token, userDetails)).isTrue();
    }
}
