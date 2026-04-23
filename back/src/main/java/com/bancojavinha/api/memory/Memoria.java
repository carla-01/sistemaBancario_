package com.bancojavinha.api.memory;

import com.bancojavinha.model.ContaApi;
import com.bancojavinha.model.CartaoApi;
import com.bancojavinha.model.InvestimentoApi;
import com.bancojavinha.model.EmprestimoApi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Memoria {
    public final Map<String, ContaApi> accounts = new LinkedHashMap<>();
    public final List<CartaoApi> cards = new ArrayList<>();
    public final List<InvestimentoApi> investments = new ArrayList<>();
    public final List<EmprestimoApi> loans = new ArrayList<>();
}