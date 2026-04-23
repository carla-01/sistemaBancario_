package com.bancojavinha.api.service;

import com.bancojavinha.api.dto.CartaoRequest;
import com.bancojavinha.api.memory.Memoria;
import com.bancojavinha.model.CartaoApi;

import java.util.List;
import java.util.Map;

public class CartaoService {
    private final Memoria store;
    private final ContaService accountService;

    public CartaoService(Memoria store, ContaService accountService) {
        this.store = store;
        this.accountService = accountService;
    }

    public Map<String, Object> criar(CartaoRequest req) {
        if (req == null || req.conta == null || req.conta.isBlank()) {
            throw new IllegalArgumentException("Conta obrigatoria");
        }
        accountService.requireAccount(req.conta);
        if (req.finalCartao == null || req.finalCartao.isBlank()) {
            throw new IllegalArgumentException("Final do cartao obrigatorio");
        }
        if (req.limite < 0) {
            throw new IllegalArgumentException("Limite invalido");
        }

        String tipo = (req.tipo == null || req.tipo.isBlank()) ? "credito" : req.tipo;
        CartaoApi card = new CartaoApi(req.conta, tipo, req.finalCartao, req.limite);
        store.cards.add(card);

        return Map.of(
            "mensagem", "Cartao cadastrado com sucesso",
            "cartao", card
        );
    }

    public List<CartaoApi> listarPorConta(String number) {
        accountService.requireAccount(number);
        return store.cards.stream().filter(card -> card.conta.equals(number)).toList();
    }
}