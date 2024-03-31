const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contact');
const validateToken = require('../middleware/validateTokenHandler');

router
  .route('/')
  .get(validateToken, getContacts)
  .post(validateToken, createContact);

router
  .route('/:id')
  .get(validateToken, getContact)
  .put(validateToken, updateContact)
  .delete(validateToken, deleteContact);

module.exports = router;
