const express=require("express");
const mysql=require("mysql");

const db = mysql.createConnection({
    database: "open_wifi_tracker",
    host: "localhost",
    user: "root",
    password: ""
  })


  console.log("first")
  const getWifi= (req, res) => {
    const sql = 'SELECT * FROM wifi';
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error retrieving file data from MySQL:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(200).json(result);
      }
    });
  };
  const getSingleWifi= (req, res) => {
    const id=req.params.id;
    const sql = 'SELECT * FROM wifi WHERE id=?';
  
    db.query(sql,[id], (err, result) => {
      if (err) {
        console.error('Error retrieving file data from MySQL:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(200).json(result);
      }
    });
  };

const createWifi = (req, res) => {
    console.log("first");
   
    const sql = 'INSERT INTO wifi (address, wifi_name, latitude, longitude) VALUES (?, ?, ?, ?)';
    // const values = [address, wifi_name, latitude, longitude];
    const values = [
        req.body.address,
        req.body.wifi_name,
        req.body.latitude,
        req.body.longitude,
        // req.file.filename
      ];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error retrieving file data from MySQL:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        res.status(200).json(result);
      }
    });
  };
  

  const editWifi = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM wifi   WHERE id = ?";
    connection.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error updating wifi: ', err);
        res.status(500).json({ error: 'Failed to update wifi.' });
      } else {
        res.status(200).json({ message: 'wifi updated successfully.', results });
      }
    });
  };

  const deleteWifi = (req, res) => {
    const id = req.params.id;
    const sql = "DELETE  FROM wifi   WHERE id = ?";
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Error in deleting wifi: ', err);
        res.status(500).json({ error: 'Failed to delete wifi.' });
      }
      else if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Wifi not found.' })
       } else {
        res.status(200).json({ message: 'wifi updated successfully.', result });
      }
    });
  }; 

  const updateWifi = (req, res) => {
    console.log(req.file.filename +"......")
    const wifiId = req.params.id;
    const address = req.body.address;
    const wifi_name = req.body.wifi_name;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;
  
    const query = `UPDATE wifi SET address=?, wifi_name=?, longitude=?, latitude=? WHERE id=?`;
    connection.query(query, [address, wifi_name, longitude, latitude, wifiId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating wifi');
      } else {
        res.status(200).json({Status:"Success", message: 'Wifi updated successfully.', results });
      }})
  };
  

module.exports={createWifi, getWifi,updateWifi,editWifi,deleteWifi,getSingleWifi};
// module.exports=
//     // getWifi,
//     createWifi
