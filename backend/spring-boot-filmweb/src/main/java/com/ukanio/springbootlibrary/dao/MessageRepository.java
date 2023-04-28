package com.ukanio.springbootlibrary.dao;

import com.ukanio.springbootlibrary.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface MessageRepository extends JpaRepository <Message, Long> {

    // dla uzytkownika (da wszystkie jego zapytania i odp nie wazne czy zamkniete czy nie)
    Page<Message>findByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);

    //Wszyscy uzytkownicy ktorzy maja nieodpowiedzone zapytanie :)
    Page<Message>findByClosed(@RequestParam("closed") boolean closed, Pageable pageable);




}
