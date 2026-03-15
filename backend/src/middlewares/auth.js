const jwt = require('jsonwebtoken');
const { Client } = require('../models');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await Client.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!client) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado.' });
    }

    req.user = client;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
