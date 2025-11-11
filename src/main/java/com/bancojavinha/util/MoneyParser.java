package com.bancojavinha.util;

public final class MoneyParser {
    private MoneyParser() {}

    public static double parse(String input) {
        if (input == null) throw new IllegalArgumentException("Valor nulo");
        String s = input.trim();
        if (s.isEmpty()) throw new IllegalArgumentException("Valor vazio");

        s = s.replaceAll("[^0-9.,-]", "");
        if (s.isEmpty() || s.equals("-") || s.equals("--")) {
            throw new IllegalArgumentException("Valor inválido");
        }

        int lastComma = s.lastIndexOf(',');
        int lastDot = s.lastIndexOf('.');
        int idx = Math.max(lastComma, lastDot); 

        String integral;
        String fractional = null;

        if (idx >= 0) {
            integral = s.substring(0, idx).replaceAll("[^0-9-]", "");
            fractional = s.substring(idx + 1).replaceAll("[^0-9]", "");
        } else {
            integral = s.replaceAll("[^0-9-]", "");
        }

        if (integral.isEmpty() || integral.equals("-") || integral.equals("--")) {
            throw new IllegalArgumentException("Valor inválido");
        }

        String normalized = integral;
        if (fractional != null && !fractional.isEmpty()) {
            normalized += "." + fractional; 
        }

        try {
            return Double.parseDouble(normalized);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Valor inválido: " + input);
        }
    }
}
