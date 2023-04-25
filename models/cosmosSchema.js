//schema
const validator = require("validator");
const { v4: uuidv4 } = require('uuid');
const newId = uuidv4();

var config ={
    databaseId: 'test',
    containerId: 'Items',
    partitionKey: { kind: "Hash",paths:["/id"]},
    email:{
        type:String,
        required:true,
        unique:[true,"El correo ya existe"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Correo invalido!!!");
            }
        }
    },
    id: newId,
    username: {
        type:String,
        required:false
    }

};

module.exports = {config};