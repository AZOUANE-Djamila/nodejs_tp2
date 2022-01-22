//#region  REQUIRE
var expess = require("express")
var bodyparser =require("body-parser")
const mysql = require('mysql2');
//#endregion

//#region CONFIGURATION
var app = expess()
app.use(expess.static("public")) // traiter les fichiers statiques: ASSETS (HTML, CSS, JS)
app.set("view engine", "vash")
app.use(bodyparser.json())  // récupérer les données JSON envoyées
app.use(bodyparser.urlencoded({extended:true})) // récupérer les données FORMULAIRES envoyés
//#endregion


app.get("/user", function(req,rep){
    var user = { usr : req.query.nom, pwd : req.query.pass}
    console.log(JSON.stringify(user))
    rep.json(user) // rep.end(JSON.stringify(user))
})
app.post("/user", function(req,rep){
    var user = { usr : req.body.nom, pwd : req.body.pass}
    console.log(JSON.stringify(user))
    rep.json(user) 
})
app.put("/user/:id", function(req,rep){
    var id = req.params.id
    console.log(`id reçu est ${id}`)
    rep.end(`id reçu est ${id}`) 
})

//#region API DES EMPLOYES

app.get("/api/employes", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'SELECT * FROM employees',
        function(err, results) {
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de chargement des employés")
            }
            rep.json(results)
        }
      );
    //connection.destroy()
})

app.get("/api/employes/:id", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'SELECT * FROM employees where employeeNumber = ?', [req.params.id],
        function(err, results) {
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de chargement de l'employé")
            }
            if (results.length == 0){
                rep.status(404).end() 
                return;
            }
            rep.json(results)
        }
      );
    //connection.destroy()
})

app.post("/api/employes", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'insert into employees set ?', [req.body],
        function(err, results) {
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de création de l'employé")
            }
            rep.status(201).json([message="OK"])
        }
      );
    //connection.destroy()
})

app.put("/api/employes/:id", function(req, rep){
    if (req.body.employeeNumber)
       rep.status(400).end("ERREUR")
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'update employees set ? where employeeNumber = ?', 
        [req.body, req.params.id],
        function(err, results) { 
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de création de l'employé")
            }
            rep.status(201).json([message="OK"])
        }
      );
    //connection.destroy()
})

app.delete("/api/employes/:id", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'delete from employees where employeeNumber = ?', [req.params.id],
        function(err, results) { 
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de création de l'employé")
            }
            rep.status(204).end()
        }
      );
    //connection.destroy()
})

//#endregion 

//#region VIEW EMPLOYES
 
app.get("/employes.html", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'SELECT * FROM employees',
        function(err, results) {
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de chargement des employés")
            }
            rep.render("liste", {donnees:results})
        }
      );
    //connection.destroy()
})

app.post("/employes", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'insert into employees set ?', [req.body],
        function(err, results) {
            if (err) { 
                console.log(err)
                rep.status(500).end("Erreur de création de l'employé")
            }
            rep.redirect("/employes.html")
        }
      );
    //connection.destroy()
})

app.get("/supprimer.html", function(req, rep){
    const connection = mysql.createConnection({
        host: 'localhost', user: 'root',  database: 'classicmodels' });
    connection.query(
        'delete from employees where employeeNumber = ?', [req.query.num],
        function(err, results) { 
            if (err) { 
                rep.redirect("/employes.html?DEL=KO")
            }
            rep.redirect("/employes.html?DEL=OK")
        }
      );
})

//#endregion
app.listen(8080, function(){  console.log(`Serveur port 8080`)})