const express = require("express");
const { connection } = require("./databases/mongodb/connection");
const {userRouter, taskRouter} = require("./routes/user.routes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const app = express();

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition:{
        openapi: "3.0.0",
        info:{
            title:"TaskMaster API",
            version: "1.0.0",
            description: "TaskMaster API Information",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/user",userRouter);
app.use("/task",taskRouter);

app.listen(process.env.PORT,async()=>{
    try{
      await connection;
      console.log("Connected to the database");
    }catch(err){
        console.log("Error connecting to the database",err.message);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})