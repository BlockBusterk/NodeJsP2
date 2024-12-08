import express from 'express'
const studentController = require('../controllers/studentController')


const router = express.Router();

// Route for fetching all students or adding a new student
router.route('/')
    .get(studentController.getAllStudent) // Fetch all students
    .post(studentController.createStudent); // Add a new student

// Route for fetching or manipulating a student by ID
router.route('/:id')
    .get(studentController.getStudentById) // Fetch a student by ID
    .patch(studentController.updateStudent) // Update student details
    .delete(studentController.deleteStudent); // Delete a student

// Route for filtering students by name
router.route('/search/by-name').get(studentController.getStudentByName);

// Route for filtering students by class name
router.route('/search/by-class').get(studentController.getStudentByClassName);



export default router;