const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erros de validação do Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors,
    });
  }

  // JWT expirado
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expirado. Faça login novamente.' });
  }

  // JWT inválido
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token inválido.' });
  }

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Erro interno do servidor';

  return res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && status >= 500 ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
