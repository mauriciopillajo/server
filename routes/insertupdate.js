const config = require('../config')
const express = require("express");
const router = express.Router();
const validator = require("validator");
const cors = require('cors')

router.use(express.json());
require('dotenv').config();
const CosmosClient = require("@azure/cosmos").CosmosClient;
//config and db data
const configData = require("../models/cosmosSchema");
const dbconn = require("../models/cosmos_connection");

const databaseId = configData.config.databaseId;
const containerId = configData.config.containerId;

const endpoint = config.host;
const key = config.authKey;
const options = {
    endpoint: endpoint,
    key: key,
    userAgentSuffix: 'mpillajodbcosmos'
};

const client = new CosmosClient(options);
const database = client.database(databaseId);
const container = database.container(containerId);
dbconn.create(client, databaseId, containerId);
//Insert and update records to cosmos DB
const upsertDocumentAsync = async (doc) => {
    const result = container.items.upsert(doc);
    return result;
};
//delete record
const deleteDocumentAsync = async (id) => {
    const result = container.item(id).delete();
    return result;
};

router.get("/usuarios",async(req,res)=>{
    const querySpec = {
        query: `SELECT * FROM c`
    };
    let {"resources":userData} = await container.items.query(querySpec).fetchAll();
    userData.forEach(item =>{
        console.log("username", item.username);
    });
    return res.json({userData});
});

router.post("/usuarios",cors(),async(req,res)=>{
    try{
        let id = configData.config.id;
        let email = req.body.email;
        console.debug(email);

        if(validator.isEmail(email)){
            const querySpec = {
                query: `SELECT * FROM c WHERE (c.email='${email}')`
            };
            //Reading items in the Items container
            let {resources: userData} = await container.items.query(querySpec).fetchAll();
            console.debug("userData", userData);
            if(userData.length === 0){
                //New user created
                const {resource: createRecord } = await upsertDocumentAsync({...req.body,id});
                console.debug("Nuevo registro creado: ", createRecord);
                return res.status(200).send({message:"Nuevo registro creado : ",createRecord});
            }
            else{
                //Actualiza registro
                let id = "";
                userData.forEach(item =>{
                    id = item.id;
                });
                const { resource: updateRecord } = await upsertDocumentAsync({...req.body,id});
                console.debug("Registro actualizado : ",updateRecord);
                return res.status(200).send({message:"Registro actualizado :",updateRecord});
            }
        }
        else{
            return res.status(400).send({message:"Correo no valido, ingrese un correo valido"});            
        }    
    } catch(e) {
        return res.status(400).send(e);
    }
});

router.delete("/usuarios/:userid/",async(req,res)=>{
    try{
        const id = req.params.userid;
        console.log('userid',id);
        //Chequear nulo
        if(!id){
            res.status(404).send({message:"Ingrese un correo o id de usuario!!!"});            
        }
        const querySpec = {
            query: `SELECT * FROM c WHERE (c.id = '${id}')`
        };
        //Leer registros del contenedor
        let {resources:userDataById} = await container.items.query(querySpec).fetchAll();
        console.log("userDataById",userDataById.length);

        if (userDataById.length === 0 ){
            return res.status(400).send({message:"Id usuario no existe en UserPreferences"});
        } else {
            const { resource: deleteUserDataById} = await deleteDocumentAsync (id, id);
            console.log({message:"Registro eliminado de UserPreferences: ", userDataById});
            return res.status(200).send({message:"Registro eliminado de UserPreferences", userDataById});
        }
    } catch(error){
        return res.status(404).send(error);
    }
});

module.exports = router;