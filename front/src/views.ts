export const renderAccountSelector = (fieldName = 'numero', showChips = true) => `
  <div class="account-selector">
    <label class="calc-field">
      <span>Numero da conta</span>
      <input
        class="calc-display is-active"
        data-field="${fieldName}"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        spellcheck="false"
        placeholder="Digite somente o numero"
        aria-label="Numero da conta"
      />
    </label>
    ${
      showChips
        ? `<div class="account-chips" data-account-chips="${fieldName}">
      <p class="workspace-note">Carregando contas...</p>
    </div>`
        : ''
    }
  </div>
`;

export const viewContent: Record<string, { title: string; subtitle: string; html: string }> = {
  conta: {
    title: 'Conta',
    subtitle: 'Cadastro e consulta da conta',
    html: `
      <form class="calc-form" data-form="conta">
        <div class="calc-fields">
          <label class="calc-field">
            <span>Tipo de conta</span>
            <input class="calc-display" data-field="tipo" value="CC" readonly data-lock="true" />
          </label>
          <div class="type-options">
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CC">CC Conta Corrente</button>
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CP">CP Conta Poupanca</button>
          </div>
          <label class="calc-field">
            <span>Numero da conta (gerado pelo banco)</span>
            <input class="calc-display calc-display--locked" data-field="numeroGerado" value="CC-aleatoria" readonly data-lock="true" />
          </label>
          <label class="calc-field">
            <span>Saldo inicial (opcional)</span>
            <input class="calc-display" data-field="saldo" data-max="10" data-mask="money" placeholder="0,00" readonly />
          </label>
          <label class="calc-field">
            <span>Senha</span>
            <input class="calc-display is-active" data-field="senha" data-max="6" placeholder="******" readonly />
          </label>
        </div>
        <div class="calc-keypad" aria-label="Teclado numerico">
          <button class="calc-key" type="button" data-key="7">7</button>
          <button class="calc-key" type="button" data-key="8">8</button>
          <button class="calc-key" type="button" data-key="9">9</button>
          <button class="calc-key calc-key--action" type="button" data-action="backspace">←</button>
          <button class="calc-key" type="button" data-key="4">4</button>
          <button class="calc-key" type="button" data-key="5">5</button>
          <button class="calc-key" type="button" data-key="6">6</button>
          <button class="calc-key calc-key--action" type="button" data-action="clear">Limpar</button>
          <button class="calc-key" type="button" data-key="1">1</button>
          <button class="calc-key" type="button" data-key="2">2</button>
          <button class="calc-key" type="button" data-key="3">3</button>
          <button class="calc-key" type="button" data-key=",">,</button>
          <button class="calc-key calc-key--wide" type="button" data-key="0">0</button>
          <button class="primary-button" type="button">Criar conta</button>
        </div>
        <p class="form-message" data-form-message></p>
      </form>
    `,
  },
  deposito: {
    title: 'Depósito',
    subtitle: 'Entrada de valores',
    html: `
      <form class="calc-form" data-form="deposito">
        <div class="calc-fields">
          <label class="calc-field">
            <span>Tipo de conta</span>
            <input class="calc-display" data-field="tipo" value="CC" readonly data-lock="true" />
          </label>
          <div class="type-options">
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CC">CC Conta Corrente</button>
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CP">CP Conta Poupanca</button>
          </div>
          ${renderAccountSelector('numero', false)}
          <label class="calc-field">
            <span>Valor do deposito</span>
            <input class="calc-display" data-field="valor" data-max="10" data-mask="money" placeholder="0,00" readonly />
          </label>
        </div>
        <div class="calc-keypad" aria-label="Teclado numerico">
          <button class="calc-key" type="button" data-key="7">7</button>
          <button class="calc-key" type="button" data-key="8">8</button>
          <button class="calc-key" type="button" data-key="9">9</button>
          <button class="calc-key calc-key--action" type="button" data-action="backspace">←</button>
          <button class="calc-key" type="button" data-key="4">4</button>
          <button class="calc-key" type="button" data-key="5">5</button>
          <button class="calc-key" type="button" data-key="6">6</button>
          <button class="calc-key calc-key--action" type="button" data-action="clear">Limpar</button>
          <button class="calc-key" type="button" data-key="1">1</button>
          <button class="calc-key" type="button" data-key="2">2</button>
          <button class="calc-key" type="button" data-key="3">3</button>
          <button class="calc-key" type="button" data-key=",">,</button>
          <button class="calc-key calc-key--wide" type="button" data-key="0">0</button>
          <button class="primary-button" type="button">Confirmar deposito</button>
        </div>
        <p class="form-message" data-form-message></p>
      </form>
    `,
  },
  saque: {
    title: 'Saque',
    subtitle: 'Retirada de valores',
    html: `
      <form class="calc-form" data-form="saque">
        <div class="calc-fields">
          <label class="calc-field">
            <span>Tipo de conta</span>
            <input class="calc-display" data-field="tipo" value="CC" readonly data-lock="true" />
          </label>
          <div class="type-options">
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CC">CC Conta Corrente</button>
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CP">CP Conta Poupanca</button>
          </div>
          ${renderAccountSelector('numero', false)}
          <label class="calc-field">
            <span>Valor do saque</span>
            <input class="calc-display" data-field="valor" data-max="10" data-mask="money" placeholder="0,00" readonly />
          </label>
        </div>
        <div class="calc-keypad" aria-label="Teclado numerico">
          <button class="calc-key" type="button" data-key="7">7</button>
          <button class="calc-key" type="button" data-key="8">8</button>
          <button class="calc-key" type="button" data-key="9">9</button>
          <button class="calc-key calc-key--action" type="button" data-action="backspace">←</button>
          <button class="calc-key" type="button" data-key="4">4</button>
          <button class="calc-key" type="button" data-key="5">5</button>
          <button class="calc-key" type="button" data-key="6">6</button>
          <button class="calc-key calc-key--action" type="button" data-action="clear">Limpar</button>
          <button class="calc-key" type="button" data-key="1">1</button>
          <button class="calc-key" type="button" data-key="2">2</button>
          <button class="calc-key" type="button" data-key="3">3</button>
          <button class="calc-key" type="button" data-key=",">,</button>
          <button class="calc-key calc-key--wide" type="button" data-key="0">0</button>
          <button class="primary-button" type="button">Confirmar saque</button>
        </div>
        <p class="form-message" data-form-message></p>
      </form>
    `,
  },
  extrato: {
    title: 'Extrato',
    subtitle: 'Movimentações recentes',
    html: `
      <form class="calc-form" data-form="extrato">
        <div class="calc-fields">
          <label class="calc-field">
            <span>Tipo de conta</span>
            <input class="calc-display" data-field="tipo" value="CC" readonly data-lock="true" />
          </label>
          <div class="type-options">
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CC">CC Conta Corrente</button>
            <button class="type-option" type="button" data-set-field="tipo" data-set-value="CP">CP Conta Poupanca</button>
          </div>
          ${renderAccountSelector('numero', false)}
          <div class="extrato-inline-actions">
            <p class="extrato-hint">Selecione uma conta e consulte o extrato.</p>
            <button class="primary-button" type="button">Consultar extrato</button>
          </div>
          <p class="form-message" data-form-message></p>
        </div>
        <div class="statement-box" data-statement-result>
          <p class="workspace-note">Detalhamento do extrato aparecera aqui.</p>
        </div>
      </form>
    `,
  },
  emprestimos: {
  title: 'Empréstimos',
  subtitle: 'Simule e solicite seu empréstimo',
  html: `
    <form class="calc-form" data-form="emprestimos">
      <div class="calc-fields">
        <label class="calc-field">
          <span>Tipo de conta</span>
          <input class="calc-display" data-field="tipo" value="CC" readonly data-lock="true" />
        </label>
        <div class="type-options">
          <button class="type-option" type="button" data-set-field="tipo" data-set-value="CC">CC Conta Corrente</button>
          <button class="type-option" type="button" data-set-field="tipo" data-set-value="CP">CP Conta Poupança</button>
        </div>
        
        <label class="calc-field">
          <span>Número da conta</span>
          <input class="calc-display is-active" data-field="numero" type="text" inputmode="numeric" placeholder="Digite o número da conta" readonly />
        </label>
        
        <label class="calc-field">
          <span>Senha</span>
          <input class="calc-display" data-field="senha" type="password" data-max="6" placeholder="******" readonly />
        </label>
        
        <label class="calc-field">
          <span>Valor do empréstimo (R$)</span>
          <input class="calc-display" data-field="valor" data-mask="money" placeholder="0,00" readonly />
        </label>
        
        <label class="calc-field">
          <span>Número de parcelas</span>
          <input class="calc-display" data-field="parcelas" value="12" readonly data-lock="true" />
        </label>
        <div class="parcelas-options">
          <button class="parcela-option" type="button" data-parcela="6">6x</button>
          <button class="parcela-option" type="button" data-parcela="12">12x</button>
          <button class="parcela-option" type="button" data-parcela="24">24x</button>
          <button class="parcela-option" type="button" data-parcela="36">36x</button>
          <button class="parcela-option" type="button" data-parcela="48">48x</button>
          <button class="parcela-option" type="button" data-parcela="60">60x</button>
          <button class="parcela-option" type="button" data-parcela="72">72x</button>
          <button class="parcela-option" type="button" data-parcela="84">84x</button>
          <button class="parcela-option" type="button" data-parcela="96">96x</button>
        </div>
      </div>
      
      <div class="calc-keypad" aria-label="Teclado numerico">
        <button class="calc-key" type="button" data-key="7">7</button>
        <button class="calc-key" type="button" data-key="8">8</button>
        <button class="calc-key" type="button" data-key="9">9</button>
        <button class="calc-key calc-key--action" type="button" data-action="backspace">←</button>
        <button class="calc-key" type="button" data-key="4">4</button>
        <button class="calc-key" type="button" data-key="5">5</button>
        <button class="calc-key" type="button" data-key="6">6</button>
        <button class="calc-key calc-key--action" type="button" data-action="clear">Limpar</button>
        <button class="calc-key" type="button" data-key="1">1</button>
        <button class="calc-key" type="button" data-key="2">2</button>
        <button class="calc-key" type="button" data-key="3">3</button>
        <button class="calc-key" type="button" data-key=",">,</button>
        <button class="calc-key calc-key--wide" type="button" data-key="0">0</button>
      </div>
      
      <div class="button-group" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
        <button class="primary-button" type="button" data-action="simular">Simular valor</button>
        <button class="primary-button" type="button" data-action="solicitar">Solicitar empréstimo</button>
      </div>
      <p class="form-message" data-form-message></p>
      <div class="result-box" data-result style="margin-top: 20px;"></div>
    </form>
  `,
},
  investir: {
    title: 'Investir',
    subtitle: 'Aplicações e rendimento',
    html: `
      <div class="card-grid">
        <button class="action-card" type="button">CDB</button>
        <button class="action-card" type="button">Poupança</button>
        <button class="action-card" type="button">Tesouro</button>
        <button class="action-card" type="button">Fundos</button>
      </div>
      <p class="workspace-note">Escolha uma modalidade e acompanhe o rendimento estimado.</p>
    `,
  },
  'falar-conosco': {
    title: 'Falar conosco',
    subtitle: 'Atendimento e suporte',
    html: `
      <div class="message-box">
        <p>Central de atendimento: 0800 123 4567</p>
        <p>WhatsApp: (11) 99999-9999</p>
        <p>E-mail: suporte@dridribank.com</p>
      </div>
    `,
  },
};
