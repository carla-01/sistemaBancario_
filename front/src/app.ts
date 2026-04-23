import { formatDateTime } from './bank';
import { runFormAction } from './actions';
import { viewContent } from './views';
import { listAccounts } from './api';

export const bootstrapApp = () => {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    throw new Error('App root not found');
  }

  app.innerHTML = `
    <main class="desktop">
      <section class="program-window">
        <header class="title-bar">
          <div class="title-dots" aria-hidden="true"><span></span><span></span><span></span></div>
          <h1>Dridri Bank</h1>
          <div class="title-controls" aria-hidden="true"><span></span><span></span></div>
        </header>

        <nav class="menu-bar" aria-label="Menu principal">
          <span id="menu-datetime" class="menu-datetime" aria-label="Data e hora atual"></span>
        </nav>

        <div class="desktop-grid">
          <button class="app-icon" type="button" data-view="conta"><span class="icon-emoji">👤</span><span>Conta</span></button>
          <button class="app-icon" type="button" data-view="deposito"><span class="icon-emoji">➕</span><span>Depósito</span></button>
          <button class="app-icon" type="button" data-view="saque"><span class="icon-emoji">➖</span><span>Saque</span></button>
          <button class="app-icon" type="button" data-view="extrato"><span class="icon-emoji">📊</span><span>Extrato</span></button>
          <button class="app-icon app-icon--active" type="button" data-view="emprestimos"><span class="icon-emoji">🏦</span><span>Empréstimos</span></button>
          <button class="app-icon" type="button" data-view="cartoes"><span class="icon-emoji">💳</span><span>Cartões</span></button>
          <button class="app-icon" type="button" data-view="investir"><span class="icon-emoji">📄</span><span>Investir</span></button>
          <button class="app-icon" type="button" data-view="falar-conosco"><span class="icon-emoji">✉️</span><span>Falar conosco</span></button>
        </div>

        <section class="workspace" aria-live="polite">
          <header class="workspace-header">
            <div class="workspace-heading">
              <strong id="workspace-title"></strong>
              <span id="workspace-subtitle"></span>
            </div>
            <div id="workspace-tabs" class="workspace-tabs" aria-label="Abas abertas"></div>
          </header>

          <div id="workspace-content" class="workspace-content"></div>
        </section>
      </section>
    </main>
  `;

  const workspaceTitle = app.querySelector<HTMLElement>('#workspace-title');
  const workspaceSubtitle = app.querySelector<HTMLElement>('#workspace-subtitle');
  const workspaceContent = app.querySelector<HTMLElement>('#workspace-content');
  const menuDateTime = app.querySelector<HTMLElement>('#menu-datetime');
  const workspaceTabs = app.querySelector<HTMLElement>('#workspace-tabs');
  const viewButtons = Array.from(app.querySelectorAll<HTMLButtonElement>('[data-view]'));

  const openTabs: Array<keyof typeof viewContent> = [];
  let activeView: keyof typeof viewContent | null = null;

  const updateDateTime = () => {
    if (menuDateTime) {
      menuDateTime.textContent = formatDateTime();
    }
  };

  const setFormMessage = (form: HTMLElement, text: string) => {
    const message = form.querySelector<HTMLElement>('[data-form-message]');
    if (message) {
      message.textContent = text;
    }
  };

  const showPopout = (message: string, durationMs = 5000) => {
    const existing = app.querySelector('.popout-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'popout-overlay';
    overlay.innerHTML = `<div class="popout-card">${message}</div>`;
    overlay.addEventListener('click', () => overlay.remove());
    app.appendChild(overlay);

    setTimeout(() => {
      overlay.remove();
    }, durationMs);
  };

  const renderTabs = () => {
    if (!workspaceTabs) {
      return;
    }

    if (openTabs.length === 0) {
      workspaceTabs.innerHTML = '';
      return;
    }

    workspaceTabs.innerHTML = openTabs
      .map((view) => {
        const content = viewContent[view];
        const activeClass = view === activeView ? 'tab-chip tab-chip--active' : 'tab-chip';
        return `
          <button type="button" class="${activeClass}" data-tab-open="${view}" aria-label="Abrir aba ${content.title}">
            <span>${content.title}</span>
            <span class="tab-close" data-tab-close="${view}" aria-label="Fechar aba ${content.title}">×</span>
          </button>
        `;
      })
      .join('');
  };

  const renderEmptyState = () => {
    if (workspaceTitle) workspaceTitle.textContent = '';
    if (workspaceSubtitle) workspaceSubtitle.textContent = '';
    if (workspaceContent) workspaceContent.innerHTML = '';
  };

  const clearWorkspace = () => {
    openTabs.length = 0;
    activeView = null;
    viewButtons.forEach((button) => button.classList.remove('app-icon--active'));
    renderTabs();
    renderEmptyState();
  };

  const setContaPreviewNumber = (form: HTMLElement) => {
    const tipoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="tipo"]');
    const previewInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="numeroGerado"]');
    const tipo = tipoInput?.value === 'CP' ? 'CP' : 'CC';
    if (previewInput) {
      previewInput.value = `${tipo}-aleatoria`;
    }

    const senhaInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="senha"]');
    if (senhaInput) {
      senhaInput.classList.add('is-active');
    }
  };

  const loadAccountsForView = async (view: keyof typeof viewContent) => {
    const viewsWithAccounts = ['deposito', 'saque', 'extrato', 'cartoes', 'investir', 'emprestimos'];
    if (!viewsWithAccounts.includes(view)) {
      return;
    }

    try {
      const accounts = await listAccounts();
      const chipContainers = workspaceContent?.querySelectorAll('[data-account-chips]');

      chipContainers?.forEach((container) => {
        if (accounts.length === 0) {
          container.innerHTML = '<p class="workspace-note">Nenhuma conta cadastrada.</p>';
          return;
        }

        const fieldName = container.getAttribute('data-account-chips') ?? 'numero';
        container.innerHTML = accounts
          .map(
            (account) => `
              <button
                class="account-chip"
                type="button"
                data-account-number="${account.numero}"
                data-target-field="${fieldName}"
              >
                ${account.numero} (${account.tipo})
              </button>
            `,
          )
          .join('');
      });
    } catch (error) {
      const chipContainers = workspaceContent?.querySelectorAll('[data-account-chips]');
      chipContainers?.forEach((container) => {
        container.innerHTML = '<p class="workspace-note">Erro ao carregar contas.</p>';
      });
    }
  };

  const getAccountField = (form: HTMLElement, fieldName = 'numero') =>
    form.querySelector<HTMLInputElement>(`.calc-display[data-field="${fieldName}"]`);

  const setSelectedAccount = (form: HTMLElement, accountNumber: string, fieldName = 'numero') => {
    const input = getAccountField(form, fieldName);
    if (!input) {
      return;
    }

    input.value = accountNumber;
    input.classList.add('is-active');
  };

  const setActiveView = (view: keyof typeof viewContent) => {
    activeView = view;

    viewButtons.forEach((button) => {
      const isActive = button.dataset.view === view;
      button.classList.toggle('app-icon--active', isActive);
    });

    const content = viewContent[view];
    if (workspaceTitle) workspaceTitle.textContent = content.title;
    if (workspaceSubtitle) workspaceSubtitle.textContent = content.subtitle;
    if (workspaceContent) workspaceContent.innerHTML = content.html;

    if (workspaceContent && view === 'conta') {
      const contaForm = workspaceContent.querySelector<HTMLElement>('.calc-form[data-form="conta"]');
      if (contaForm) setContaPreviewNumber(contaForm);
    }

    if (workspaceContent && view === 'extrato') {
      const extratoInput = workspaceContent.querySelector<HTMLInputElement>('.calc-form[data-form="extrato"] .calc-display[data-field="numero"]');
      if (extratoInput) {
        extratoInput.classList.add('is-active');
        extratoInput.focus();
        extratoInput.select();
      }
    }

    renderTabs();
    loadAccountsForView(view);
  };

  const openViewTab = (view: keyof typeof viewContent) => {
    if (!openTabs.includes(view)) {
      openTabs.push(view);
    }
    setActiveView(view);
  };

  const closeViewTab = (view: keyof typeof viewContent) => {
    const index = openTabs.indexOf(view);
    if (index === -1) {
      return;
    }

    openTabs.splice(index, 1);

    if (openTabs.length === 0) {
      activeView = null;
      viewButtons.forEach((button) => button.classList.remove('app-icon--active'));
      renderTabs();
      renderEmptyState();
      return;
    }

    const nextActive = openTabs[Math.max(0, index - 1)] ?? openTabs[0];
    setActiveView(nextActive);
  };

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const view = button.dataset.view as keyof typeof viewContent | undefined;
      if (view) {
        openViewTab(view);
      }
    });
  });

  if (workspaceTabs) {
    workspaceTabs.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const closeTarget = target.closest<HTMLElement>('[data-tab-close]');

      if (closeTarget?.dataset.tabClose) {
        closeViewTab(closeTarget.dataset.tabClose as keyof typeof viewContent);
        return;
      }

      const openTarget = target.closest<HTMLElement>('[data-tab-open]');
      if (openTarget?.dataset.tabOpen) {
        setActiveView(openTarget.dataset.tabOpen as keyof typeof viewContent);
      }
    });
  }

  if (workspaceContent) {
    workspaceContent.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;

      const primaryButton = target.closest<HTMLButtonElement>('.primary-button');
      if (primaryButton) {
        const form = primaryButton.closest<HTMLElement>('.calc-form');
        const formType = form?.dataset.form;

        if (!form || !formType) {
          return;
        }

        try {
          const actionType = primaryButton.dataset.action;
            await runFormAction(formType, form, {
              setFormMessage,
              clearWorkspace,
              showPopout,
              getAccountField,
              actionType,  
            });
        } catch (error) {
          setFormMessage(form, error instanceof Error ? error.message : 'Erro ao processar operacao');
        }
        return;
      }

      const actionCard = target.closest<HTMLButtonElement>('.action-card');
      if (actionCard && actionCard.closest('[data-view="emprestimos"]')) {
        // Para os botões de ação da tela de empréstimos (se ainda usar os cards)
        const form = actionCard.closest<HTMLElement>('.calc-form');
        if (form) {
          const actionText = actionCard.textContent?.trim() || '';
          let actionType = 'simular';
          
          if (actionText.includes('Ver parcelas')) actionType = 'parcelas';
          else if (actionText.includes('Solicitar')) actionType = 'solicitar';
          else if (actionText.includes('Conferir taxa')) actionType = 'taxa';
          else actionType = 'simular';

          try {
            await runFormAction('emprestimos', form, {
              setFormMessage,
              clearWorkspace,
              showPopout,
              getAccountField,
              actionType,
            });
          } catch (error) {
            setFormMessage(form, error instanceof Error ? error.message : 'Erro ao processar operacao');
          }
        }
        return;
      }

      const typeOption = target.closest<HTMLButtonElement>('.type-option');
      if (typeOption) {
        const form = typeOption.closest<HTMLElement>('.calc-form');
        const fieldName = typeOption.dataset.setField;
        const fieldValue = typeOption.dataset.setValue;

        if (form && fieldName && fieldValue) {
          const targetField = form.querySelector<HTMLInputElement>(`.calc-display[data-field="${fieldName}"]`);
          if (targetField) {
            targetField.value = fieldValue;
            if (!targetField.dataset.lock) {
              form.querySelectorAll<HTMLInputElement>('.calc-display').forEach((input) => {
                input.classList.remove('is-active');
              });
              targetField.classList.add('is-active');
            }

            if (form.dataset.form === 'conta') {
              setContaPreviewNumber(form);
            }
          }
        }
        return;
      }

      const accountChip = target.closest<HTMLButtonElement>('[data-account-number]');
      if (accountChip) {
        const form = accountChip.closest<HTMLElement>('.calc-form');
        const accountNumber = accountChip.dataset.accountNumber;
        const fieldName = accountChip.dataset.targetField ?? 'numero';

        if (form && accountNumber) {
          setSelectedAccount(form, accountNumber, fieldName);
        }
        return;
      }

      const parcelaOption = target.closest<HTMLButtonElement>('.parcela-option');
        if (parcelaOption) {
          const form = parcelaOption.closest<HTMLElement>('.calc-form');
          const parcelas = parcelaOption.dataset.parcela;
          if (form && parcelas) {
            const parcelasInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="parcelas"]');
            if (parcelasInput) {
              parcelasInput.value = parcelas;
              // Remove selected de todas e adiciona na clicada
              form.querySelectorAll('.parcela-option').forEach(opt => opt.classList.remove('selected'));
              parcelaOption.classList.add('selected');
            }
          }
          return;
        }

      const display = target.closest<HTMLInputElement>('.calc-display');
      if (display) {
        if (display.dataset.lock) {
          return;
        }
        const form = display.closest<HTMLElement>('.calc-form');
        if (form) {
          form.querySelectorAll<HTMLInputElement>('.calc-display').forEach((input) => {
            input.classList.remove('is-active');
          });
        }
        display.classList.add('is-active');
        return;
      }

      const keypadButton = target.closest<HTMLButtonElement>('.calc-key');
      if (keypadButton) {
        const form = keypadButton.closest<HTMLElement>('.calc-form');
        if (!form) {
          return;
        }

        let activeInput = form.querySelector<HTMLInputElement>('.calc-display.is-active');
        if (!activeInput) {
          activeInput = form.querySelector<HTMLInputElement>('.calc-display:not([data-lock="true"])');
        }
        if (!activeInput || activeInput.dataset.lock) {
          return;
        }

        const action = keypadButton.dataset.action;
        const key = keypadButton.dataset.key;

        if (action === 'clear') {
          activeInput.value = '';
          return;
        }

        if (action === 'backspace') {
          activeInput.value = activeInput.value.slice(0, -1);
          return;
        }

        if (!key) {
          return;
        }

        const maxLength = Number(activeInput.dataset.max ?? '0');
        if (maxLength > 0 && activeInput.value.length >= maxLength) {
          return;
        }

        if (key === ',' && activeInput.dataset.mask === 'money' && activeInput.value.includes(',')) {
          return;
        }

        if (key === ',' && activeInput.dataset.mask !== 'money') {
          return;
        }

        activeInput.value += key;
        return;
      }

      const button = target.closest('button');
      if (!button || !workspaceContent.contains(button)) {
        return;
      }
    });
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
  renderEmptyState();
};