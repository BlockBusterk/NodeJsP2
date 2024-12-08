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

exports.getAllClass = async (req : Request, res: Response) => {
    res.status(200).json({
        status: "sucess",
        requestedAt: Date.now(),
        count: classes.length,
        data: {
            classes: classes
        }
    });
}

exports.createClass = (req : Request, res: Response) => {
    if(req.body.ClassName === undefined){
        return res.status(404).json({
            status: "fail",
            message: 'This class must have name'
        })
    }

    let className = classes.find( (el: { ClassName: string; }) => el.ClassName === req.body.ClassName);
    if(className){
        return res.status(404).json({
            status: "fail",
            message: 'There is class with that name'
        })
    }

   
    const newId = generateRandomID('cla', 8);
    const newclass = Object.assign({ID: newId}, req.body)
    
    classes.push(newclass);

    fs.writeFile('./data/classes.json', JSON.stringify(classes,null,2), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                class: newclass
            }
        })
    })
}

exports.updateClass = (req : Request, res: Response) => {
    const {id} = req.params
    let classE = classes.find( (el: { ID: string; }) => el.ID === id);
    if(!classE){
        return res.status(404).json({
            status: "fail",
            message: 'This class is not exist'
        })
    }

    let className = classes.find( (el: { ClassName: string; ID:string }) => (el.ClassName === req.body.ClassName && el.ID !== id));
    if(className){
        return res.status(404).json({
            status: "fail",
            message: 'There is class with that name'
        })
    }

    
    const updateClass = Object.assign(classE,req.body)
    const index = classes.indexOf(classE)

    classes[index] = updateClass;

    fs.writeFile('./data/classes.json', JSON.stringify(classes, null, 2), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to update',
            });
        }

 
        res.status(200).json({
            status: 'success',
            message: 'Class updated successfully',
            data: {
                class: updateClass,
            },
        });
    });
}

exports.deleteClass = (req : Request, res: Response) => {
    const {id} = req.params

    let deleteClass = classes.find( (el: { ID: string; }) => el.ID === id);
    if(!deleteClass){
        return res.status(404).json({
            status: "fail",
            message: 'This class is not exist'
        })
    }

    let studentExist = students.find((el: { Class: string; }) => el.Class === id  )
    if(studentExist){
        return res.status(404).json({
            status: "fail",
            message: 'There still a student in this class'
        })
    }
    
    
    
    const index = classes.indexOf(deleteClass)

    classes.splice(index,1)

    fs.writeFile('./data/classes.json', JSON.stringify(classes, null, 2), (err) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Failed to delete class',
            });
        }

       
        res.status(200).json({
            status: 'success',
            message: 'Class deleted successfully',
            data: {
                class: deleteClass,
            },
        });
    });
}

exports.getClassById = (req : Request, res: Response) => {
    const {id} = req.params
    let classE = classes.find( (el: { ID: string; }) => el.ID === id);
    if(!classE){
        return res.status(404).json({
            status: "fail",
            message: 'This class is not exist'
        })
    }

        res.status(201).json({
            status: "success",
            data: {
                class: classE
            }
        })
}