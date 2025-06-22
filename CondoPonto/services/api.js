// Serviço mock de API para CondoPonto
export async function registrarPonto(ponto) {
  // Simula delay e sucesso
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
}

export async function solicitarAjuste(pontoId, motivo) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
}

export async function baixarHolerite(dataInicio, dataFim) {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, url: 'https://exemplo.com/holerite.pdf' }), 800));
}
