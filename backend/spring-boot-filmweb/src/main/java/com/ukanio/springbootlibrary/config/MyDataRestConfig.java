package com.ukanio.springbootlibrary.config;


import com.ukanio.springbootlibrary.entity.Favourite;
import com.ukanio.springbootlibrary.entity.Message;
import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;


//conf REST API (Srping data Rest lib) rozszerzamy RepositoryRestConfigurter
@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {


    private String theAllowedOrigins = "https://localhost:3000";

    /*to sa metody ktore przekazujemy nizej do naszej nadpisanej metody */
    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions){

        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));

    }


    /*tutaj w tym miejscu nadpisujemy metode z dependency Spring Data Rest która odpowiada
    za ustawienia naszego Resta. */
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry corsRegistry) {

        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
                HttpMethod.DELETE};

               //dzieki temu indentyfikatory tych encji beda dostepene w rest api
                config.exposeIdsFor(Movie.class);
                config.exposeIdsFor(Review.class);
                config.exposeIdsFor(Message.class);
                config.exposeIdsFor(Favourite.class);

                disableHttpMethods(Movie.class, config, theUnsupportedActions);
                disableHttpMethods(Review.class, config, theUnsupportedActions);
                disableHttpMethods(Message.class, config, theUnsupportedActions);
                disableHttpMethods(Favourite.class, config, theUnsupportedActions);

                /* Configure CORS (Cross-origin resource sharing) Mapping*/
                corsRegistry.addMapping(config.getBasePath() + "/**")
                        .allowedOrigins(theAllowedOrigins);

        }



    }


