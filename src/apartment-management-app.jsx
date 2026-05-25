import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search, TrendingUp, Users, AlertCircle, Home, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { loadAllDataFromFirebase, saveAllDataToFirebase, exportToExcel } from './firebase';

const APARTMENTS = [
  { id: 1, name: "אליאב אברהם ומירי", target_amount: 32000 },
  { id: 2, name: "ממושיאשווילי מיכאל", target_amount: 32000 },
  { id: 3, name: "מיכלשוילי ננה", target_amount: 32000 },
  { id: 4, name: "שמשון ושלומי טלקר", target_amount: 32000 },
  { id: 5, name: "דירה 5", target_amount: 32000 },
  { id: 6, name: "מירם ברבירו", target_amount: 32000 },
  { id: 7, name: "חן יעקב", target_amount: 32000 },
  { id: 8, name: "יפרח שרה", target_amount: 32000 },
  { id: 9, name: "בטוני אשוילי קחל", target_amount: 32000 },
  { id: 10, name: "מור איציק ורחל", target_amount: 32000 },
  { id: 11, name: "מרציאנו ג'וזף", target_amount: 32000 },
  { id: 12, name: "שוורץ אבי", target_amount: 32000 },
  { id: 13, name: "דליה סלם", target_amount: 32000 },
  { id: 14, name: "רחל נקש", target_amount: 32000 },
  { id: 15, name: "דוד ממן", target_amount: 32000 },
  { id: 16, name: "מנגר אמה", target_amount: 32000 },
  { id: 17, name: "דירה 17", target_amount: 32000 },
  { id: 18, name: "אלקסנדר גולדין", target_amount: 32000 },
  { id: 19, name: "אלון אירמה ואיציק", target_amount: 32000 },
  { id: 20, name: "ביטון זלדה ואבי", target_amount: 32000 },
  { id: 21, name: "Sroussi", target_amount: 32000 },
  { id: 22, name: "סדניקוב גל", target_amount: 32000 },
  { id: 23, name: "מדובצוק לודמילה", target_amount: 32000 },
  { id: 24, name: "סדקון נטליה", target_amount: 32000 },
  { id: 25, name: "משה כהן", target_amount: 32000 },
  { id: 26, name: "גבריאל חיחינשוילי", target_amount: 32000 },
  { id: 27, name: "מרקוביץ אלכסנדר", target_amount: 32000 },
  { id: 28, name: "ראובן דינאל", target_amount: 32000 },
  { id: 29, name: "אפריים וננסי מרדכ", target_amount: 32000 },
  { id: 30, name: "גלדזא חתונה", target_amount: 32000 },
  { id: 31, name: "מורדוכוביץ נדיה", target_amount: 32000 },
  { id: 32, name: "דייג רחל", target_amount: 32000 },
  { id: 33, name: "שגב עודד", target_amount: 32000 },
  { id: 34, name: "גרינברג לריסה", target_amount: 32000 },
  { id: 35, name: "דהן חיים", target_amount: 32000 },
  { id: 36, name: "ציצושאוילי אנזור", target_amount: 32000 },
  { id: 37, name: "נאוי שקד", target_amount: 32000 },
  { id: 38, name: "צ'יבולדקי אנא", target_amount: 32000 },
  { id: 39, name: "קידק לאון", target_amount: 32000 },
  { id: 40, name: "שרז מרדכי ואסטר", target_amount: 32000 },
  { id: 41, name: "ליפקין מאיה", target_amount: 32000 },
  { id: 42, name: "בריך שאול", target_amount: 32000 },
  { id: 43, name: "ברק חנה ודניאל", target_amount: 32000 },
  { id: 44, name: "קובלצקי דמיטרי", target_amount: 32000 },
  { id: 45, name: "דירה 45", target_amount: 32000 },
  { id: 46, name: "הרצל רבאני", target_amount: 32000 },
  { id: 47, name: "חוביץ יעקב", target_amount: 32000 },
  { id: 48, name: "רון כספית", target_amount: 32000 },
  { id: 49, name: "אזרן דוריה", target_amount: 32000 },
  { id: 50, name: "יצחקי נורית", target_amount: 32000 },
  { id: 51, name: "בביץ אווה", target_amount: 32000 },
  { id: 52, name: "מיראל ארימה", target_amount: 32000 },
  { id: 53, name: "רביד אברהם", target_amount: 32000 },
  { id: 54, name: "הנרי סימון", target_amount: 32000 },
  { id: 55, name: "אסטר הלן אילוז", target_amount: 32000 },
];

const INIT_PAYMENTS = [
  { id: 1, apartment_id: 47, name: "חוביץ יעקב", amount: 10.0, date: "2023-03-12", receipt_number: "2" },
  { id: 2, apartment_id: 14, name: "רחל נקש", amount: 5000.0, date: "2023-03-15", receipt_number: "3" },
  { id: 3, apartment_id: 43, name: "ברק חנה ודניאל", amount: 6000.0, date: "2023-03-17", receipt_number: "4" },
  { id: 4, apartment_id: 38, name: "צ'יבולדקי אנא", amount: 32000.0, date: "2023-03-20", receipt_number: "5" },
  { id: 5, apartment_id: 52, name: "מיראל ארימה", amount: 5000.0, date: "2023-03-20", receipt_number: "6" },
  { id: 6, apartment_id: 55, name: "אסטר הלן אילוז", amount: 5000.0, date: "2023-03-20", receipt_number: "7" },
  { id: 7, apartment_id: 49, name: "אזרן דוריה", amount: 5000.0, date: "2023-03-22", receipt_number: "8" },
  { id: 8, apartment_id: 41, name: "ליפקין מאיה", amount: 5000.0, date: "2023-03-26", receipt_number: "9" },
  { id: 9, apartment_id: 31, name: "מורדוכוביץ נדיה", amount: 32000.0, date: "2023-03-26", receipt_number: "10" },
  { id: 10, apartment_id: 46, name: "הרצל רבאני", amount: 3500.0, date: "2023-03-28", receipt_number: "11" },
  { id: 11, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-03-30", receipt_number: "12" },
  { id: 12, apartment_id: 47, name: "חוביץ יעקב", amount: 4000.0, date: "2023-03-29", receipt_number: "13" },
  { id: 13, apartment_id: 28, name: "ראובן דינאל", amount: 5400.0, date: "2023-03-30", receipt_number: "14" },
  { id: 14, apartment_id: 23, name: "מדובצוק לודמילה", amount: 10000.0, date: "2023-03-31", receipt_number: "16" },
  { id: 15, apartment_id: 44, name: "קובלצקי דמיטרי", amount: 10000.0, date: "2023-04-02", receipt_number: "17" },
  { id: 16, apartment_id: 13, name: "דליה סלם", amount: 7000.0, date: "2023-03-02", receipt_number: "18" },
  { id: 17, apartment_id: 37, name: "נאוי שקד", amount: 5000.0, date: "2023-04-02", receipt_number: "19" },
  { id: 18, apartment_id: 14, name: "רחל נקש", amount: 5000.0, date: "2023-03-02", receipt_number: "20" },
  { id: 19, apartment_id: 2, name: "ממושיאשווילי מיכאל", amount: 10000.0, date: "2023-04-03", receipt_number: "22" },
  { id: 20, apartment_id: 19, name: "אלון אירמה ואיציק", amount: 5000.0, date: "2023-04-04", receipt_number: "23" },
  { id: 21, apartment_id: 18, name: "אלקסנדר גולדין", amount: 32000.0, date: "2023-04-05", receipt_number: "24" },
  { id: 22, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-04-11", receipt_number: "25" },
  { id: 23, apartment_id: 52, name: "מיראל ארימה", amount: 5000.0, date: "2023-04-11", receipt_number: "26" },
  { id: 24, apartment_id: 43, name: "ברק חנה ודניאל", amount: 6000.0, date: "2023-04-13", receipt_number: "27" },
  { id: 25, apartment_id: 55, name: "אסטר הלן אילוז", amount: 5000.0, date: "2023-04-20", receipt_number: "28" },
  { id: 26, apartment_id: 14, name: "רחל נקש", amount: 6000.0, date: "2023-05-01", receipt_number: "29" },
  { id: 27, apartment_id: 14, name: "רחל נקש", amount: 3000.0, date: "2023-05-02", receipt_number: "32" },
  { id: 28, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-05-02", receipt_number: "30" },
  { id: 29, apartment_id: 28, name: "ראובן דינאל", amount: 10000.0, date: "2023-05-07", receipt_number: "33" },
  { id: 30, apartment_id: 49, name: "אזרן דוריה", amount: 15000.0, date: "2023-05-09", receipt_number: "34" },
  { id: 31, apartment_id: 43, name: "ברק חנה ודניאל", amount: 5000.0, date: "2023-05-12", receipt_number: "35" },
  { id: 32, apartment_id: 27, name: "מרכוביץ אלכסנדר", amount: 20000.0, date: "2023-05-14", receipt_number: "36" },
  { id: 33, apartment_id: 19, name: "אלון אירמה ואיציק", amount: 5000.0, date: "2023-05-16", receipt_number: "38" },
  { id: 34, apartment_id: 34, name: "גרינברג לריסה", amount: 32000.0, date: "2023-05-19", receipt_number: "39" },
  { id: 35, apartment_id: 41, name: "ליפקין מאיה", amount: 15000.0, date: "2023-05-21", receipt_number: "40" },
  { id: 36, apartment_id: 37, name: "נאוי שקד", amount: 5000.0, date: "2023-05-22", receipt_number: "41" },
  { id: 37, apartment_id: 55, name: "אסטר הלן אילוז", amount: 10000.0, date: "2023-05-24", receipt_number: "42" },
  { id: 38, apartment_id: 47, name: "חוביץ יעקב", amount: 8000.0, date: "2023-05-28", receipt_number: "43" },
  { id: 39, apartment_id: 35, name: "דהן חיים", amount: 6000.0, date: "2023-05-28", receipt_number: "44" },
  { id: 40, apartment_id: 14, name: "רחל נקש", amount: 13000.0, date: "2023-05-31", receipt_number: "45" },
  { id: 41, apartment_id: 27, name: "מרכוביץ אלכסנדר", amount: 12000.0, date: "2023-05-31", receipt_number: "46" },
  { id: 42, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-06-01", receipt_number: "47" },
  { id: 43, apartment_id: 52, name: "מיראל ארימה", amount: 5000.0, date: "2023-06-07", receipt_number: "49" },
  { id: 44, apartment_id: 13, name: "דליה סלם", amount: 7000.0, date: "2023-06-11", receipt_number: "50" },
  { id: 45, apartment_id: 43, name: "ברק חנה ודניאל", amount: 5000.0, date: "2023-06-12", receipt_number: "51" },
  { id: 46, apartment_id: 49, name: "אזרן דוריה", amount: 5000.0, date: "2023-06-16", receipt_number: "52" },
  { id: 47, apartment_id: 50, name: "יצחקי נורית", amount: 7000.0, date: "2023-06-18", receipt_number: "53" },
  { id: 48, apartment_id: 50, name: "ליאור יצחקי", amount: 8000.0, date: "2023-06-18", receipt_number: "54" },
  { id: 49, apartment_id: 55, name: "אסטר הלן אילוז", amount: 10000.0, date: "2023-06-20", receipt_number: "55" },
  { id: 50, apartment_id: 19, name: "אלון אירמה ואיציק", amount: 5000.0, date: "2023-06-27", receipt_number: "56" },
  { id: 51, apartment_id: 10, name: "מור איציק ורחל", amount: 10000.0, date: "2023-06-29", receipt_number: "57" },
  { id: 52, apartment_id: 8, name: "יפרח שרה", amount: 32000.0, date: "2023-06-30", receipt_number: "60" },
  { id: 53, apartment_id: 15, name: "דוד ממן", amount: 1000.0, date: "2023-07-02", receipt_number: "61" },
  { id: 54, apartment_id: 6, name: "מירם ברבירו", amount: 11000.0, date: "2023-07-02", receipt_number: "62" },
  { id: 55, apartment_id: 40, name: "שרז מרדכיואסטר", amount: 32000.0, date: "2023-07-02", receipt_number: "63" },
  { id: 56, apartment_id: 22, name: "סדניקוב גל", amount: 32000.0, date: "2023-07-02", receipt_number: "64" },
  { id: 57, apartment_id: 36, name: "ציצושאוילי אנזור", amount: 28000.0, date: "2023-07-03", receipt_number: "66" },
  { id: 58, apartment_id: 24, name: "סדקון נטליה", amount: 32000.0, date: "2023-07-03", receipt_number: "67" },
  { id: 59, apartment_id: 29, name: "אפריים וננסי מרדכ", amount: 15000.0, date: "2023-07-06", receipt_number: "68" },
  { id: 60, apartment_id: 28, name: "ראובן דינאל", amount: 10000.0, date: "2023-07-07", receipt_number: "69" },
  { id: 61, apartment_id: 43, name: "ברק חנה ודניאל", amount: 5000.0, date: "2023-07-10", receipt_number: "70" },
  { id: 62, apartment_id: 4, name: "שמשון ושלומי טלקר", amount: 5000.0, date: "2023-07-10", receipt_number: "71" },
  { id: 63, apartment_id: 52, name: "מיראל ארימה", amount: 6000.0, date: "2023-07-10", receipt_number: "72" },
  { id: 64, apartment_id: 25, name: "משה כהן", amount: 2500.0, date: "2023-07-20", receipt_number: "73" },
  { id: 65, apartment_id: 26, name: "גבריאל חיחינשוילי", amount: 130.0, date: "2023-07-21", receipt_number: "74" },
  { id: 66, apartment_id: 55, name: "אילוז אסטר", amount: 2000.0, date: "2023-07-26", receipt_number: "75" },
  { id: 67, apartment_id: 35, name: "דהן חיים ומרים", amount: 5000.0, date: "2023-07-26", receipt_number: "76" },
  { id: 68, apartment_id: 13, name: "דליה סלם", amount: 7000.0, date: "2023-07-28", receipt_number: "77" },
  { id: 69, apartment_id: 44, name: "קובלצקי דמיטרי", amount: 10000.0, date: "2023-07-28", receipt_number: "78" },
  { id: 70, apartment_id: 47, name: "חוביץ יעקב", amount: 8000.0, date: "2023-07-30", receipt_number: "79" },
  { id: 71, apartment_id: 11, name: "מרציאנו ג'וזף", amount: 32000.0, date: "2023-07-31", receipt_number: "80" },
  { id: 72, apartment_id: 7, name: "חן יעקב", amount: 5330.0, date: "2023-07-31", receipt_number: "81" },
  { id: 73, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-08-08", receipt_number: "82" },
  { id: 74, apartment_id: 20, name: "ביטון זלדה ביטון אבי", amount: 16000.0, date: "2023-08-06", receipt_number: "85" },
  { id: 75, apartment_id: 28, name: "ראובן דינאל", amount: 6600.0, date: "2023-08-07", receipt_number: "86" },
  { id: 76, apartment_id: 35, name: "דהן חיים ומרים", amount: 5000.0, date: "2023-08-06", receipt_number: "87" },
  { id: 77, apartment_id: 6, name: "מירם ברבירו", amount: 11000.0, date: "2023-08-07", receipt_number: "88" },
  { id: 78, apartment_id: 4, name: "שמשון ושלומי טלקר", amount: 5000.0, date: "2023-08-09", receipt_number: "89" },
  { id: 79, apartment_id: 43, name: "ברק חנה ודניאל", amount: 5000.0, date: "2023-07-10", receipt_number: "90" },
  { id: 80, apartment_id: 41, name: "ליפקין מאיה", amount: 12000.0, date: "2023-08-13", receipt_number: "91" },
  { id: 81, apartment_id: 29, name: "אפריים וננסי מרדכ", amount: 17000.0, date: "2023-08-14", receipt_number: "92" },
  { id: 82, apartment_id: 32, name: "דייג רחל", amount: 15000.0, date: "2023-08-22", receipt_number: "93" },
  { id: 83, apartment_id: 49, name: "אזן דוריה", amount: 4000.0, date: "2023-08-22", receipt_number: "94" },
  { id: 84, apartment_id: 2, name: "ממושיאשווילי מיכאל", amount: 10000.0, date: "2023-08-22", receipt_number: "95" },
  { id: 85, apartment_id: 32, name: "דייג רחל", amount: 5000.0, date: "2023-08-27", receipt_number: "96" },
  { id: 86, apartment_id: 7, name: "חן יעקב", amount: 5340.0, date: "2023-08-28", receipt_number: "97" },
  { id: 87, apartment_id: 47, name: "חוביץ יעקב", amount: 4000.0, date: "2023-08-29", receipt_number: "98" },
  { id: 88, apartment_id: 35, name: "דהן חיים ומרים", amount: 5000.0, date: "2023-08-30", receipt_number: "99" },
  { id: 89, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-08-31", receipt_number: "100" },
  { id: 90, apartment_id: 20, name: "ביטון זלדה ביטון אבי", amount: 16000.0, date: "2023-09-03", receipt_number: "101" },
  { id: 91, apartment_id: 13, name: "דליה סלם", amount: 7000.0, date: "2023-09-03", receipt_number: "103" },
  { id: 92, apartment_id: 12, name: "שוורץ אבי", amount: 1000.0, date: "2023-09-03", receipt_number: "104" },
  { id: 93, apartment_id: 4, name: "שמשון ושלומי טלקר", amount: 5000.0, date: "2023-09-07", receipt_number: "105" },
  { id: 94, apartment_id: 6, name: "מירם ברבירו", amount: 10000.0, date: "2023-09-08", receipt_number: "106" },
  { id: 95, apartment_id: 12, name: "שוורץ אבי", amount: 31000.0, date: "2023-09-12", receipt_number: "107" },
  { id: 96, apartment_id: 50, name: "ליאור יצחקי", amount: 15000.0, date: "2023-09-18", receipt_number: "108" },
  { id: 97, apartment_id: 51, name: "בביץ אווה", amount: 3000.0, date: "2023-09-18", receipt_number: "110" },
  { id: 98, apartment_id: 42, name: "בריל שאול", amount: 32000.0, date: "2023-09-26", receipt_number: "111" },
  { id: 99, apartment_id: 47, name: "חוביץ יעקב", amount: 4000.0, date: "2023-09-26", receipt_number: "112" },
  { id: 100, apartment_id: 44, name: "קובלצקי דמיטרי", amount: 12000.0, date: "2023-09-27", receipt_number: "113" },
  { id: 101, apartment_id: 13, name: "דליה סלם", amount: 4000.0, date: "2023-09-27", receipt_number: "114" },
  { id: 102, apartment_id: 7, name: "חן יעקב", amount: 5340.0, date: "2023-09-28", receipt_number: "115" },
  { id: 103, apartment_id: 35, name: "דהן חיים ומרים", amount: 5000.0, date: "2023-10-03", receipt_number: "120" },
  { id: 104, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2023-10-03", receipt_number: "119" },
  { id: 105, apartment_id: 4, name: "שמשון ושלומי טלקר", amount: 5000.0, date: "2023-10-11", receipt_number: "121" },
  { id: 106, apartment_id: 4, name: "שמשון ושלומי טלקר", amount: 5000.0, date: "2023-11-13", receipt_number: "123" },
  { id: 107, apartment_id: 46, name: "הרצל רבאני", amount: 4500.0, date: "2023-11-28", receipt_number: "124" },
  { id: 108, apartment_id: 4, name: "שמשון ושלומי טלקר", amount: 5000.0, date: "2023-12-12", receipt_number: "125" },
  { id: 109, apartment_id: 46, name: "הרצל רבאני", amount: 3000.0, date: "2024-05-23", receipt_number: "131" },
  { id: 110, apartment_id: 2, name: "ממושיאשווילי מיכאל", amount: 12000.0, date: "2024-05-23", receipt_number: "132" },
  { id: 111, apartment_id: 26, name: "גבריאל חיחינשוילי", amount: 9870.0, date: "2024-05-28", receipt_number: "133" },
  { id: 112, apartment_id: 3, name: "מיכלשוילי ננה", amount: 2000.0, date: "2024-06-17", receipt_number: "134" },
  { id: 113, apartment_id: 46, name: "הרצל רבאני", amount: 2000.0, date: "2024-07-09", receipt_number: "138" },
  { id: 114, apartment_id: 3, name: "מיכלשוילי ננה", amount: 5000.0, date: "2024-07-17", receipt_number: "139" },
  { id: 115, apartment_id: 15, name: "ממן דוד", amount: 1000.0, date: "2024-08-01", receipt_number: "140" },
  { id: 116, apartment_id: 7, name: "חן יעקב", amount: 5340.0, date: "2024-08-01", receipt_number: "141" },
  { id: 117, apartment_id: 46, name: "הרצל רבאני", amount: 7000.0, date: "2024-08-05", receipt_number: "142" },
  { id: 118, apartment_id: 26, name: "גבריאל חיחינשוילי", amount: 22000.0, date: "2024-09-18", receipt_number: "143" },
  { id: 119, apartment_id: 52, name: "אבי מיראל", amount: 11000.0, date: "2024-09-21", receipt_number: "144" },
  { id: 120, apartment_id: 54, name: "הנרי סימון", amount: 2000.0, date: "2024-09-26", receipt_number: "145" },
  { id: 121, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2024-09-01", receipt_number: "146" },
  { id: 122, apartment_id: 7, name: "חן יעקב", amount: 5300.0, date: "2024-09-23", receipt_number: "147" },
  { id: 123, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2024-10-01", receipt_number: "150" },
  { id: 124, apartment_id: 7, name: "חן יעקב", amount: 5500.0, date: "2024-10-29", receipt_number: "152" },
  { id: 125, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2024-10-01", receipt_number: "153" },
  { id: 126, apartment_id: 53, name: "רביד אברהם", amount: 32000.0, date: "2024-11-10", receipt_number: "154" },
  { id: 127, apartment_id: 25, name: "כהן משה", amount: 10000.0, date: "2024-11-10", receipt_number: "155" },
  { id: 128, apartment_id: 46, name: "הרצל רבאני", amount: 2500.0, date: "2024-11-24", receipt_number: "156" },
  { id: 129, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2024-12-01", receipt_number: "157" },
  { id: 130, apartment_id: 51, name: "בביץ אווה", amount: 3000.0, date: "2024-12-17", receipt_number: "160" },
  { id: 131, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2025-01-01", receipt_number: "163" },
  { id: 132, apartment_id: 32, name: "דייג רחל", amount: 12000.0, date: "2025-01-08", receipt_number: "166" },
  { id: 133, apartment_id: 16, name: "אמה מנגר", amount: 5000.0, date: "2025-01-08", receipt_number: "167" },
  { id: 134, apartment_id: 25, name: "כהן משה", amount: 5000.0, date: "2025-01-12", receipt_number: "168" },
  { id: 135, apartment_id: 3, name: "מיכלשוילי ננה", amount: 5000.0, date: "2025-01-20", receipt_number: "169" },
  { id: 136, apartment_id: 46, name: "הרצל רבאני", amount: 4500.0, date: "2025-02-03", receipt_number: "170" },
  { id: 137, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2025-02-02", receipt_number: "171" },
  { id: 138, apartment_id: 48, name: "רון כספית", amount: 32000.0, date: "2025-02-03", receipt_number: "172" },
  { id: 139, apartment_id: 16, name: "אמה מנגר", amount: 1000.0, date: "2025-02-06", receipt_number: "175" },
  { id: 140, apartment_id: 3, name: "מיכלשוילי ננה", amount: 5000.0, date: "2025-02-10", receipt_number: "176" },
  { id: 141, apartment_id: 9, name: "בטוני אשוילי קחל", amount: 3200.0, date: "2025-02-13", receipt_number: "177" },
  { id: 142, apartment_id: 10, name: "מור איציק ורחל", amount: 22000.0, date: "2025-02-23", receipt_number: "178" },
  { id: 143, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2025-03-02", receipt_number: "179" },
  { id: 144, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2025-03-04", receipt_number: "181" },
  { id: 145, apartment_id: 3, name: "מיכלשוילי ננה", amount: 5000.0, date: "2025-03-10", receipt_number: "183" },
  { id: 146, apartment_id: 25, name: "כהן משה", amount: 5000.0, date: "2025-03-10", receipt_number: "182" },
  { id: 147, apartment_id: 16, name: "אמה מנגר", amount: 2000.0, date: "2025-04-01", receipt_number: "186" },
  { id: 148, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2025-04-01", receipt_number: "187" },
  { id: 149, apartment_id: 3, name: "מיכלשוילי ננה", amount: 5000.0, date: "2025-04-10", receipt_number: "190" },
  { id: 150, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2025-05-02", receipt_number: "191" },
  { id: 151, apartment_id: 3, name: "מיכלשוילי ננה", amount: 5000.0, date: "2025-05-11", receipt_number: "194" },
  { id: 152, apartment_id: 9, name: "בטוני אשוילי קחל", amount: 3200.0, date: "2025-05-11", receipt_number: "195" },
  { id: 153, apartment_id: 1, name: "אליאב אברהם ומירי", amount: 3200.0, date: "2025-06-01", receipt_number: "198" },
  { id: 154, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2025-08-04", receipt_number: "205" },
  { id: 155, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2025-09-02", receipt_number: "207" },
  { id: 156, apartment_id: 16, name: "אמה מנגר", amount: 5000.0, date: "2025-08-18", receipt_number: "218" },
  { id: 157, apartment_id: 51, name: "בביץ אווה", amount: 5000.0, date: "2025-09-04", receipt_number: "210" },
  { id: 158, apartment_id: 37, name: "נאוי שקד", amount: 8000.0, date: "2025-09-07", receipt_number: "211" },
  { id: 159, apartment_id: 9, name: "בטוני אשוילי קחל", amount: 25600.0, date: "2025-09-09", receipt_number: "212" },
  { id: 160, apartment_id: 49, name: "אזרן דוריה", amount: 3000.0, date: "2025-09-10", receipt_number: "213" },
  { id: 161, apartment_id: 25, name: "כהן משה", amount: 9500.0, date: "2025-09-14", receipt_number: "214" },
  { id: 162, apartment_id: 46, name: "הרצל רבאני", amount: 5000.0, date: "2025-09-17", receipt_number: "216" },
  { id: 163, apartment_id: 37, name: "נאוי שקד", amount: 5000.0, date: "2025-09-21", receipt_number: "220" },
  { id: 164, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2025-10-05", receipt_number: "224" },
  { id: 165, apartment_id: 37, name: "נאוי שקד", amount: 9000.0, date: "2025-10-05", receipt_number: "227" },
  { id: 166, apartment_id: 36, name: "ציצושאוילי אנזור", amount: 2000.0, date: "2025-10-20", receipt_number: "228" },
  { id: 167, apartment_id: 19, name: "אלון אירמה ואיציק", amount: 17000.0, date: "2025-10-29", receipt_number: "229" },
  { id: 168, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2025-11-03", receipt_number: "230" },
  { id: 169, apartment_id: 21, name: "Sroussi", amount: 32000.0, date: "2025-11-20", receipt_number: "235" },
  { id: 170, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2025-12-01", receipt_number: "236" },
  { id: 171, apartment_id: 39, name: "קידק לאון", amount: 32000.0, date: "2025-12-05", receipt_number: "239" },
  { id: 172, apartment_id: 16, name: "מנגר אמה", amount: 5000.0, date: "2025-12-10", receipt_number: "240" },
  { id: 173, apartment_id: 51, name: "בביץ אווה", amount: 3000.0, date: "2025-12-25", receipt_number: "241" },
  { id: 174, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2026-01-01", receipt_number: "245" },
  { id: 175, apartment_id: 33, name: "שגב עודד", amount: 27000.0, date: "2026-01-20", receipt_number: "253" },
  { id: 176, apartment_id: 36, name: "ציצושאוילי אנזור", amount: 2000.0, date: "2026-02-01", receipt_number: null },
  { id: 177, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2026-02-03", receipt_number: "255" },
  { id: 178, apartment_id: 33, name: "שגב דבורה", amount: 800.0, date: "2026-02-08", receipt_number: "258" },
  { id: 179, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2026-04-14", receipt_number: "276" },
  { id: 180, apartment_id: 51, name: "בביץ אווה", amount: 3000.0, date: "2026-04-14", receipt_number: "277" },
  { id: 181, apartment_id: 15, name: "ממן דוד", amount: 500.0, date: "2026-05-03", receipt_number: "279" },
];

const INIT_EXPENSES = [
  { id: 1, date: "2023-03-31", description: "עמלת פעולה בערוץ ישיר", amount: 18.5, receipt_number: "21" },
  { id: 2, date: "2023-04-30", description: "עמלת פעולה בערוץ ישיר", amount: 18.5, receipt_number: "31" },
  { id: 3, date: "2023-05-15", description: "אגודה לתרבות הדיור", amount: 1595, receipt_number: "37" },
  { id: 4, date: "2023-05-31", description: "עמלת פעולה בערוץ ישיר", amount: 27.75, receipt_number: "48" },
  { id: 5, date: "2023-06-03", description: "עמלת פעולה בערוץ ישיר", amount: 16.65, receipt_number: "65" },
  { id: 6, date: "2023-08-02", description: "עמלת פעולה על ידי פקיד", amount: 1.85, receipt_number: "83" },
  { id: 7, date: "2023-07-31", description: "עמלת פעולה בערוץ ישיר", amount: 31.45, receipt_number: "84" },
  { id: 8, date: "2023-08-31", description: "עמלת פעולה בערוץ ישיר", amount: 24.05, receipt_number: "102" },
  { id: 9, date: "2023-09-18", description: "עמלת המרה", amount: 30, receipt_number: "109" },
  { id: 10, date: "2023-10-02", description: "עמלת פעולה בערוץ ישיר", amount: 18.5, receipt_number: "118" },
  { id: 11, date: "2023-10-31", description: "עמלת פעולה בערוץ ישיר", amount: 5.55, receipt_number: "122" },
  { id: 12, date: "2023-12-31", description: "קבלת תשלום יתרת זכות", amount: -0.2, receipt_number: "126" },
  { id: 13, date: "2023-12-31", description: "תשלום מס במקור", amount: 0.03, receipt_number: "127" },
  { id: 14, date: "2024-03-31", description: "קבלת תשלום יתרת זכות", amount: -0.18, receipt_number: "128" },
  { id: 15, date: "2024-03-31", description: "תשלום מס במקור", amount: 0.03, receipt_number: "129" },
  { id: 16, date: "2024-05-15", description: "אגודה לתרבות הדיור", amount: 1595, receipt_number: "130" },
  { id: 17, date: "2024-10-14", description: "תשלום לנינוי ואחזקות", amount: 12306, receipt_number: "151" },
  { id: 18, date: "2024-11-30", description: "עמלת פעולה בערוץ ישיר", amount: 5.55, receipt_number: "158" },
  { id: 19, date: "2024-12-31", description: "עמלת פעולה בערוץ ישיר", amount: 3.7, receipt_number: "164" },
  { id: 20, date: "2025-01-31", description: "עמלת פעולה בערוץ ישיר", amount: 5.55, receipt_number: "172" },
  { id: 21, date: "2025-03-03", description: "עמלת פעולה בערוץ ישיר", amount: 7.4, receipt_number: "180" },
  { id: 22, date: "2025-05-15", description: "אגודה לתרבות הדיור", amount: 1595, receipt_number: "196" },
  { id: 23, date: "2025-05-26", description: "תשלום לשמעון אינסטלציה", amount: 4000, receipt_number: "197" },
  { id: 24, date: "2025-09-15", description: "הוראת תשלום משרד המשפטים", amount: 4800, receipt_number: "215" },
  { id: 25, date: "2025-11-06", description: "פיקוח הנדסי תרבות הדיור", amount: 42038, receipt_number: "233" },
  { id: 26, date: "2025-11-19", description: "תשלום עבור תביעה", amount: 2975, receipt_number: "234" },
  { id: 27, date: "2025-12-29", description: "תשלום לקבלן", amount: 420384, receipt_number: "242" },
  { id: 28, date: "2026-01-19", description: "תשלום לקבלן", amount: 170000, receipt_number: "251" },
  { id: 29, date: "2026-02-01", description: "תשלום לחברת שליחים", amount: 995, receipt_number: "254" },
  { id: 30, date: "2026-03-13", description: "תשלום לקבלן", amount: 306200, receipt_number: "265" },
  { id: 31, date: "2026-03-23", description: "תשלום אגרה בית משפט", amount: 2975, receipt_number: "272" },
  { id: 32, date: "2026-03-24", description: "החזר אגרה בית משפט", amount: -1488, receipt_number: "273" },
  { id: 33, date: "2026-05-15", description: "אגודה לתרבות הדיור", amount: 1595, receipt_number: "283" },
];

const INIT_DEPOSITS = [
  { id: 1, date: "2025-12-29", type: 'in', description: "הפקדה לפיקדון", amount: 900000, receipt_number: "241" },
  { id: 2, date: "2026-01-19", type: 'out', description: "משיכה מפיקדון", amount: 70000, receipt_number: "248" },
  { id: 3, date: "2026-03-13", type: 'out', description: "משיכה מפיקדון", amount: 271200, receipt_number: "262" },
];

// ========== FIREBASE ONLY - NO LOCAL STORAGE ==========
// כל הנתונים מתנהלים דרך Firebase בלבד

// ========== STYLES ==========
const S = {
  app: { fontFamily: "'Segoe UI', Arial, sans-serif", direction: 'rtl', minHeight: '100vh' },
  homeWrap: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  homeInner: { maxWidth: '900px', width: '100%', textAlign: 'center' },
  homeEmoji: { fontSize: '80px', marginBottom: '16px' },
  homeTitle: { fontSize: '42px', fontWeight: '800', color: 'white', margin: '0 0 12px 0' },
  homeSubtitle: { fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '50px' },
  cardsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' },
  card: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.25)', borderRadius: '24px', padding: '40px', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'right' },
  cardEmoji: { fontSize: '48px', marginBottom: '16px' },
  cardTitle: { fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '12px' },
  cardText: { fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginBottom: '24px', lineHeight: '1.6' },
  cardBtn: { display: 'inline-block', background: 'white', padding: '12px 28px', borderRadius: '50px', fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' },
  statCard: { background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  statIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statLabel: { fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' },
  statValue: { fontSize: '22px', fontWeight: '800', margin: 0 },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.95)', border: '2px solid white', color: '#283593', padding: '10px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginBottom: '32px', position: 'sticky', top: '40px', zIndex: '100', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  residentWrap: { minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', padding: '40px 20px' },
  residentInner: { maxWidth: '700px', margin: '0 auto' },
  pageTitle: { fontSize: '36px', fontWeight: '800', color: '#283593', marginBottom: '32px', textAlign: 'center' },
  searchBox: { background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', marginBottom: '28px' },
  label: { display: 'block', fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '12px' },
  searchRow: { display: 'flex', gap: '12px' },
  input: { flex: 1, padding: '14px 20px', border: '2px solid #c5cae9', borderRadius: '14px', fontSize: '16px', fontWeight: '600', outline: 'none', fontFamily: 'inherit' },
  searchBtn: { background: 'linear-gradient(135deg, #5c6bc0, #7e57c2)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' },
  resultCard: { background: 'white', borderRadius: '24px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', overflow: 'hidden' },
  resultHeader: { background: 'linear-gradient(135deg, #5c6bc0, #7e57c2)', padding: '28px 32px' },
  resultTitle: { fontSize: '28px', fontWeight: '800', color: 'white', margin: '0 0 6px 0' },
  resultName: { fontSize: '18px', color: 'rgba(255,255,255,0.85)', margin: 0 },
  resultBody: { padding: '32px' },
  statusRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  progressWrap: { background: '#e8eaf6', borderRadius: '50px', height: '20px', overflow: 'hidden', marginBottom: '28px' },
  numbersRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
  numCard: (color) => ({ background: color, borderRadius: '18px', padding: '20px', textAlign: 'center' }),
  numLabel: { fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' },
  numValue: (color) => ({ fontSize: '24px', fontWeight: '800', color: color, margin: 0 }),
  historyTitle: { fontSize: '20px', fontWeight: '800', color: '#333', margin: '28px 0 16px 0', paddingTop: '24px', borderTop: '2px solid #e0e0e0' },
  payRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', borderRadius: '14px', padding: '16px 20px', marginBottom: '10px', borderRight: '4px solid #5c6bc0' },
  adminWrap: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '40px 20px' },
  adminInner: { maxWidth: '1100px', margin: '0 auto' },
  adminTitle: { fontSize: '36px', fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: '40px' },
  adminStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' },
  adminStatCard: (from, to) => ({ background: `linear-gradient(135deg, ${from}, ${to})`, borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }),
  adminStatLabel: { fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' },
  adminStatValue: { fontSize: '26px', fontWeight: '800', color: 'white', margin: 0 },
  adminStatIcon: { background: 'rgba(255,255,255,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  formsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' },
  formCard: { background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  formTitle: { fontSize: '20px', fontWeight: '800', color: '#222', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
  formIconWrap: (color) => ({ background: color, borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }),
  formInput: { width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '15px', fontWeight: '600', outline: 'none', marginBottom: '14px', fontFamily: 'inherit', boxSizing: 'border-box' },
  formSelect: { width: '100%', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', outline: 'none', marginBottom: '14px', fontFamily: 'inherit', boxSizing: 'border-box', background: 'white' },
  addBtn: (from, to) => ({ width: '100%', background: `linear-gradient(135deg, ${from}, ${to})`, color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }),
  depositCard: { background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px' },
  depositRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '12px', marginBottom: '10px' },
  debtCard: { background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'right', fontWeight: '700', color: '#555', background: '#f5f5f5', fontSize: '14px' },
  td: { padding: '12px 16px', textAlign: 'right', borderBottom: '1px solid #f0f0f0', fontSize: '15px' },
};

export default function App() {
  const [mode, setMode] = useState('home');
  const [search, setSearch] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);

  // ===== FILTERS FOR EXPENSES =====
  const [expenseSort, setExpenseSort] = useState('date-old');
  const [expenseDateFrom, setExpenseDateFrom] = useState('');
  const [expenseDateTo, setExpenseDateTo] = useState('');

  // ===== FILTERS FOR INCOME =====
  const [incomeSort, setIncomeSort] = useState('date-old');
  const [incomeDateFrom, setIncomeDateFrom] = useState('');
  const [incomeDateTo, setIncomeDateTo] = useState('');

  // ===== FILTERS FOR PAYMENTS ONLY =====
  const [paymentsSort, setPaymentsSort] = useState('date-old');
  const [paymentsDateFrom, setPaymentsDateFrom] = useState('');
  const [paymentsDateTo, setPaymentsDateTo] = useState('');

  // ===== EDIT MODE FOR INCOME =====
  const [editingIncome, setEditingIncome] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', date: '', receipt: '' });

  // ===== EDIT MODE FOR EXPENSES =====
  const [editingExpense, setEditingExpense] = useState(null);
  const [editExpenseForm, setEditExpenseForm] = useState({ description: '', amount: '', date: '', receipt: '' });

  // ===== SPECIAL INCOME =====
  const [specialIncome, setSpecialIncome] = useState([]);
  const [newSpecialIncome, setNewSpecialIncome] = useState({ description: '', amount: '', date: '', receipt: '' });

  // ===== ADMIN AUTHENTICATION =====
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'Nikolay1973#';

  // ===== STATE - INITIALIZED EMPTY, LOAD FROM FIREBASE =====
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [deposits, setDeposits] = useState([]);

  const [newPay, setNewPay] = useState({ apartment_id: '', amount: '', date: '', receipt: '' });
  const [newExp, setNewExp] = useState({ description: '', amount: '', date: '', receipt: '' });
  const [newDep, setNewDep] = useState({ type: 'in', amount: '', date: '', receipt: '' });

  // ===== DATA LOADED FLAG =====
  const [dataLoaded, setDataLoaded] = useState(false);

  // ===== ИНИЦИАЛИЗАЦИЯ: ЗАГРУЗКА ИЗ FIREBASE (ЧИСТАЯ АРХИТЕКТУРА) =====
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('📥 Загружаем данные из Firebase...');
        const firebaseData = await loadAllDataFromFirebase();

        setPayments(firebaseData.payments);
        setExpenses(firebaseData.expenses);
        setDeposits(firebaseData.deposits);
        setSpecialIncome(firebaseData.specialIncome || []);

        console.log('✅ Данные загружены из Firebase');
        setDataLoaded(true);
      } catch (error) {
        console.error('❌ Ошибка при загрузке:', error);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []); // Загружаем только при монтировании

  // ===== СОХРАНЕНИЕ В FIREBASE (только после загрузки данных) =====
  useEffect(() => {
    if (!dataLoaded) return; // Не сохраняем до загрузки данных

    const timer = setTimeout(() => {
      if (payments.length > 0) {
        saveAllDataToFirebase(payments, expenses, deposits, specialIncome);
        console.log('💾 Данные сохранены в Firebase');
      }
    }, 1500); // Чекаем 1.5 сек перед сохранением

    return () => clearTimeout(timer);
  }, [payments, expenses, deposits, specialIncome, dataLoaded]);

  // חישוב יתרות
  const calcBalance = useCallback((id) => {
    const apt = APARTMENTS.find(a => a.id === id);
    const paid = payments.filter(p => p.apartment_id === id).reduce((s, p) => s + p.amount, 0);
    const target = apt?.target_amount || 32000;
    return { paid, target, remaining: target - paid, percent: Math.min(100, (paid / target) * 100) };
  }, [payments]);

  const stats = useMemo(() => {
    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const depositIn = deposits.filter(d => d.type === 'in').reduce((s, d) => s + d.amount, 0);
    const depositOut = deposits.filter(d => d.type === 'out').reduce((s, d) => s + d.amount, 0);
    const depositBalance = depositIn - depositOut;
    const checkingBalance = totalPaid - totalExpenses - depositBalance;
    const debtors = APARTMENTS.filter(a => calcBalance(a.id).remaining > 0)
      .sort((a, b) => calcBalance(b.id).remaining - calcBalance(a.id).remaining);
    return { totalPaid, totalExpenses, depositBalance, checkingBalance, debtors };
  }, [payments, expenses, deposits, calcBalance]);

  // ===== FILTERED AND SORTED EXPENSES =====
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by date
    if (expenseDateFrom) {
      result = result.filter(e => new Date(e.date) >= new Date(expenseDateFrom));
    }
    if (expenseDateTo) {
      result = result.filter(e => new Date(e.date) <= new Date(expenseDateTo));
    }

    // Sort
    if (expenseSort === 'sum-asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (expenseSort === 'sum-desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (expenseSort === 'date-new') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (expenseSort === 'date-old') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [expenses, expenseSort, expenseDateFrom, expenseDateTo]);

  // ===== INCOME ITEMS (PAYMENTS + DEPOSITS OUT) =====
  const incomeItems = useMemo(() => {
    const items = [];

    // Add payments from residents
    payments.forEach(p => {
      items.push({
        id: `payment-${p.id}`,
        date: p.date,
        description: `תשלום מדיור ${p.apartment_id}`,
        amount: p.amount,
        receipt_number: p.receipt_number,
        type: 'payment'
      });
    });

    // Add deposit withdrawals
    deposits.filter(d => d.type === 'out').forEach(d => {
      items.push({
        id: `deposit-${d.id}`,
        date: d.date,
        description: 'משיכה מפיקדון',
        amount: d.amount,
        receipt_number: d.receipt_number,
        type: 'deposit-out'
      });
    });

    return items;
  }, [payments, deposits]);

  // ===== FILTERED AND SORTED INCOME =====
  const filteredIncome = useMemo(() => {
    let result = [...incomeItems];

    // Filter by date
    if (incomeDateFrom) {
      result = result.filter(i => new Date(i.date) >= new Date(incomeDateFrom));
    }
    if (incomeDateTo) {
      result = result.filter(i => new Date(i.date) <= new Date(incomeDateTo));
    }

    // Sort
    if (incomeSort === 'sum-asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (incomeSort === 'sum-desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (incomeSort === 'date-new') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (incomeSort === 'date-old') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [incomeItems, incomeSort, incomeDateFrom, incomeDateTo]);

  // ===== FILTERED AND SORTED PAYMENTS ONLY =====
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Filter by date
    if (paymentsDateFrom) {
      result = result.filter(p => new Date(p.date) >= new Date(paymentsDateFrom));
    }
    if (paymentsDateTo) {
      result = result.filter(p => new Date(p.date) <= new Date(paymentsDateTo));
    }

    // Sort
    if (paymentsSort === 'sum-asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (paymentsSort === 'sum-desc') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (paymentsSort === 'date-new') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (paymentsSort === 'date-old') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [payments, paymentsSort, paymentsDateFrom, paymentsDateTo]);

  const fmt = (n) => Math.round(n).toLocaleString('he-IL');
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('he-IL'); } catch { return d; } };

  const addPayment = () => {
    if (!newPay.apartment_id || !newPay.amount) return alert('אנא מלא דירה וסכום');
    setPayments([...payments, { id: Date.now(), apartment_id: +newPay.apartment_id, amount: +newPay.amount, date: newPay.date || new Date().toISOString().split('T')[0], receipt_number: newPay.receipt }]);
    setNewPay({ apartment_id: '', amount: '', date: '', receipt: '' });
    alert('✅ התשלום נוסף!');
  };

  const addExpense = () => {
    if (!newExp.description || !newExp.amount) return alert('אנא מלא תיאור וסכום');
    setExpenses([...expenses, { id: Date.now(), description: newExp.description, amount: +newExp.amount, date: newExp.date || new Date().toISOString().split('T')[0], receipt_number: newExp.receipt }]);
    setNewExp({ description: '', amount: '', date: '', receipt: '' });
    alert('✅ ההוצאה נוספה!');
  };

  const addDeposit = () => {
    if (!newDep.amount) return alert('אנא הזן סכום');
    const desc = newDep.type === 'in' ? 'הפקדה לפיקדון' : 'משיכה מפיקדון';
    setDeposits([...deposits, { id: Date.now(), type: newDep.type, description: desc, amount: +newDep.amount, date: newDep.date || new Date().toISOString().split('T')[0], receipt_number: newDep.receipt }]);
    setNewDep({ type: 'in', amount: '', date: '', receipt: '' });
    alert(`✅ ${desc} נוספה!`);
  };

  // ===== LOAD INITIAL DATA (CLEAN ARCHITECTURE) =====
  const loadInitialData = async () => {
    if (!window.confirm('זה יטען את כל הנתונים ההתחלתיים לענן.\nהנתונים הקיימים לא יימחקו, רק יתווסף נתונים חדשים.\n\nהמשך?')) {
      return;
    }

    try {
      console.log('💾 טוען נתונים התחלתיים לFirebase...');
      // Merge INIT_PAYMENTS with existing payments (avoid duplicates by ID)
      const existingIds = new Set(payments.map(p => p.id));
      const newPayments = INIT_PAYMENTS.filter(p => !existingIds.has(p.id));
      const mergedPayments = [...payments, ...newPayments];

      const existingExpenseIds = new Set(expenses.map(e => e.id));
      const newExpenses = INIT_EXPENSES.filter(e => !existingExpenseIds.has(e.id));
      const mergedExpenses = [...expenses, ...newExpenses];

      const existingDepositIds = new Set(deposits.map(d => d.id));
      const newDeposits = INIT_DEPOSITS.filter(d => !existingDepositIds.has(d.id));
      const mergedDeposits = [...deposits, ...newDeposits];

      // Save to Firebase
      await saveAllDataToFirebase(mergedPayments, mergedExpenses, mergedDeposits, specialIncome);

      // Update state
      setPayments(mergedPayments);
      setExpenses(mergedExpenses);
      setDeposits(mergedDeposits);

      console.log('✅ נתונים התחלתיים נטענו בהצלחה!');
      alert(`✅ נתונים התחלתיים נטענו בהצלחה!\n\n📊 נוספו:\n${newPayments.length} תשלומים\n${newExpenses.length} הוצאות\n${newDeposits.length} פקדונות`);
    } catch (error) {
      console.error('❌ שגיאה בטעינת נתונים:', error);
      alert('❌ שגיאה בטעינת הנתונים. אנא בדוק את הקונסול.');
    }
  };

  // ===== INCOME EDIT FUNCTIONS =====
  const startEditIncome = (item) => {
    setEditingIncome(item);
    setEditForm({
      amount: item.amount,
      date: item.date,
      receipt: item.receipt_number || ''
    });
  };

  const saveEditIncome = () => {
    if (!editForm.amount || !editForm.date) return alert('אנא מלא סכום ותאריך');

    if (editingIncome.type === 'payment') {
      const updatedPayments = payments.map(p =>
        p.id === editingIncome.id.replace('payment-', '')
          ? { ...p, amount: +editForm.amount, date: editForm.date, receipt_number: editForm.receipt }
          : p
      );
      setPayments(updatedPayments);
    } else if (editingIncome.type === 'deposit-out') {
      const updatedDeposits = deposits.map(d =>
        d.id === editingIncome.id.replace('deposit-', '')
          ? { ...d, amount: +editForm.amount, date: editForm.date, receipt_number: editForm.receipt }
          : d
      );
      setDeposits(updatedDeposits);
    }

    setEditingIncome(null);
    alert('✅ הרשומה עודכנה!');
  };

  const deleteIncome = (item) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק?')) return;

    if (item.type === 'payment') {
      setPayments(payments.filter(p => p.id !== parseInt(item.id.replace('payment-', ''))));
    } else if (item.type === 'deposit-out') {
      setDeposits(deposits.filter(d => d.id !== parseInt(item.id.replace('deposit-', ''))));
    }

    alert('✅ הרשומה נמחקה!');
  };

  // ===== EXPENSE EDIT FUNCTIONS =====
  const startEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditExpenseForm({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      receipt: expense.receipt_number || ''
    });
  };

  const saveEditExpense = () => {
    if (!editExpenseForm.description || !editExpenseForm.amount || !editExpenseForm.date) {
      return alert('אנא מלא את כל השדות');
    }

    const updatedExpenses = expenses.map(e =>
      e.id === editingExpense.id
        ? {
            ...e,
            description: editExpenseForm.description,
            amount: +editExpenseForm.amount,
            date: editExpenseForm.date,
            receipt_number: editExpenseForm.receipt
          }
        : e
    );
    setExpenses(updatedExpenses);
    setEditingExpense(null);
    alert('✅ ההוצאה עודכנה!');
  };

  const deleteExpense = (expense) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק?')) return;
    setExpenses(expenses.filter(e => e.id !== expense.id));
    alert('✅ ההוצאה נמחקה!');
  };

  // ===== SPECIAL INCOME FUNCTIONS =====
  const addSpecialIncome = () => {
    if (!newSpecialIncome.description || !newSpecialIncome.amount) {
      return alert('אנא מלא תיאור וסכום');
    }
    setSpecialIncome([...specialIncome, {
      id: Date.now(),
      description: newSpecialIncome.description,
      amount: +newSpecialIncome.amount,
      date: newSpecialIncome.date || new Date().toISOString().split('T')[0],
      receipt_number: newSpecialIncome.receipt
    }]);
    setNewSpecialIncome({ description: '', amount: '', date: '', receipt: '' });
    alert('✅ הכנסה מיוחדת נוספה!');
  };

  const deleteSpecialIncome = (item) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק?')) return;
    setSpecialIncome(specialIncome.filter(i => i.id !== item.id));
    alert('✅ הרשומה נמחקה!');
  };

  // ===================== HOME =====================
  if (mode === 'home') return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif", direction: 'rtl' }}>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #2563a8 100%)', padding: '0', boxShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '36px' }}>🏢</div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>ניהול תקציב הבניין</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>פרויקט שיפוץ – ניהול תשלומים והוצאות</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '50px', padding: '6px 16px', fontSize: '13px', color: 'white', fontWeight: '600' }}>
              55 דירות
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div style={{ background: '#1a3c6e', paddingBottom: '32px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { label: 'סכום שנאסף', value: `₪${fmt(stats.totalPaid)}`, icon: '💰', color: '#4ade80' },
                { label: 'פיקדון', value: `₪${fmt(stats.depositBalance)}`, icon: '🏦', color: '#60a5fa' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: '600', marginBottom: '4px', letterSpacing: '0.5px' }}>{s.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

          {/* TITLE */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1a3c6e', margin: '0 0 8px 0' }}>בחר פעולה</h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>למה אתה צריך גישה?</p>
          </div>

          {/* ACTION CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '700px', margin: '0 auto' }}>

            {/* דייר */}
            <div
              onClick={() => { setMode('resident'); setSearch(''); setSelectedApt(null); }}
              style={{ background: 'white', borderRadius: '20px', padding: '32px 24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid transparent', transition: 'all 0.2s', textAlign: 'center' }}
              onMouseOver={e => { e.currentTarget.style.border = '2px solid #2563a8'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,168,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.border = '2px solid transparent'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>
                👤
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a3c6e', margin: '0 0 10px 0' }}>דייר</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.6' }}>
                בדוק את מצב התשלום שלך והיסטוריית הפקדות
              </p>
              <div style={{ background: 'linear-gradient(135deg, #1a3c6e, #2563a8)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
                כניסה כדייר →
              </div>
            </div>

            {/* ניהול */}
            <div
              onClick={() => setShowAdminPasswordModal(true)}
              style={{ background: 'white', borderRadius: '20px', padding: '32px 24px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '2px solid transparent', transition: 'all 0.2s', textAlign: 'center' }}
              onMouseOver={e => { e.currentTarget.style.border = '2px solid #2563a8'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,168,0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.border = '2px solid transparent'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>
                ⚙️
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1a3c6e', margin: '0 0 10px 0' }}>ניהול</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.6' }}>
                ניהול תשלומים, הוצאות ופיקדון
              </p>
              <div style={{ background: 'linear-gradient(135deg, #166534, #16a34a)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontWeight: '700', fontSize: '15px', display: 'inline-block' }}>
                כניסה לניהול →
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ textAlign: 'center', marginTop: '48px', padding: '20px', borderTop: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              מערכת ניהול תקציב בניין | גרסה 1.0
            </p>
          </div>
        </div>

        {/* ADMIN PASSWORD MODAL */}
        {showAdminPasswordModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#222', marginBottom: '8px', textAlign: 'center' }}>🔐 כניסה לדף הניהול</h2>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', textAlign: 'center' }}>הזן סיסמה כדי להמשיך</p>

              <input
                type="password"
                placeholder="הזן סיסמה..."
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (adminPasswordInput === ADMIN_PASSWORD) {
                      setAdminAuthenticated(true);
                      setMode('admin');
                      setShowAdminPasswordModal(false);
                      setAdminPasswordInput('');
                    } else {
                      alert('❌ סיסמה לא נכונה');
                      setAdminPasswordInput('');
                    }
                  }
                }}
                style={{ width: '100%', padding: '14px 16px', border: '2px solid #c5cae9', borderRadius: '12px', fontSize: '16px', outline: 'none', marginBottom: '20px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowAdminPasswordModal(false);
                    setAdminPasswordInput('');
                  }}
                  style={{ flex: 1, padding: '12px 24px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                >
                  ביטול
                </button>
                <button
                  onClick={() => {
                    if (adminPasswordInput === ADMIN_PASSWORD) {
                      setAdminAuthenticated(true);
                      setMode('admin');
                      setShowAdminPasswordModal(false);
                      setAdminPasswordInput('');
                    } else {
                      alert('❌ סיסמה לא נכונה');
                      setAdminPasswordInput('');
                    }
                  }}
                  style={{ flex: 1, padding: '12px 24px', background: 'linear-gradient(135deg, #166534, #16a34a)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
                >
                  כניסה
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE STYLES */}
        <style>{`
          @media (max-width: 600px) {
            .stats-grid { grid-template-columns: 1fr !important; }
            .cards-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    );

  // ===================== RESIDENT =====================
  if (mode === 'resident') {
    const bal = selectedApt ? calcBalance(selectedApt) : null;
    const aptPayments = selectedApt ? payments.filter(p => p.apartment_id === selectedApt).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
    const apt = selectedApt ? APARTMENTS.find(a => a.id === selectedApt) : null;

    return (
      <div style={S.residentWrap}>
        <button style={S.backBtn} onClick={() => setMode('home')}><Home size={18} /> חזור לדף הבית</button>
        <div style={S.residentInner}>
          <h1 style={S.pageTitle}>🏠 חפש את דירתך</h1>

          <div style={S.searchBox}>
            <label style={S.label}>מספר דירה (1–55)</label>
            <div style={S.searchRow}>
              <input style={S.input} type="number" min="1" max="55" value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setSelectedApt(APARTMENTS.find(a => a.id === +search) ? +search : null)}
                placeholder="הזן מספר דירה..." />
              <button style={S.searchBtn} onClick={() => { setSelectedApt(APARTMENTS.find(a => a.id === parseInt(search)) ? parseInt(search) : null); }}>
                <Search size={20} /> חפש
              </button>
            </div>
          </div>

          {search && !selectedApt && (
            <div style={{ background: '#ffebee', border: '2px solid #ef9a9a', borderRadius: '16px', padding: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <AlertCircle size={24} color="#c62828" />
              <div>
                <div style={{ fontWeight: '700', color: '#b71c1c' }}>דירה לא נמצאה</div>
                <div style={{ color: '#c62828' }}>בדוק את המספר ונסה שוב (1–55)</div>
              </div>
            </div>
          )}

          {bal && apt && (
            <div style={S.resultCard}>
              <div style={S.resultHeader}>
                <h2 style={S.resultTitle}>דירה מספר {selectedApt}</h2>
                <p style={S.resultName}>{apt.name}</p>
              </div>
              <div style={S.resultBody}>
                <div style={S.statusRow}>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#333' }}>סטטוס תשלום</span>
                  <span style={{ background: bal.remaining <= 0 ? '#e8f5e9' : '#fff3e0', color: bal.remaining <= 0 ? '#2e7d32' : '#e65100', padding: '8px 20px', borderRadius: '50px', fontWeight: '800', fontSize: '16px' }}>
                    {bal.remaining <= 0 ? '✅ שולם במלואו' : `⚠️ נותר ₪${fmt(bal.remaining)}`}
                  </span>
                </div>
                <div style={S.progressWrap}>
                  <div style={{ height: '100%', width: `${bal.percent}%`, background: 'linear-gradient(90deg, #42a5f5, #5c6bc0)', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px' }}>
                    {bal.percent > 15 && <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>{Math.round(bal.percent)}%</span>}
                  </div>
                </div>
                <div style={S.numbersRow}>
                  <div style={S.numCard('#f1f8e9')}>
                    <div style={S.numLabel}>שולם</div>
                    <p style={S.numValue('#2e7d32')}>₪{fmt(bal.paid)}</p>
                  </div>
                  <div style={S.numCard('#e3f2fd')}>
                    <div style={S.numLabel}>נדרש</div>
                    <p style={S.numValue('#1565c0')}>₪{fmt(bal.target)}</p>
                  </div>
                  <div style={S.numCard('#fff8e1')}>
                    <div style={S.numLabel}>נותר</div>
                    <p style={S.numValue(bal.remaining <= 0 ? '#2e7d32' : '#e65100')}>₪{fmt(Math.max(0, bal.remaining))}</p>
                  </div>
                </div>

                {aptPayments.length > 0 && (
                  <>
                    <h3 style={S.historyTitle}>🧾 היסטוריית תשלומים ({aptPayments.length})</h3>
                    {aptPayments.map(p => (
                      <div key={p.id} style={S.payRow}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#333' }}>{fmtDate(p.date)}</div>
                          {p.receipt_number && <div style={{ fontSize: '13px', color: '#888' }}>אסמכתה: {p.receipt_number}</div>}
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#2e7d32' }}>+₪{fmt(p.amount)}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== PAYMENTS ONLY LIST =====================
  if (mode === 'payments-list') {
    const totalPaymentsFiltered = filteredPayments.reduce((s, p) => s + p.amount, 0);

    return (
      <div style={S.adminWrap}>
        <div style={S.adminInner}>
          <button style={S.backBtn} onClick={() => setMode('admin')}><Home size={18} /> חזור לניהול</button>
          <h1 style={S.adminTitle}>📋 דירוג תשלומים דיירים</h1>

          {/* FILTERS */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>סינון וסידור</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={S.label}>מתאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={paymentsDateFrom}
                  onChange={e => setPaymentsDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>עד תאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={paymentsDateTo}
                  onChange={e => setPaymentsDateTo(e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>סידור</label>
                <select
                  style={S.formSelect}
                  value={paymentsSort}
                  onChange={e => setPaymentsSort(e.target.value)}
                >
                  <option value="date-old">תאריך: ישן לחדש</option>
                  <option value="date-new">תאריך: חדש לישן</option>
                  <option value="sum-desc">סכום: גדול לקטן</option>
                  <option value="sum-asc">סכום: קטן לגדול</option>
                </select>
              </div>
              <div>
                <label style={S.label}>תוצאות</label>
                <div style={{ background: '#c8e6c9', borderRadius: '12px', padding: '12px 16px', fontSize: '18px', fontWeight: '800', color: '#2e7d32', textAlign: 'center' }}>
                  {filteredPayments.length}
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENTS TABLE */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>תשלומים דיירים</h2>

            {filteredPayments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '16px' }}>
                אין תשלומים התואמים לסינון
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>תאריך</th>
                      <th style={S.th}>דירה</th>
                      <th style={S.th}>שם</th>
                      <th style={S.th}>סכום (₪)</th>
                      <th style={S.th}>אסמכתה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={S.td}>{fmtDate(p.date)}</td>
                        <td style={{ ...S.td, fontWeight: '700', color: '#5c6bc0' }}>דירה {p.apartment_id}</td>
                        <td style={{ ...S.td, fontWeight: '600' }}>{p.name}</td>
                        <td style={{ ...S.td, color: '#2e7d32', fontWeight: '700', fontSize: '16px' }}>₪{fmt(p.amount)}</td>
                        <td style={{ ...S.td, color: '#888' }}>{p.receipt_number || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div style={{ background: 'linear-gradient(135deg, #66bb6a, #43a047)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>סה"כ תשלומים</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'white' }}>₪{fmt(totalPaymentsFiltered)}</div>
            </div>
            <div style={{ fontSize: '56px', opacity: 0.2 }}>✅</div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== INCOME LIST =====================
  if (mode === 'income-list') {
    const totalIncomeFiltered = filteredIncome.reduce((s, i) => s + i.amount, 0);

    return (
      <div style={S.adminWrap}>
        <div style={S.adminInner}>
          <button style={S.backBtn} onClick={() => setMode('admin')}><Home size={18} /> חזור לניהול</button>
          <h1 style={S.adminTitle}>💰 דוח הכנסות</h1>

          {/* FILTERS */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>סינון וסידור</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={S.label}>מתאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={incomeDateFrom}
                  onChange={e => setIncomeDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>עד תאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={incomeDateTo}
                  onChange={e => setIncomeDateTo(e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>סידור</label>
                <select
                  style={S.formSelect}
                  value={incomeSort}
                  onChange={e => setIncomeSort(e.target.value)}
                >
                  <option value="date-old">תאריך: ישן לחדש</option>
                  <option value="date-new">תאריך: חדש לישן</option>
                  <option value="sum-desc">סכום: גדול לקטן</option>
                  <option value="sum-asc">סכום: קטן לגדול</option>
                </select>
              </div>
              <div>
                <label style={S.label}>תוצאות</label>
                <div style={{ background: '#e8f5e9', borderRadius: '12px', padding: '12px 16px', fontSize: '18px', fontWeight: '800', color: '#2e7d32', textAlign: 'center' }}>
                  {filteredIncome.length}
                </div>
              </div>
            </div>
          </div>

          {/* INCOME TABLE */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>הכנסות</h2>

            {filteredIncome.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '16px' }}>
                אין הכנסות התואמות לסינון
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>תאריך</th>
                      <th style={S.th}>תיאור</th>
                      <th style={S.th}>סכום (₪)</th>
                      <th style={S.th}>אסמכתה</th>
                      <th style={S.th}>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncome.map(i => (
                      <tr key={i.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={S.td}>{fmtDate(i.date)}</td>
                        <td style={S.td}>{i.description}</td>
                        <td style={{ ...S.td, color: '#2e7d32', fontWeight: '700', fontSize: '16px' }}>₪{fmt(i.amount)}</td>
                        <td style={{ ...S.td, color: '#888' }}>{i.receipt_number || '—'}</td>
                        <td style={S.td}>
                          <button
                            onClick={() => startEditIncome(i)}
                            style={{ background: '#42a5f5', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', marginLeft: '8px' }}
                          >
                            ✏️ עריכה
                          </button>
                          <button
                            onClick={() => deleteIncome(i)}
                            style={{ background: '#ef5350', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                          >
                            🗑️ מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SPECIAL INCOME TABLE */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>הכנסות מיוחדות</h2>

            {specialIncome.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '16px' }}>
                אין הכנסות מיוחדות
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>תאריך</th>
                      <th style={S.th}>תיאור</th>
                      <th style={S.th}>סכום (₪)</th>
                      <th style={S.th}>אסמכתה</th>
                      <th style={S.th}>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialIncome.sort((a, b) => new Date(b.date) - new Date(a.date)).map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={S.td}>{fmtDate(item.date)}</td>
                        <td style={S.td}>{item.description}</td>
                        <td style={{ ...S.td, color: '#2e7d32', fontWeight: '700', fontSize: '16px' }}>₪{fmt(item.amount)}</td>
                        <td style={{ ...S.td, color: '#888' }}>{item.receipt_number || '—'}</td>
                        <td style={S.td}>
                          <button
                            onClick={() => deleteSpecialIncome(item)}
                            style={{ background: '#ef5350', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                          >
                            🗑️ מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TOTALS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Regular Income */}
            <div style={{ background: 'linear-gradient(135deg, #42a5f5, #1e88e5)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>הכנסות רגילות</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>₪{fmt(totalIncomeFiltered)}</div>
              </div>
              <div style={{ fontSize: '48px', opacity: 0.2 }}>💰</div>
            </div>

            {/* Special Income */}
            <div style={{ background: 'linear-gradient(135deg, #43a047, #2e7d32)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>הכנסות מיוחדות</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>₪{fmt(specialIncome.reduce((s, i) => s + i.amount, 0))}</div>
              </div>
              <div style={{ fontSize: '48px', opacity: 0.2 }}>✨</div>
            </div>
          </div>

          {/* TOTAL */}
          <div style={{ background: 'linear-gradient(135deg, #6d4aa8, #4a148c)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>סה"כ הכנסות</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'white' }}>₪{fmt(totalIncomeFiltered + specialIncome.reduce((s, i) => s + i.amount, 0))}</div>
            </div>
            <div style={{ fontSize: '56px', opacity: 0.2 }}>👑</div>
          </div>

          {/* SPECIAL INCOME SECTION */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#e8f5e9', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={20} color="#2e7d32" /></div>
              הוסף הכנסה מיוחדת
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={S.label}>תיאור</label>
                <input style={{ ...S.formInput, marginBottom: 0 }} type="text" placeholder="למשל: ריבית מפיקדון" value={newSpecialIncome.description} onChange={e => setNewSpecialIncome({ ...newSpecialIncome, description: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>סכום (₪)</label>
                <input style={{ ...S.formInput, marginBottom: 0 }} type="number" placeholder="0" value={newSpecialIncome.amount} onChange={e => setNewSpecialIncome({ ...newSpecialIncome, amount: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>תאריך</label>
                <input style={{ ...S.formInput, marginBottom: 0 }} type="date" value={newSpecialIncome.date} onChange={e => setNewSpecialIncome({ ...newSpecialIncome, date: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>אסמכתה</label>
                <input style={{ ...S.formInput, marginBottom: 0 }} type="text" placeholder="מספר קבלה" value={newSpecialIncome.receipt} onChange={e => setNewSpecialIncome({ ...newSpecialIncome, receipt: e.target.value })} />
              </div>
              <button style={{ ...S.addBtn('#43a047', '#2e7d32'), width: 'auto', padding: '12px 24px', marginTop: '28px' }} onClick={addSpecialIncome}>
                <Plus size={18} /> הוסף
              </button>
            </div>

            {/* SPECIAL INCOME HISTORY */}
            {specialIncome.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e0e0e0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#333', marginBottom: '16px' }}>היסטוריה</h3>
                {specialIncome.sort((a, b) => new Date(b.date) - new Date(a.date)).map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e8f5e9', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px', borderRight: '4px solid #43a047' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#333' }}>{item.description}</div>
                      <div style={{ fontSize: '13px', color: '#888' }}>{fmtDate(item.date)}{item.receipt_number ? ` | אסמכתה: ${item.receipt_number}` : ''}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#2e7d32' }}>₪{fmt(item.amount)}</div>
                      <button
                        onClick={() => deleteSpecialIncome(item)}
                        style={{ background: '#ef5350', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EDIT MODAL */}
          {editingIncome && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#222', marginBottom: '24px' }}>✏️ עריכת רשומה</h2>

                <label style={S.label}>סכום (₪)</label>
                <input
                  style={S.formInput}
                  type="number"
                  value={editForm.amount}
                  onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                />

                <label style={S.label}>תאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={editForm.date}
                  onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                />

                <label style={S.label}>אסמכתה</label>
                <input
                  style={S.formInput}
                  type="text"
                  placeholder="מספר קבלה"
                  value={editForm.receipt}
                  onChange={e => setEditForm({ ...editForm, receipt: e.target.value })}
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={saveEditIncome}
                    style={{ flex: 1, background: '#42a5f5', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    💾 שמור
                  </button>
                  <button
                    onClick={() => setEditingIncome(null)}
                    style={{ flex: 1, background: '#ccc', color: '#333', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    ❌ בטל
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== EXPENSES LIST =====================
  if (mode === 'expenses-list') {
    const totalExpensesFiltered = filteredExpenses.reduce((s, e) => s + e.amount, 0);

    return (
      <div style={S.adminWrap}>
        <div style={S.adminInner}>
          <button style={S.backBtn} onClick={() => setMode('admin')}><Home size={18} /> חזור לניהול</button>
          <h1 style={S.adminTitle}>📊 דוח הוצאות</h1>

          {/* FILTERS */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>סינון וסידור</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={S.label}>מתאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={expenseDateFrom}
                  onChange={e => setExpenseDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>עד תאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={expenseDateTo}
                  onChange={e => setExpenseDateTo(e.target.value)}
                />
              </div>
              <div>
                <label style={S.label}>סידור</label>
                <select
                  style={S.formSelect}
                  value={expenseSort}
                  onChange={e => setExpenseSort(e.target.value)}
                >
                  <option value="date-old">תאריך: ישן לחדש</option>
                  <option value="date-new">תאריך: חדש לישן</option>
                  <option value="sum-desc">סכום: גדול לקטן</option>
                  <option value="sum-asc">סכום: קטן לגדול</option>
                </select>
              </div>
              <div>
                <label style={S.label}>תוצאות</label>
                <div style={{ background: '#e3f2fd', borderRadius: '12px', padding: '12px 16px', fontSize: '18px', fontWeight: '800', color: '#1565c0', textAlign: 'center' }}>
                  {filteredExpenses.length}
                </div>
              </div>
            </div>
          </div>

          {/* EXPENSES TABLE */}
          <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#222', marginBottom: '20px' }}>הוצאות</h2>

            {filteredExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '16px' }}>
                אין הוצאות התואמות לסינון
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>תאריך</th>
                      <th style={S.th}>תיאור</th>
                      <th style={S.th}>סכום (₪)</th>
                      <th style={S.th}>אסמכתה</th>
                      <th style={S.th}>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(e => (
                      <tr key={e.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={S.td}>{fmtDate(e.date)}</td>
                        <td style={S.td}>{e.description}</td>
                        <td style={{ ...S.td, color: '#e65100', fontWeight: '700', fontSize: '16px' }}>₪{fmt(e.amount)}</td>
                        <td style={{ ...S.td, color: '#888' }}>{e.receipt_number || '—'}</td>
                        <td style={S.td}>
                          <button
                            onClick={() => startEditExpense(e)}
                            style={{ background: '#42a5f5', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', marginLeft: '8px' }}
                          >
                            ✏️ עריכה
                          </button>
                          <button
                            onClick={() => deleteExpense(e)}
                            style={{ background: '#ef5350', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                          >
                            🗑️ מחק
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div style={{ background: 'linear-gradient(135deg, #e53935, #b71c1c)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>סה"כ הוצאות</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'white' }}>₪{fmt(totalExpensesFiltered)}</div>
            </div>
            <div style={{ fontSize: '56px', opacity: 0.2 }}>💰</div>
          </div>

          {/* EDIT MODAL FOR EXPENSES */}
          {editingExpense && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: '400px', width: '90%' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#222', marginBottom: '24px' }}>✏️ עריכת הוצאה</h2>

                <label style={S.label}>תיאור</label>
                <input
                  style={S.formInput}
                  type="text"
                  value={editExpenseForm.description}
                  onChange={e => setEditExpenseForm({ ...editExpenseForm, description: e.target.value })}
                />

                <label style={S.label}>סכום (₪)</label>
                <input
                  style={S.formInput}
                  type="number"
                  value={editExpenseForm.amount}
                  onChange={e => setEditExpenseForm({ ...editExpenseForm, amount: e.target.value })}
                />

                <label style={S.label}>תאריך</label>
                <input
                  style={S.formInput}
                  type="date"
                  value={editExpenseForm.date}
                  onChange={e => setEditExpenseForm({ ...editExpenseForm, date: e.target.value })}
                />

                <label style={S.label}>אסמכתה</label>
                <input
                  style={S.formInput}
                  type="text"
                  placeholder="מספר קבלה"
                  value={editExpenseForm.receipt}
                  onChange={e => setEditExpenseForm({ ...editExpenseForm, receipt: e.target.value })}
                />

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    onClick={saveEditExpense}
                    style={{ flex: 1, background: '#42a5f5', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    💾 שמור
                  </button>
                  <button
                    onClick={() => setEditingExpense(null)}
                    style={{ flex: 1, background: '#ccc', color: '#333', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    ❌ בטל
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== ADMIN =====================
  if (!adminAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI', Arial, sans-serif", direction: 'rtl', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#222', marginBottom: '12px' }}>גישה מוגבלת</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>אתה לא מחובר כמנהל. אנא חזור לדף הבית וקיים כניסה מחדש.</p>
          <button
            onClick={() => setMode('home')}
            style={{ background: 'linear-gradient(135deg, #1a3c6e, #2563a8)', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
          >
            ← חזור לדף הבית
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.adminWrap}>
      <div style={S.adminInner}>
        <button style={S.backBtn} onClick={() => { setAdminAuthenticated(false); setMode('home'); }}><Home size={18} /> חזור לדף הבית</button>
        <h1 style={S.adminTitle}>⚙️ דף ניהול</h1>

        {/* 4 כרטיסי סטטיסטיקה */}
        <div style={S.adminStatsRow}>
          <div style={S.adminStatCard('#43a047', '#2e7d32')}>
            <div>
              <div style={S.adminStatLabel}>סכום שנאסף</div>
              <p style={S.adminStatValue}>₪{fmt(stats.totalPaid)}</p>
            </div>
            <div style={S.adminStatIcon}><TrendingUp size={28} color="white" /></div>
          </div>
          <div style={S.adminStatCard('#e53935', '#b71c1c')}>
            <div>
              <div style={S.adminStatLabel}>הוצאות</div>
              <p style={S.adminStatValue}>₪{fmt(stats.totalExpenses)}</p>
            </div>
            <div style={S.adminStatIcon}><span style={{fontSize: '24px', fontWeight: '900', color: 'white'}}>₪</span></div>
          </div>
          <div style={S.adminStatCard('#1e88e5', '#1565c0')}>
            <div>
              <div style={S.adminStatLabel}>פיקדון</div>
              <p style={S.adminStatValue}>₪{fmt(stats.depositBalance)}</p>
            </div>
            <div style={S.adminStatIcon}><ArrowUpCircle size={28} color="white" /></div>
          </div>
          <div style={S.adminStatCard(stats.checkingBalance >= 0 ? '#8e24aa' : '#fb8c00', stats.checkingBalance >= 0 ? '#6a1b9a' : '#e65100')}>
            <div>
              <div style={S.adminStatLabel}>יתרה עובר ושב</div>
              <p style={S.adminStatValue}>₪{fmt(stats.checkingBalance)}</p>
            </div>
            <div style={S.adminStatIcon}><Users size={28} color="white" /></div>
          </div>
        </div>

        {/* BUTTONS TO VIEW REPORTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => setMode('payments-list')}
            style={{
              background: 'linear-gradient(135deg, #66bb6a, #43a047)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(67, 160, 71, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📋 דוח תשלומים דיירים
          </button>
          <button
            onClick={() => setMode('income-list')}
            style={{
              background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(66, 165, 245, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            💰 צפה בדוח הכנסות
          </button>
          <button
            onClick={() => setMode('expenses-list')}
            style={{
              background: 'linear-gradient(135deg, #e53935, #b71c1c)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(229, 57, 53, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📊 צפה בדוח הוצאות
          </button>
        </div>

        {/* טפסים: תשלום + הוצאה */}
        <div style={S.formsRow}>
          <div style={S.formCard}>
            <h2 style={S.formTitle}>
              <div style={S.formIconWrap('#e8f5e9')}><Plus size={20} color="#2e7d32" /></div>
              הוסף תשלום דייר
            </h2>
            <label style={S.label}>מספר דירה</label>
            <select style={S.formSelect} value={newPay.apartment_id} onChange={e => setNewPay({ ...newPay, apartment_id: e.target.value })}>
              <option value="">בחר דירה...</option>
              {APARTMENTS.map(a => <option key={a.id} value={a.id}>דירה {a.id} – {a.name}</option>)}
            </select>
            <label style={S.label}>סכום (₪)</label>
            <input style={S.formInput} type="number" placeholder="0" value={newPay.amount} onChange={e => setNewPay({ ...newPay, amount: e.target.value })} />
            <label style={S.label}>תאריך</label>
            <input style={S.formInput} type="date" value={newPay.date} onChange={e => setNewPay({ ...newPay, date: e.target.value })} />
            <label style={S.label}>אסמכתה</label>
            <input style={S.formInput} type="text" placeholder="מספר קבלה" value={newPay.receipt} onChange={e => setNewPay({ ...newPay, receipt: e.target.value })} />
            <button style={S.addBtn('#43a047', '#2e7d32')} onClick={addPayment}><Plus size={18} /> הוסף תשלום</button>
          </div>

          <div style={S.formCard}>
            <h2 style={S.formTitle}>
              <div style={S.formIconWrap('#ffebee')}><Plus size={20} color="#c62828" /></div>
              הוסף הוצאה
            </h2>
            <label style={S.label}>תיאור</label>
            <input style={S.formInput} type="text" placeholder="למשל: תשלום לקבלן" value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} />
            <label style={S.label}>סכום (₪)</label>
            <input style={S.formInput} type="number" placeholder="0" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} />
            <label style={S.label}>תאריך</label>
            <input style={S.formInput} type="date" value={newExp.date} onChange={e => setNewExp({ ...newExp, date: e.target.value })} />
            <label style={S.label}>אסמכתה</label>
            <input style={S.formInput} type="text" placeholder="מספר קבלה" value={newExp.receipt} onChange={e => setNewExp({ ...newExp, receipt: e.target.value })} />
            <button style={S.addBtn('#e53935', '#b71c1c')} onClick={addExpense}><Plus size={18} /> הוסף הוצאה</button>
          </div>
        </div>

        {/* טעינת נתונים התחלתיים */}
        <div style={{ background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            📥 טעינת נתונים התחלתיים
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '20px', fontSize: '15px' }}>
            טען את כל הנתונים ההתחלתיים (181 תשלומים, 33 הוצאות, 3 פקדונות) לענן.
            הנתונים הקיימים לא יימחקו.
          </p>
          <button
            style={{
              background: 'white',
              color: '#7b1fa2',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}
            onClick={loadInitialData}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📥 טעון נתונים
          </button>
        </div>

        {/* ייצוא נתונים לאקסל */}
        <div style={{ background: 'linear-gradient(135deg, #1976d2, #1565c0)', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            📊 ייצוא נתונים לאקסל
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '20px', fontSize: '15px' }}>
            הורד גיבוי של כל הנתונים שלך (תשלומים, הוצאות, פיקדונות) קובץ אקסל.
            זה ישמש כגיבוי בטוח על המחשב שלך.
          </p>
          <button
            style={{
              background: 'white',
              color: '#1565c0',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}
            onClick={() => exportToExcel(APARTMENTS)}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📊 הורד אקסל
          </button>
        </div>

        {/* ניהול פיקדון */}
        <div style={S.depositCard}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={S.formIconWrap('#e3f2fd')}><ArrowUpCircle size={20} color="#1565c0" /></div>
            ניהול פיקדון
            <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '4px 16px', borderRadius: '50px', fontSize: '16px', fontWeight: '800', marginRight: '8px' }}>
              יתרה: ₪{fmt(stats.depositBalance)}
            </span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end', marginBottom: '20px' }}>
            <div>
              <label style={S.label}>סוג פעולה</label>
              <select style={S.formSelect} value={newDep.type} onChange={e => setNewDep({ ...newDep, type: e.target.value })}>
                <option value="in">📥 הפקדה לפיקדון</option>
                <option value="out">📤 משיכה מפיקדון</option>
              </select>
            </div>
            <div>
              <label style={S.label}>סכום (₪)</label>
              <input style={{ ...S.formInput, marginBottom: 0 }} type="number" placeholder="0" value={newDep.amount} onChange={e => setNewDep({ ...newDep, amount: e.target.value })} />
            </div>
            <div>
              <label style={S.label}>תאריך</label>
              <input style={{ ...S.formInput, marginBottom: 0 }} type="date" value={newDep.date} onChange={e => setNewDep({ ...newDep, date: e.target.value })} />
            </div>
            <div>
              <label style={S.label}>אסמכתה</label>
              <input style={{ ...S.formInput, marginBottom: 0 }} type="text" placeholder="מספר קבלה" value={newDep.receipt} onChange={e => setNewDep({ ...newDep, receipt: e.target.value })} />
            </div>
            <button style={{ ...S.addBtn('#1e88e5', '#1565c0'), width: 'auto', padding: '12px 24px', marginTop: '28px' }} onClick={addDeposit}>
              <Plus size={18} /> הוסף
            </button>
          </div>

          {/* היסטוריית פיקדון */}
          <div>
            {deposits.sort((a, b) => new Date(b.date) - new Date(a.date)).map(d => (
              <div key={d.id} style={{ ...S.depositRow, background: d.type === 'in' ? '#e8f5e9' : '#fff3e0', borderRight: `4px solid ${d.type === 'in' ? '#43a047' : '#fb8c00'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {d.type === 'in' ? <ArrowUpCircle size={20} color="#43a047" /> : <ArrowDownCircle size={20} color="#fb8c00" />}
                  <div>
                    <div style={{ fontWeight: '700', color: '#333' }}>{d.description}</div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{fmtDate(d.date)}{d.receipt_number ? ` | אסמכתה: ${d.receipt_number}` : ''}</div>
                  </div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: d.type === 'in' ? '#2e7d32' : '#e65100' }}>
                  {d.type === 'in' ? '+' : '-'}₪{fmt(d.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* טבלת חייבים */}
        <div style={S.debtCard}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#222', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={S.formIconWrap('#fff3e0')}><AlertCircle size={20} color="#e65100" /></div>
            דיירים שחייבים
            <span style={{ background: '#fff3e0', color: '#e65100', padding: '4px 14px', borderRadius: '50px', fontWeight: '800' }}>{stats.debtors.length}</span>
          </h2>
          {stats.debtors.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', fontSize: '22px', color: '#2e7d32', fontWeight: '700' }}>✅ כל הדיירים שילמו!</div>
            : (
              <table style={S.table}>
                <thead>
                  <tr>{['דירה', 'שם', 'שולם', 'נדרש', 'חוב'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {stats.debtors.map(a => {
                    const b = calcBalance(a.id);
                    return (
                      <tr key={a.id}>
                        <td style={{ ...S.td, fontWeight: '800', color: '#5c6bc0' }}>{a.id}</td>
                        <td style={{ ...S.td, fontWeight: '600' }}>{a.name}</td>
                        <td style={{ ...S.td, color: '#2e7d32', fontWeight: '700' }}>₪{fmt(b.paid)}</td>
                        <td style={S.td}>₪{fmt(b.target)}</td>
                        <td style={{ ...S.td, color: '#c62828', fontWeight: '800', fontSize: '17px' }}>₪{fmt(b.remaining)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
}
