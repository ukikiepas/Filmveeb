package com.ukanio.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction){

        //tutaj robimy ze cala nasza odpowiedz tokena bedzie = sie tylko temu tokenowi
        token.replace("Bearer", "");

        //0 -> Header
        //1 -> Payload (tu jest email) :)
        //2 -> Signature
        String[] chunks = token.split("\\.");

        // dekodujemy
        Base64.Decoder decoder = Base64.getUrlDecoder();

        // interesuje nas tylko payload
        String payload = new String(decoder.decode(chunks[1]));

        // w payloadzie dane sa podzielone "," wiec to robimy
        String[] entries = payload.split(",");

        Map<String, String> map = new HashMap<String, String>();

        // tutaj iterujemy po calym w poszukiwaniu maila (jesli taki bedzie extracion :))
        for(String entry: entries){
            String[] keyValue = entry.split(":");
            if(keyValue[0].equals(extraction)){
                int remove = 1;
                if(keyValue[1].endsWith("}")){
                    remove = 2;
                }

                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }

        }

        if(map.containsKey(extraction)){
            return map.get(extraction);
        }

        return null;
    }


}
