package com.bancojavinha;

import com.bancojavinha.model.*;
import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.shape.Line;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;
import javafx.stage.StageStyle;

public class MainFX extends Application {
    private Banco banco = new Banco();
    private int numeroCC = 1001;
    private int numeroCP = 2001;

    private StackPane root;
    private VBox mainContainer;
    private Line cursorHorizontal;
    private Line cursorVertical;
    private TextArea displayArea;
    private TextField inputField;

    private static final Color AMARELO_BANCO = Color.YELLOW;
    private static final Color PRETO_FUNDO = Color.BLACK;
    private static final Color VERDE_TEXTO = Color.LIMEGREEN;

    @Override
    public void start(Stage primaryStage) {
        primaryStage.initStyle(StageStyle.UNDECORATED);
        primaryStage.setTitle("Banco Javinha - Sistema Corporativo");

        criarInterface();
        configurarEventos();

        Scene scene = new Scene(root, 900, 600);
        scene.setFill(PRETO_FUNDO);

        primaryStage.setOnShown(e -> atualizarCursores());

        primaryStage.setScene(scene);
        primaryStage.setMaximized(true);
        mostrarMenuPrincipal();
    }

    private void criarInterface() {
        root = new StackPane();
        root.setBackground(new Background(new BackgroundFill(PRETO_FUNDO, CornerRadii.EMPTY, Insets.EMPTY)));

        displayArea = new TextArea();
        displayArea.setEditable(false);
        displayArea.setFont(Font.font("Consolas", FontWeight.BOLD, 14));
        displayArea.setStyle("-fx-control-inner-background: black; -fx-text-fill: limegreen; -fx-border-color: #333;");
        displayArea.setPrefSize(800, 500);

        inputField = new TextField();
        inputField.setFont(Font.font("Consolas", FontWeight.BOLD, 14));
        inputField.setStyle("-fx-background-color: black; -fx-text-fill: limegreen; -fx-border-color: #333; -fx-prompt-text-fill: #666;");
        inputField.setPromptText("Digite sua opção e pressione ENTER...");
        inputField.setPrefWidth(800);

        cursorHorizontal = new Line();
        cursorHorizontal.setStroke(AMARELO_BANCO);
        cursorHorizontal.setStrokeWidth(2);
        cursorHorizontal.setVisible(false);

        cursorVertical = new Line();
        cursorVertical.setStroke(AMARELO_BANCO);
        cursorVertical.setStrokeWidth(2);
        cursorVertical.setVisible(false);

        mainContainer = new VBox(10);
        mainContainer.setAlignment(Pos.CENTER);
        mainContainer.setPadding(new Insets(20));
        mainContainer.getChildren().addAll(displayArea, inputField);

        root.getChildren().addAll(mainContainer, cursorHorizontal, cursorVertical);
    }

    private void configurarEventos() {
        root.setOnMouseMoved(e -> {
            cursorHorizontal.setEndX(e.getX());
            cursorVertical.setEndY(e.getY());
            cursorHorizontal.setVisible(true);
            cursorVertical.setVisible(true);
        });

        inputField.textProperty().addListener((obs, oldVal, newVal) -> atualizarCursores());

        inputField.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.ENTER) {
                processarComando(inputField.getText().trim());
                inputField.clear();
            }
        });
    }

    private void atualizarCursores() {
        double centerX = root.getWidth() / 2;
        double centerY = root.getHeight() / 2;

        cursorHorizontal.setStartX(0);
        cursorHorizontal.setStartY(centerY);
        cursorHorizontal.setEndX(root.getWidth());
        cursorHorizontal.setEndY(centerY);

        cursorVertical.setStartX(centerX);
        cursorVertical.setStartY(0);
        cursorVertical.setEndX(centerX);
        cursorVertical.setEndY(root.getHeight());
    }

    private void processarComando(String comando) {
    if (comando.isEmpty()) return;

    String acao = comando.split(" ")[0].toLowerCase();

    switch (acao) {
        case "1":
        case "criar":
            mostrarMenuPrincipalCriar();
            break;
        case "2":
        case "sacar":
            telaSimples("SAQUE", "Formato: CC1001 1234 50.00");
            break;
        case "3":
        case "depositar":
            telaSimples("DEPÓSITO", "Formato: CC1001 100.00");
            break;
        case "4":
        case "transferir":
            telaSimples("TRANSFERÊNCIA", "Formato: CC1001 1234 30.00 CC1002");
            break;
        case "5":
        case "extrato":
            telaSimples("EXTRATO", "Formato: CC1001 1234");
            break;
        case "0":
        case "sair":
        case "exit":
            System.exit(0);
            break;
        case "menu":
            mostrarMenuPrincipal();
            break;
        default:
            adicionarTexto("Comando não reconhecido. Digite 'menu'.");
            break;
    }
}

    private void mostrarMenuPrincipal() {
        limparTela();
        adicionarTexto("╔══════════════════════════════════════════════════════════════╗");
        adicionarTexto("║                   BANCO JAVINHA - SISTEMA CORPORATIVO        ║");
        adicionarTexto("║                                                              ║");
        adicionarTexto("║  [1] CRIAR CONTA          [2] SACAR                          ║");
        adicionarTexto("║  [3] DEPOSITAR           [4] TRANSFERIR                      ║");
        adicionarTexto("║  [5] EXTRATO             [0] SAIR                            ║");
        adicionarTexto("║                                                              ║");
        adicionarTexto("║  Digite o número da opção ou o comando:                      ║");
        adicionarTexto("╚══════════════════════════════════════════════════════════════╝");
        adicionarTexto("");
    }

    private void mostrarMenuPrincipalCriar() {
        limparTela();
        adicionarTexto("╔══════════════════════════════════════════════════════════════╗");
        adicionarTexto("║                      CRIAR NOVA CONTA                        ║");
        adicionarTexto("║                                                              ║");
        adicionarTexto("║  [1] CONTA CORRENTE      [2] CONTA POUPANÇA                  ║");
        adicionarTexto("║  [menu] VOLTAR AO MENU PRINCIPAL                             ║");
        adicionarTexto("╚══════════════════════════════════════════════════════════════╝");
    }

    private void telaSimples(String titulo, String instrucoes) {
        limparTela();
        adicionarTexto("╔══════════════════════════════════════════════════════════════╗");
        adicionarTexto(String.format("║%1$-62s║", centerText(titulo, 62)));
        adicionarTexto("║                                                              ║");
        adicionarTexto("║  Digite: " + instrucoes);
        adicionarTexto("║  [menu] VOLTAR AO MENU PRINCIPAL                             ║");
        adicionarTexto("╚══════════════════════════════════════════════════════════════╝");
    }

    private String centerText(String text, int width) {
        int padSize = Math.max(0, (width - text.length()) / 2);
        return " ".repeat(padSize) + text + " ".repeat(width - text.length() - padSize);
    }

    private void adicionarTexto(String texto) {
        displayArea.appendText(texto + "\n");
        displayArea.setScrollTop(Double.MAX_VALUE);
    }

    private void limparTela() {
        displayArea.clear();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
