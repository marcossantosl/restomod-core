function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && value.constructor === Object;
}

function camelToSnakeKey(key) {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamelKey(key) {
  return key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function deepTransformKeys(value, keyFn) {
  if (Array.isArray(value)) return value.map((item) => deepTransformKeys(item, keyFn));
  if (isPlainObject(value)) {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[keyFn(key)] = deepTransformKeys(val, keyFn);
    }
    return out;
  }
  return value;
}

// O frontend envia `null` para campos opcionais não preenchidos (ex.: FK de
// um select vazio). O backend Go original ignorava silenciosamente um null
// nesses campos (mantinha o valor atual); replicamos isso removendo a chave
// antes da validação, em vez de rejeitar com 400.
function stripNullValues(value) {
  if (!isPlainObject(value)) return value;
  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (val !== null) out[key] = val;
  }
  return out;
}

// O frontend existente foi construído contra o contrato JSON do backend Go
// original (snake_case). Em vez de reescrever todas as páginas, a API Node
// aceita e devolve snake_case nas bordas, mantendo camelCase internamente
// (Prisma/JS idiomático).
function camelizeRequestBody(req, res, next) {
  if (isPlainObject(req.body) || Array.isArray(req.body)) {
    req.body = stripNullValues(deepTransformKeys(req.body, snakeToCamelKey));
  }
  next();
}

function snakeifyResponse(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(deepTransformKeys(body, camelToSnakeKey));
  next();
}

module.exports = { camelizeRequestBody, snakeifyResponse };
