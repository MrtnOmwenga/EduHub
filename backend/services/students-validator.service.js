// students-validator.service.js
const Joi = require('joi');
const mongoose = require('mongoose');
const Students = require('../models/students.model');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Basic validation schema for student
const studentSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().regex(/^[a-zA-Z0-9 ]*$/),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

// Validation for POST endpoint
const validateStudentCreation = async (data) => {
  const result = studentSchema.validate(data);
  if (result.error) {
    return result;
  }

  // Check for unique email
  const emailExists = await Students.findOne({ email: data.email });
  if (emailExists) {
    return {
      error: {
        details: [{ message: 'Email already exists' }],
      },
    };
  }

  return result; // No errors
};

// Validation for PUT endpoint
const validateStudentUpdate = async (id, data) => {
  if (!isValidObjectId(id)) {
    return {
      error: {
        details: [{ message: 'Invalid ID format' }],
      },
    };
  }

  // Check for the existence of the ID in the database
  const studentExists = await Students.findById(id);
  if (!studentExists) {
    return { 
      error: {
        details: [{ message: 'Student ID does not exist' }],
      },
    };
  }

  // Assuming you want to allow partial updates, use .min(1)
  const updateSchema = studentSchema.min(1);
  return updateSchema.validate(data);
};

/**
 * Validates that the ID is a valid MongoDB ObjectId and checks if it exists in the database.
 * @param {string} id - The ID to validate.
 * @returns {Promise<{isValid: boolean, message?: string}>} - The validation result.
 */
async function validateStudentGet(id) {
  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { isValid: false, message: "Invalid ID format" };
  }

  // Check for the existence of the ID in the database
  const studentExists = await Students.findById(id);
  if (!studentExists) {
    return { isValid: false, message: "Student ID does not exist" };
  }

  // If all checks pass
  return { isValid: true };
}

// Export the validators
module.exports = {
  validateStudentCreation,
  validateStudentUpdate,
  validateStudentGet,
};
