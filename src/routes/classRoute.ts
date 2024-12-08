import express from 'express'
const classController = require('../controllers/classController')


const router = express.Router();

// Route for fetching all students or adding a new student
router.route('/')
    .get(classController.getAllClass) // Fetch all classes
    .post(classController.createClass); // Add a new class

// Route for fetching or manipulating a class by ID
router.route('/:id')
    .get(classController.getClassById) // Fetch a class by ID
    .patch(classController.updateClass) // Update class details
    .delete(classController.deleteClass); // Delete a student



export default router;