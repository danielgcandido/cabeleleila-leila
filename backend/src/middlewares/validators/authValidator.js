const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Telefone é obrigatório'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  handleValidationErrors,
];

const loginValidators = [
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  handleValidationErrors,
];

module.exports = { registerValidators, loginValidators, handleValidationErrors };
