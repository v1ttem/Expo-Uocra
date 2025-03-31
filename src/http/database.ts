import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "159.89.185.31",
    user: "admin",      
    password: "bd99d7eed4d83d35c3c1a47a68fa0c7ee2df675d206b66cb",      
    database: "api"
});

connection.connect((err) => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

export default connection;
