import { formatCurrency, getStatement } from '../api';
import type { ActionDeps } from './types';

const composeAccountNumber = (tipo: string, numeroInformado: string) => {
  const numeroLimpo = numeroInformado.trim().toUpperCase();
  if (!numeroLimpo) return '';
  if (numeroLimpo.startsWith('CC') || numeroLimpo.startsWith('CP')) {
    return numeroLimpo;
  }
  return `${tipo}${numeroLimpo}`;
};

export const runExtratoAction = async (form: HTMLElement, deps: ActionDeps) => {
  const tipoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="tipo"]');
  const accountInput = deps.getAccountField(form);
  const resultDiv = form.querySelector<HTMLElement>('[data-statement-result]');
  const tipo = tipoInput?.value === 'CP' ? 'CP' : 'CC';
  const accountNumber = composeAccountNumber(tipo, accountInput?.value ?? '');

  if (!accountNumber) {
    deps.setFormMessage(form, 'Informe o numero da conta.');
    return;
  }

  try {
    const statement = await getStatement(accountNumber);
    const movimentos = statement.extrato.length === 0
      ? 'Sem movimentacoes registradas.'
      : statement.extrato
          .slice()
          .reverse()
          .map((transaction) => `${transaction.data} - ${transaction.tipo}: ${formatCurrency(transaction.valor)}`)
          .join('<br>');

    if (resultDiv) {
      const transactionsHtml = statement.extrato.length === 0
        ? '<p class="workspace-note">Sem movimentacoes registradas.</p>'
        : `
          <ul class="statement-list">
            ${statement.extrato
              .slice()
              .reverse()
              .map(
                (transaction) => `
                  <li>
                    <span>${transaction.data} - ${transaction.tipo}</span>
                    <strong>${formatCurrency(transaction.valor)}</strong>
                  </li>
                `,
              )
              .join('')}
          </ul>
        `;

      resultDiv.innerHTML = `
        <div class="statement-summary">
          <strong>${statement.numero}</strong>
          <span>Saldo atual: ${formatCurrency(statement.saldo)}</span>
        </div>
        ${transactionsHtml}
      `;
    }

    deps.showPopout(
      `Extrato da conta ${statement.numero}<br>Saldo atual: ${formatCurrency(statement.saldo)}<br><br>${movimentos}`,
      8000,
    );
    deps.setFormMessage(form, '');
  } catch (error) {
    deps.setFormMessage(form, error instanceof Error ? error.message : 'Erro ao carregar extrato');
  }
};
