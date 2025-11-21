package com.livemart.backend.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CalendarInviteUtils {
    public static String generateICS(String summary, String description, String location, LocalDateTime start, LocalDateTime end) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
        return "BEGIN:VCALENDAR\n" +
               "VERSION:2.0\n" +
               "BEGIN:VEVENT\n" +
               "SUMMARY:" + summary + "\n" +
               "DESCRIPTION:" + description + "\n" +
               "LOCATION:" + location + "\n" +
               "DTSTART:" + start.format(dtf) + "\n" +
               "DTEND:" + end.format(dtf) + "\n" +
               "END:VEVENT\n" +
               "END:VCALENDAR";
    }
}
