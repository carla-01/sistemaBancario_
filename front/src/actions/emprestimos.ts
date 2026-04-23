import { simulateLoan, createLoan, formatCurrency, parseMoney } from '../api';
import type { ActionDeps } from './types';

const getTaxaMensal = (parcelas: number): number => {
  const taxas: Record<number, number> = {
    6: 0.0199,
    12: 0.0299,
    24: 0.0399,
    36: 0.0499,
    48: 0.0599,
    60: 0.0699,
    72: 0.0799,
    84: 0.0899,
    96: 0.0999,
  };
  return taxas[parcelas] || 0.0499;
};

export const runEmprestimosAction = async (form: HTMLElement, deps: ActionDeps & { actionType?: string }) => {
  const tipoInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="tipo"]');
  const numeroInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="numero"]');
  const senhaInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="senha"]');
  const valorInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="valor"]');
  const parcelasInput = form.querySelector<HTMLInputElement>('.calc-display[data-field="parcelas"]');
  
  const acao = deps.actionType ?? 'simular';
  
  const tipo = tipoInput?.value === 'CP' ? 'CP' : 'CC';
  const numero = numeroInput?.value?.trim() || '';
  const senha = senhaInput?.value?.trim() || '';
  
  // DEBUG: Ver o valor bruto
  console.log('Valor bruto do input:', valorInput?.value);
  
  // Converte o valor
  const valor = valorInput?.value ? parseMoney(valorInput.value) : 0;
  
  // DEBUG: Ver o valor convertido
  console.log('Valor convertido (parseMoney):', valor);
  
  const parcelas = parseInt(parcelasInput?.value || '12', 10);
  
  const numeroCompleto = numero ? (numero.startsWith('CC') || numero.startsWith('CP') ? numero : `${tipo}${numero}`) : '';
  
  if (!numeroCompleto) {
    deps.setFormMessage(form, 'Informe o número da conta.');
    return;
  }
  
  if (!senha) {
    deps.setFormMessage(form, 'Informe a senha da conta.');
    return;
  }
  
  if (valor <= 0 && acao !== 'taxa') {
    deps.setFormMessage(form, 'Informe um valor válido para o empréstimo.');
    return;
  }
  
  const taxaMensal = getTaxaMensal(parcelas);
  const taxaPercentual = (taxaMensal * 100).toFixed(2);
  
  const resultDiv = form.querySelector<HTMLElement>('[data-result]');
  
  try {
    if (acao === 'simular') {
      // DEBUG: Ver o que está sendo enviado
      console.log('Enviando para API:', { valor, parcelas, taxaMensal });
      
      const result = await simulateLoan({ valor, parcelas, taxaMensal });
      
      // DEBUG: Ver o resultado
      console.log('Resultado da API:', result);
      
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="simulation-result">
            <h4>📋 Simulação de Empréstimo</h4>
            <p><strong>Valor solicitado:</strong> ${formatCurrency(result.valor)}</p>
            <p><strong>Parcelas:</strong> ${result.parcelas}x</p>
            <p><strong>Taxa mensal:</strong> ${taxaPercentual}%</p>
            <p><strong>Valor total:</strong> ${formatCurrency(result.total)}</p>
            <p><strong>Valor da parcela:</strong> ${formatCurrency(result.parcelaMensal)}</p>
            <p><strong>Juros totais:</strong> ${formatCurrency(result.total - result.valor)}</p>
          </div>
        `;
      }
      deps.setFormMessage(form, `Simulação: ${parcelas}x de ${formatCurrency(result.parcelaMensal)}`);
      
    } else if (acao === 'solicitar') {
      const result = await createLoan({
        conta: numeroCompleto,
        senha: senha,
        valor,
        parcelas,
        taxaMensal,
      });
      
      if (valorInput) valorInput.value = '';
      if (resultDiv) {
        resultDiv.innerHTML = `
          <div class="success-result">
            <h4>✅ Empréstimo Aprovado!</h4>
            <p><strong>Valor creditado:</strong> ${formatCurrency(valor)}</p>
            <p><strong>Parcelas:</strong> ${parcelas}x de ${formatCurrency(result.parcelaMensal || (valor / parcelas))}</p>
            <p><strong>Taxa mensal:</strong> ${taxaPercentual}%</p>
            <p><strong>Saldo atual:</strong> ${formatCurrency(result.saldoAtual || 0)}</p>
          </div>
        `;
      }
      deps.showPopout(`✅ Empréstimo de ${formatCurrency(valor)} aprovado!`);
      deps.setFormMessage(form, 'Empréstimo solicitado com sucesso!');
    }
  } catch (error) {
    deps.setFormMessage(form, error instanceof Error ? error.message : 'Erro ao processar empréstimo');
  }
};