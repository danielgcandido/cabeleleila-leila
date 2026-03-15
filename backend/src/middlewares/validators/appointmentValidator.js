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

const appointmentValidators = [
  body('appointment_date')
    .notEmpty().withMessage('Data é obrigatória')
    .isDate().withMessage('Data inválida')
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) throw new Error('Data não pode ser no passado');
      return true;
    }),
  body('appointment_time')
    .notEmpty().withMessage('Horário é obrigatório')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Horário inválido (HH:mm)'),
  body('services')
    .isArray({ min: 1 }).withMessage('Selecione pelo menos um serviço')
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(Number(id)) && Number(id) > 0)) {
        throw new Error('IDs de serviços inválidos');
      }
      return true;
    }),
  body('notes').optional().isLength({ max: 500 }).withMessage('Observações devem ter no máximo 500 caracteres'),
  handleValidationErrors,
];

module.exports = { appointmentValidators, handleValidationErrors };
