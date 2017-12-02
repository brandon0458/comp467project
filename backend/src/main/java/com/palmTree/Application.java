package com.palmTree;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.IOException;
import java.text.ParseException;

@SpringBootApplication
public class Application
{
    public static void main(String[] args) throws InterruptedException, IOException, ParseException
    {
        SpringApplication.run(Application.class, args);

        //this will display on server terminal
        System.out.println("\n\nOpenPaintOnline is running\n\n");
    }
}
