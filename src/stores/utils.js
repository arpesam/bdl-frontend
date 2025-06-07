export const neutral = '#455775'
export const positive = 'success'
export const info = 'info'
export const alert = 'orange'
export const danger = '#e64562'


export function calcularTFG(creatinina, idade, sexo) {
  // Define K e alfa com base no sexo
  const K = sexo === 'feminino' ? 0.7 : 0.9;
  const alfa = sexo === 'feminino' ? -0.241 : -0.302;

  // Calcula min(Creat/K, 1)
  const creatK = creatinina / K;
  const minCreatK = Math.min(creatK, 1);
  const maxCreatK = Math.max(creatK, 1);

  // Calcula cada fator
  const fatorMin = Math.pow(minCreatK, alfa);
  const fatorMax = Math.pow(maxCreatK, -1.200);
  const fatorIdade = Math.pow(0.9938, idade);
  const fatorSexo = sexo === 'feminino' ? 1.012 : 1;

  // Calcula a TFG
  const TFG = 142 * fatorMin * fatorMax * fatorIdade * fatorSexo;

  return TFG;
}