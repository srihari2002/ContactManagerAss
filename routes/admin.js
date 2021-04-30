const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, adminController.getindex);

router.get('/add-contact', isAuth, adminController.getAddContact);


router.get('/contacts', isAuth, adminController.getContacts);

router.post(
  '/add-contact',[
    body('name')
    .isString()
    .isLength({ min: 3 })
    .withMessage('enter a name with minimum 3 characters')
    .trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
      body('mblnum')
      .isNumeric()
      .withMessage('Please enter a valid mobile number')

  ],
  isAuth,
  adminController.postAddContact
);

router.get('/edit-contact/:contactId', isAuth, adminController.getEditContact);

router.post(
  '/edit-contact',[
    body('name')
    .isString()
    .isLength({ min: 3 })
    .withMessage('enter a name with minimum 3 characters')
    .trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
      body('mblnum')
      .isNumeric()
      .withMessage('Please enter a valid mobile number')

  ],
  
  isAuth,
  adminController.postEditContact
);

router.post('/delete-contact', isAuth, adminController.postDeleteContact);

module.exports = router;
