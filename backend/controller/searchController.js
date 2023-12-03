const mysql = require('mysql');

// Create a MySQL database connection
const db = mysql.createConnection({
    database: "open_wifi_tracker",
    host: "localhost",
    user: "root",
    password: ""
})


const searchWifi = (req, res) => {
    console.log(req, "....")
    const searchTerm = req.query.q;

    console.log(searchTerm + "........")
    if (searchTerm.length > 0) {
        const query = `SELECT * FROM wifi WHERE wifi_name LIKE '%${searchTerm}%' OR address LIKE '%${searchTerm}%' `;
        db.query(query, (err, results) => {
            if (err) {
                console.log('Error querying database:', err);
                res.status(500).send('Error querying database');
                return;
            }
            console.log(results + "hello");
            res.status(200).json({ results, Status: "Success" });
        });
    }
};

module.exports = { searchWifi }