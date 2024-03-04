const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const connexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '19_saas'
});

// Connexion à la base de données
connexion.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ' + err);
        return;
    }
    console.log('Connecté à la base de données');
    // Démarrage du serveur une fois la connexion établie
    app.listen(port, () => {
        console.log("Serveur en écoute sur le port " + port);
    });
});

// Route pour créer un nouvel employé
app.post('/employees', (req, res) => {
    const { nom, prenom, mail, age, role } = req.body;
    const sql = "INSERT INTO employees (nom, prenom, mail, age, role) VALUES (?, ?, ?, ?, ?)";
    connexion.query(sql, [nom, prenom, mail, age, role], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout de l'employé :", err);
            res.status(500).send("Une erreur s'est produite lors de l'ajout de l'employé");
        } else {
            res.send("L'employé a été ajouté avec succès");
        }
    });
});

// Route pour récupérer tous les employés
app.get('/employees', (req, res) => {
    const sql = "SELECT * FROM employees";
    connexion.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des employés :", err);
            res.status(500).send("Une erreur s'est produite lors de la récupération des employés");
        } else {
            res.json(results);
        }
    });
});

// Route pour récupérer les informations d'un employé par son ID
app.get('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const sql = "SELECT * FROM employees WHERE id = ?";
    connexion.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération de l'employé :", err);
            res.status(500).send("Une erreur s'est produite lors de la récupération de l'employé");
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send("Aucun employé trouvé avec cet ID");
            }
        }
    });
});

// Route pour mettre à jour les informations d'un employé
app.put('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { nom, prenom, mail, age, role } = req.body;
    const sql = "UPDATE employees SET nom = ?, prenom = ?, mail = ?, age = ?, role = ? WHERE id = ?";
    connexion.query(sql, [nom, prenom, mail, age, role, employeeId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de l'employé :", err);
            res.status(500).send("Une erreur s'est produite lors de la mise à jour de l'employé");
        } else {
            res.send("L'employé a été mis à jour avec succès");
        }
    });
});

// Route pour supprimer les informations d'un employé
app.delete('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const sql = "DELETE FROM employees WHERE id = ?";
    connexion.query(sql, [employeeId], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression de l'employé :", err);
            res.status(500).send("Une erreur s'est produite lors de la suppression de l'employé");
        } else {
            res.send("L'employé a été supprimé avec succès");
        }
    });
});
