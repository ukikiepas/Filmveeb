package com.ukanio.springbootlibrary.controller;

import com.ukanio.springbootlibrary.requestmodels.AddBookRequest;
import com.ukanio.springbootlibrary.service.AdminService;
import com.ukanio.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    //endpoint do dodawania filmow
    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token, @RequestBody AddBookRequest addBookRequest) throws Exception{

        String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
        if(admin == null || !admin.equals("admin")){
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }


}
