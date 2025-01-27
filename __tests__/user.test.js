const request = require('supertest');
const express = require('express');
const { createUser, loginUser } = require('../controllers/user.controller');
const {UserModel} = require('../databases/mongodb/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.post('/user/register', createUser);
app.post('/user/login', loginUser);

jest.mock('../databases/mongodb/models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      UserModel.findOne.mockResolvedValue(null);
      UserModel.create.mockResolvedValue({});

      const response = await request(app)
        .post('/user/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'Team Member',
        });

      expect(response.status).toBe(201);
      expect(response.body.msg).toBe('User created successfully');
    });

    it('should return 400 if user already exists', async () => {
      UserModel.findOne.mockResolvedValue({ email: 'john@example.com' });

      const response = await request(app)
        .post('/user/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'Team Member',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should return 500 if there is an internal server error', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .post('/user/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'Team Member',
        });

      expect(response.status).toBe(500);
      expect(response.body.msg).toBe('Internal Server Error');
    });
  });

  describe('loginUser', () => {
    it('should log in successfully with valid credentials', async () => {
      const user = { email: 'john@example.com', password: 'hashedpassword', role: 'Team Member' };
      UserModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');

      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.msg).toBe('Logged in successfully');
      expect(response.body.token).toBe('mockedToken');
    });

    it('should return 400 if email is not found', async () => {
      UserModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid Credentials');
    });

    it('should return 400 if password is invalid', async () => {
      const user = { email: 'john@example.com', password: 'hashedpassword', role: 'Team Member' };
      UserModel.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid Credentials');
    });

    it('should return 500 if there is an internal server error', async () => {
      UserModel.findOne.mockRejectedValue(new Error('Internal Server Error'));

      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.msg).toBe('Internal Server Error');
    });
  });
});