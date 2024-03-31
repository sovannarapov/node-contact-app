const asyncHandler = require('express-async-handler');
const Contact = require('../models/contact');
const {
  NOT_FOUND,
  VALIDATION_ERROR,
  OK,
  SUCCEED,
  FORBIDDEN,
} = require('../utils/constants');

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(OK).json(contacts);
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(NOT_FOUND);
    throw new Error('Contact not found');
  }

  res.status(OK).json(contact);
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(VALIDATION_ERROR);
    throw new Error('All fields are required!');
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(SUCCEED).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(NOT_FOUND);
    throw new Error('Contact not found');
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(FORBIDDEN);
    throw new Error('The user has no permission to update the contact');
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(SUCCEED).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(NOT_FOUND);
    throw new Error('Contact not found');
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(FORBIDDEN);
    throw new Error('The user has no permission to update the contact');
  }

  await Contact.deleteOne({ _id: req.params.id });

  res.status(SUCCEED).json({ message: 'Contact deleted successfully!' });
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
