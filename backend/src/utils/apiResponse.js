/**
 * Formata resposta de sucesso
 */
const success = (res, data, message = 'Operação realizada com sucesso', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Formata resposta de erro
 */
const error = (res, message, statusCode = 400, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { success, error };
