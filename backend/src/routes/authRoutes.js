const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { registerValidators, loginValidators } = require('../middlewares/validators/authValidator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e cadastro de clientes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Cadastro de cliente
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name: { type: string, example: "Maria Silva" }
 *               email: { type: string, example: "maria@email.com" }
 *               phone: { type: string, example: "(14) 99999-9999" }
 *               password: { type: string, example: "senha123" }
 *     responses:
 *       201: { description: Cadastro realizado com sucesso }
 *       400: { description: Dados inválidos }
 *       409: { description: Email já cadastrado }
 */
router.post('/register', registerValidators, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login (retorna JWT + role)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "maria@email.com" }
 *               password: { type: string, example: "senha123" }
 *     responses:
 *       200: { description: Login realizado com sucesso }
 *       401: { description: Credenciais inválidas }
 */
router.post('/login', loginValidators, login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Dados do usuário logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Perfil obtido }
 *       401: { description: Não autenticado }
 */
router.get('/profile', auth, getProfile);

module.exports = router;
