package com.ukanio.springbootlibrary.controller;

import com.ukanio.springbootlibrary.requestmodels.AddMovieRequest;
import com.ukanio.springbootlibrary.service.AdminService;
import com.ukanio.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;
import java.lang.Exception;


@RestController
@CrossOrigin("https://localhost:3000")
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    //endpoint do dodawania filmow
    @PostMapping("/secure/add/movie")
    public void postBook(@RequestHeader(value = "Authorization") String token, @RequestBody AddMovieRequest addMovieRequest) throws Exception{

        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.postMovie(addMovieRequest);
    }

    //endpoint do dodawania (o 1) ilosci filmow
    @PutMapping("/secure/increase/movie/quantity")
    public void increaseMovieQuantity(@RequestHeader(value = "Authorization") String token, @RequestParam Long movieId) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.increaseMovieQuantity(movieId);
    }

    //endpoint do zmniejszania (o 1) ilosci filmow
    @PutMapping("/secure/decrease/movie/quantity")
    public void decreaseMovieQuantity(@RequestHeader(value = "Authorization") String token, @RequestParam Long movieId) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.decreaseMovieQuantity(movieId);
    }

    //ednpoint do usuwania ksiazek
    @DeleteMapping("/secure/delete/movie")
    public void deleteMovieQuantity(@RequestHeader(value = "Authorization") String token, @RequestParam Long movieId) throws Exception{
        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.deleteMovie(movieId);
    }


}
