package com.bancojavinha;

import com.bancojavinha.model.*;
import com.bancojavinha.util.DateValidator;
import com.bancojavinha.util.MoneyParser;
import java.util.Scanner;

public class Main {
    private static int numeroCC = 1001;
    private static int numeroCP = 2001;
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Banco banco = new Banco();

        while(true) {
            exibirMenu();
            int opcao = scanner.nextInt();
            scanner.nextLine();

            switch(opcao) {
                case 0 -> {
                    System.out.println("\nSaindo do sistema...");
                    scanner.close();
                    return;
                }
                case 1 -> criarConta(scanner, banco);
                case 2, 3, 5 -> executarOperacao(scanner, banco, opcao);
                case 4 -> executarTransferencia(scanner, banco);
                default -> System.out.println("Opção inválida.");
            }
        }
    }

    private static void exibirMenu() {
        System.out.println("\n_________________");
        System.out.println("\n--- ♥ Banco Javinha ♥ ---");
        System.out.println("1. Criar Conta");
        System.out.println("2. Sacar");
        System.out.println("3. Depositar");
        System.out.println("4. Transferência");
        System.out.println("5. Exibir Extrato");
        System.out.println("0. Sair");
        System.out.print("_________________\nOpção: ");
    }

    private static void criarConta(Scanner scanner, Banco banco) {
        System.out.println("\nEscolha o tipo de conta:");
        System.out.println("1. Conta Corrente");
        System.out.println("2. Conta Poupança");
        System.out.print("Opção: ");
        
        int tipoConta = scanner.nextInt();
        scanner.nextLine();

        switch(tipoConta) {
            case 1 -> criarContaCorrente(scanner, banco);
            case 2 -> criarContaPoupanca(scanner, banco);
            default -> System.out.println("Tipo de conta inválido.");
        }
    }

    private static void criarContaCorrente(Scanner scanner, Banco banco) {
        String numeroConta = "CC" + numeroCC++;
        double saldoInicial = lerValor(scanner, "Saldo Inicial: ");
        System.out.print("Senha: ");
        String senha = scanner.nextLine().trim();

        ContaCorrente conta = new ContaCorrente(numeroConta, saldoInicial, senha);
        banco.adicionarConta(conta);
        System.out.println("Conta Corrente criada com sucesso. Número: " + numeroConta);
    }

    private static void criarContaPoupanca(Scanner scanner, Banco banco) {
        String numeroConta = "CP" + numeroCP++;
        double saldoInicial = lerValor(scanner, "Saldo Inicial: ");
        System.out.print("Senha: ");
        String senha = scanner.nextLine().trim();

        ContaPoupanca conta = new ContaPoupanca(numeroConta, saldoInicial, senha);
        banco.adicionarConta(conta);
        System.out.println("Conta Poupança criada com sucesso. Número: " + numeroConta);
    }

    private static void executarOperacao(Scanner scanner, Banco banco, int opcao) {
        Conta conta = autenticarUsuario(scanner, banco);
        if(conta == null) return;

        String data = solicitarData(scanner);
        if(data == null) return;

        switch(opcao) {
            case 2 -> executarSaque(scanner, conta, data);
            case 3 -> executarDeposito(scanner, conta, data);
            case 5 -> conta.exibirExtrato();
        }
    }

    private static void executarTransferencia(Scanner scanner, Banco banco) {
        Conta contaOrigem = autenticarUsuario(scanner, banco);
        if(contaOrigem == null) return;

        String data = solicitarData(scanner);
        if(data == null) return;

        double valor = lerValor(scanner, "Valor da transferência: ");

        System.out.print("Número da conta destino: ");
        String numeroDestino = scanner.nextLine().trim();

        Conta contaDestino = banco.buscarConta(numeroDestino);
        if(contaDestino == null) {
            System.out.println("Conta destino não encontrada.");
            return;
        }

        if(contaOrigem.transferir(valor, data, numeroDestino)) {
            contaDestino.mostrarTransferencia(valor, data, contaOrigem.getNumeroConta());
            System.out.println("Transferência realizada com sucesso!");
        } else {
            System.out.println("Falha na transferência.");
        }
    }

    private static Conta autenticarUsuario(Scanner scanner, Banco banco) {
        System.out.print("Número da Conta: ");
        String numeroConta = scanner.nextLine().trim();
        
        Conta conta = banco.buscarConta(numeroConta);
        if(conta == null) {
            System.out.println("Conta não encontrada.");
            return null;
        }

        System.out.print("Senha: ");
        String senha = scanner.nextLine().trim();

        if(!conta.validarSenha(senha)) {
            System.out.println("Senha incorreta.");
            return null;
        }

        return conta;
    }

    private static String solicitarData(Scanner scanner) {
        while(true) {
            System.out.print("Data (dd/mm/aaaa): ");
            String data = scanner.nextLine().trim();

            if(DateValidator.isDataValida(data)) {
                return data;
            } else {
                System.out.println("Data inválida. Use dd/mm/aaaa e data não anterior a hoje.");
            }
        }
    }

    private static void executarSaque(Scanner scanner, Conta conta, String data) {
        double valor = lerValor(scanner, "Valor do saque: ");
        conta.sacar(valor, data);
    }

    private static void executarDeposito(Scanner scanner, Conta conta, String data) {
        double valor = lerValor(scanner, "Valor do depósito: ");
        conta.depositar(valor, data);
    }

    private static double lerValor(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String entrada = scanner.nextLine();
            try {
                double valor = MoneyParser.parse(entrada);
                if (valor < 0) {
                    System.out.println("Informe um valor positivo.");
                    continue;
                }
                return valor;
            } catch (IllegalArgumentException e) {
                System.out.println("Valor inválido. Exemplos válidos: 1000  |  1.000,50  |  1000.50");
            }
        }
    }
}