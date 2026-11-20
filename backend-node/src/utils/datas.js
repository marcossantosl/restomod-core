// As colunas de data do banco são do tipo DATE (só dia, sem hora). A API
// recebe e devolve essas datas como texto "AAAA-MM-DD" — formato usado pelos
// <input type="date"> do front-end —, mas o Prisma exige um objeto Date para
// gravar numa coluna DATE. Estas funções fazem a conversão nas duas direções.

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// "2024-01-10" -> Date em 2024-01-10T00:00:00Z. Usa UTC para que o fuso do
// servidor nunca desloque o dia.
function paraDate(texto) {
  return new Date(`${texto}T00:00:00.000Z`);
}

// Date de uma coluna DATE (meia-noite UTC) -> "2024-01-10". Datas com hora
// (ex.: created_at) continuam no formato ISO completo.
function formatarDate(data) {
  const iso = data.toISOString();
  return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : iso;
}

module.exports = { DATA_REGEX, paraDate, formatarDate };
