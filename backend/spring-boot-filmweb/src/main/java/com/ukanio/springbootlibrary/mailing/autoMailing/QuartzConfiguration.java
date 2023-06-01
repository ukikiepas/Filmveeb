package com.ukanio.springbootlibrary.mailing.autoMailing;

import com.ukanio.springbootlibrary.mailing.mailingServices.MovieCheckoutReminder;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.time.LocalTime;
import java.util.Date;

@Configuration
public class QuartzConfiguration {



    @Bean
    public JobDetail reminderJobDetail() {
        return JobBuilder.newJob(MovieCheckoutReminder.class)
                .withIdentity("reminderJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger reminderJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                //.withIntervalInHours(24) // Wykonaj zadanie co 24 godziny
                .withIntervalInMinutes(1)
                .repeatForever();

        LocalTime triggerTime = LocalTime.of(12, 0); // Godzina 12:00

        Date startDate = DateBuilder.todayAt(triggerTime.getHour(), triggerTime.getMinute(), triggerTime.getSecond());

        return TriggerBuilder.newTrigger()
                .forJob(reminderJobDetail())
                .withIdentity("reminderTrigger")
                .withSchedule(scheduleBuilder)
                .startAt(startDate)
                .build();
    }

}

