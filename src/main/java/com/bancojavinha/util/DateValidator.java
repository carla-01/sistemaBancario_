package com.bancojavinha.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateValidator {
    private static final SimpleDateFormat FORMATO_DATA = new SimpleDateFormat("dd/MM/yyyy");

    public static boolean isDataValida(String data) {
        try {
            Date dataInserida = FORMATO_DATA.parse(data);
            Date dataAtual = FORMATO_DATA.parse(FORMATO_DATA.format(new Date()));
            return !dataInserida.before(dataAtual);
        } catch(ParseException e) {
            return false;
        }
    }

    public static String getDataAtual() {
        return FORMATO_DATA.format(new Date());
    }
}