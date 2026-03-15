const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Client } = require('../models');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Client.findOne({ where: { email } });
    if (existing) {
      return error(res, 'Email já cadastrado', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await Client.create({ name, email, phone, password: hashedPassword });

    const token = jwt.sign(
      { id: client.id, role: client.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return success(
      res,
      { token, user: { id: client.id, name: client.name, email: client.email, phone: client.phone, role: client.role } },
      'Cadastro realizado com sucesso',
      201
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return error(res, 'Email ou senha inválidos', 401);
    }

    const isValid = await bcrypt.compare(password, client.password);
    if (!isValid) {
      return error(res, 'Email ou senha inválidos', 401);
    }

    const token = jwt.sign(
      { id: client.id, role: client.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return success(res, {
      token,
      user: { id: client.id, name: client.name, email: client.email, phone: client.phone, role: client.role },
    }, 'Login realizado com sucesso');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/profile
 */
async function getProfile(req, res) {
  return success(res, { user: req.user }, 'Perfil obtido com sucesso');
}

module.exports = { register, login, getProfile };
