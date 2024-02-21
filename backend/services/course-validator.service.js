const Joi = require('joi');
const mongoose = require('mongoose');
const Courses = require('../models/courses.model');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Basic validation schema for course
const courseSchema = Joi.object({
  name: Joi.string().required(),
  instructor: Joi.string().required(),
  modules: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      file: Joi.string().required(),
    })
  ),
});

// Validation for POST endpoint
const validateCourseCreation = async (data) => {
  return courseSchema.validate(data);
};

// Validation for PUT endpoint
const validateCourseUpdate = async (id, data) => {
  if (!isValidObjectId(id)) {
    return {
      error: {
        details: [{ message: 'Invalid ID format' }],
      },
    };
  }

  // Assuming you want to allow partial updates, use .min(1)
  const updateSchema = courseSchema.min(1);
  return updateSchema.validate(data);
};

// Validation for DELETE endpoint
const validateCourseDeletion = async (id) => {
  if (!isValidObjectId(id)) {
    return {
      error: {
        details: [{ message: 'Invalid ID format' }],
      },
    };
  }

  // Check if the course with the provided ID exists
  const courseExists = await Courses.findById(id);
  if (!courseExists) {
    return {
      error: {
        details: [{ message: 'Course not found' }],
      },
    };
  }

  // If all checks pass
  return {};
};

const validateCourseGet = (id) => {
  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { isValid: false, message: "Invalid ID format" };
  }

  // If all checks pass
  return { isValid: true };
}


module.exports = {
  validateCourseCreation,
  validateCourseUpdate,
  validateCourseDeletion,
  validateCourseGet,
};
