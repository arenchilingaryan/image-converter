import { check } from 'express-validator';

export const authCommonGuards = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .exists()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password is incorrect'),
];
