package com.bancojavinha.api.service;

import com.bancojavinha.api.dto.InvestimentoRequest;
import com.bancojavinha.api.memory.Memoria;
import com.bancojavinha.model.InvestimentoApi;

import java.util.List;
import java.util.Map;

public class InvestimentoService {
    private final Memoria store;
    private final ContaService accountService;

    public InvestimentoService(Memoria store, ContaService accountService) {
        this.store = store;
        this.accountService = accountService;
    }

    public Map<String, Object> criar(InvestimentoRequest req) {
        if (req == null || req.conta == null || req.conta.isBlank()) {
            throw new IllegalArgumentException("Conta obrigatoria");
        }
        accountService.requireAccount(req.conta);
        if (req.valor <= 0) {
            throw new IllegalArgumentException("Valor do investimento invalido");
        }
        if (req.taxaAnual < 0) {
            throw new IllegalArgumentException("Taxa anual invalida");
        }

        String produto = (req.produto == null || req.produto.isBlank()) ? "CDB" : req.produto;
        InvestimentoApi investment = new InvestimentoApi(req.conta, produto, req.valor, req.taxaAnual);
        store.investments.add(investment);

        return Map.of(
            "mensagem", "Investimento registrado com sucesso",
            "investimento", investment
        );
    }

    public List<InvestimentoApi> listarPorConta(String number) {
        accountService.requireAccount(number);
        return store.investments.stream().filter(inv -> inv.conta.equals(number)).toList();
    }
}