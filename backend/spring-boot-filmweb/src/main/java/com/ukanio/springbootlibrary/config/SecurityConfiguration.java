package com.ukanio.springbootlibrary.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;


//Generalnie cała ta klasa sprawia, że nie mamy dostepu do API jeśli nie jesteśmy zalogowani.
//Tutaj wszystko ogarnia to po swojej stronie Okta :)
@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        //Wylaczam CRS (Cross Site Request Forgery)
        http.csrf().disable();

        // zabezpieczam endpointy /api/<cosTam>/secure :)
        http.authorizeRequests(Configurer ->
            Configurer
                    .antMatchers("/api/movies/secure/**",
                            "/api/reviews/secure/**",
                            "/api/messages/secure/**",
                            "/api/admin/secure/**",
                            "/api/favourite/secure/**")
                    .authenticated())
                .oauth2ResourceServer()
                .jwt();

        //dodaje CORS filtry
        http.cors();

        // Dodaje
        http.setSharedObject(ContentNegotiationStrategy.class,
                new HeaderContentNegotiationStrategy());


        //zmieniamy domyslna odpowiedz 401 zeby byla lepiej zrozumiala
        Okta.configureResourceServer401ResponseBody(http);

        // dajemy .build bo uzywa Http design patterna builder :>
        return http.build();
    }

}
