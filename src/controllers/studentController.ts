import fs from 'fs'
import  { Request, Response } from "express";
let students =  JSON.parse(fs.readFileSync('./data/students.json').toString());
let classes =  JSON.parse(fs.readFileSync('./data/classes.json').toString());
function generateRandomID(prefix: string, length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = prefix + '_';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

exports.getAllStudent = async (req : Request, res: Response) => {
    res.status(200).json({
        status: "sucess",
        requestedAt: Date.now(),
        count: students.length,
        data: {
            students: students
        }
    });
}

exports.createStudent = (req : Request, res: Response) => {
    if(req.body.Name === undefined){
        return res.status(404).json({
            status: "fail",
            message: 'This student must have name'
        })
    }
    let studentName = students.find( (el: { Name: string; }) => el.Name === req.body.Name);
    if(studentName){
        return res.status(404).json({
            status: "fail",
            message: 'There is student with that name'
        })
    }

    let studentClass = classes.find( (el: { ID: string; }) => el.ID === req.body.Class);
    console.log(req.body.Class)
    if(!studentClass){
        return res.status(404).json({
            status: "fail",
            message: 'The student must belong to available class'
        })
    }

    const newId = generateRandomID('stu', 8);
    const newStudent = Object.assign({ID: newId}, req.body)
    
    students.push(newStudent);

    fs.writeFile('./data/students.json', JSON.stringify(students,null,2), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                student: newStudent
            }
        })
    })
}

exports.updateStudent = (req : Request, res: Response) => {
    const {id} = req.params
    let student = students.find( (el: { ID: string; }) => el.ID === id);
    if(!student){
        return res.status(404).json({
            status: "fail",
            message: 'This student is not exist'
        })
    }

    let studentName = students.find( (el: { Name: string; ID:string }) => (el.Name === req.body.Name && el.ID !== id));
    if(studentName){
        return res.status(404).json({
            status: "fail",
            message: 'There is student with that name'
        })
    }

    let studentClass = classes.find( (el: { ID: string; }) => el.ID === req.body.Class);
    if(!studentClass){
        return res.status(404).json({
            status: "fail",
            message: 'The student must belong to available class'
        })
    }

    
    const updateStudent = Object.assign(student,req.body)
    const index = students.indexOf(student)

    students[index] = updateStudent;

    fs.writeFile('./data/students.json', JSON.stringify(students,null,2), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                student: updateStudent
            }
        })
    })
}

exports.deleteStudent = (req : Request, res: Response) => {
    const {id} = req.params
    let deleteStudent = students.find( (el: { ID: string; }) => el.ID === id);
    if(!deleteStudent){
        return res.status(404).json({
            status: "fail",
            message: 'This student is not exist'
        })
    }
    
    
    const index = students.indexOf(deleteStudent)

    students.splice(index,1)

    fs.writeFile('./data/students.json', JSON.stringify(students, null, 2), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete student',
            });
        }

       
        res.status(200).json({
            status: 'success',
            message: 'Student deleted successfully',
            data: {
                student: deleteStudent,
            },
        });
    });
}



exports.getStudentById = (req : Request, res: Response) => {
    const {id} = req.params
    let student = students.find( (el: { ID: string; }) => el.ID === id);
    if(!student){
        return res.status(404).json({
            status: "fail",
            message: 'This student is not exist'
        })
    }
    

   
        res.status(201).json({
            status: "success",
            data: {
                student: student
            }
        })
}

exports.getStudentByName = (req: Request, res: Response) => {

    const name = String(req.query.name || ''); 

    if (!name.trim()) {
        return res.status(400).json({
            status: 'fail',
            message: 'Name query parameter is required',
        });
    }
    
    const matchingStudents = students.filter((student: { Name: string }) =>
        student.Name.toLowerCase().includes(name.toLowerCase())
    );

    if (matchingStudents.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No students found with that name",
        });
    }

    
    res.status(200).json({
        status: "success",
        data: {
            students: matchingStudents,
        },
    });
};

exports.getStudentByClassName = (req: Request, res: Response) => {

   const className = String(req.query.class || ''); 

    if (!className.trim()) {
        return res.status(400).json({
            status: 'fail',
            message: 'Class name is required',
        });
    }
    
   
    let classDesired = classes.find( (el: { ClassName: string; }) => el.ClassName === className);

    console.log(classDesired)
    if (!classDesired) {
        return res.status(400).json({
            status: 'fail',
            message: 'This class is not exist',
        });
    }
    const matchingStudents = students.filter((student: { Class: string }) =>
        classDesired.ID === student.Class
    );

    if (matchingStudents.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No students found with that class",
        });
    }

    
    res.status(200).json({
        status: "success",
        data: {
            students: matchingStudents,
        },
    });
};




