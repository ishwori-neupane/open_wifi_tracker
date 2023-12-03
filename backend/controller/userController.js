const express = require("express");
const mysql = require("mysql");
const app = express();
app.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const { generateAuthToken } = require("../config/auth");

const db = mysql.createConnection({
  database: "open_wifi_tracker",
  host: "localhost",
  user: "root",
  password: ""
})


console.log("first")
const getUser = (req, res) => {
  const sql = 'SELECT * FROM users';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving file data from MySQL:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      res.status(200).json(results);
    }
  });
};

const registerUser = (req, res) => {
  try {
    const role = 'user'; // or 'user' depending on the role you want to retrieve
    const saltRounds = 10;

    const sql = 'SELECT * FROM roles WHERE title = ?';
    db.query(sql, [role], (err, results) => {
      if (err) {
        console.error('Error retrieving role:', err);
        // return res.status(500).json({ error: 'Error retrieving role' });
        return res.status(500).json({success:false,data :user,   message: "Error retrieving role" });

      }

      if (results.length === 0) {
        // return res.status(404).json({ error: 'Role not found' });
        return res.status(404).json({success:false,data :user,   message: "Role not found" });

      }
      //User: uttarpus_open_wifi_tracker
      //Database: uttarpus_open_wifi_tracker
      const roleData = results[0];
      console.log(roleData);
      
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const values = [
          req.body.name,
          req.body.email,
          req.body.phone_number,
          hash, // Use the hashed password instead of req.body.password
          roleData.id
        ];
        console.log(values);

        db.query(
          "INSERT INTO users (name, email, phone_number, password, role_id) VALUES (?,?,?,?,?)",
          values,
          (insertErr, result) => {
            if (insertErr) {
              if (insertErr.code === 'ER_DUP_ENTRY') {
                console.log('Phone_number already exists.');
                // return res.status(200).json({ error: 'Phone_number already exists.' });
                return res.status(200).json({success:false,data :user,   message: "Phone_number already exists.'" });

              }
              console.error('Error registering user:', insertErr);
              // return res.status(500).json({ error: 'Error registering user' });
              return res.status(200).json({success:false,data :user,   message: "Error registering user" });

            }

            console.log('User registered successfully');
            return res.status(200).json({success:true,data :user,   message: "Login Successful." });
          }
        );
      });
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};





const loginUser = (req, res) => {
  const {phone_number} = req.body;
  const {password} = req.body;
  // Check if the provided credentials match a user in the database
  db.query(
    "SELECT * FROM users WHERE phone_number = ?",
    [phone_number],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({success:false, message:"Internal server error.",data:results });
      } 
      console.log(results);
      if (results.length === 0) {
        return res.status(401).json({ success:false, message:"Internal server error.",data :results});
      }
      const user = results[0];

      // Compare the provided password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ success:false, message:"Internal server error.",data :results });
        }

        if (!match) {
          return res.status(401).json({success:false,data :results,  message:'Invalid credentials not match.' });
        }

        // Determine the user role (admin or user) based on the role_id in the database
        const role = (user.role_id === 'admin') ? 'admin' : 'user';
        user['role'] = role;

        return res.status(200).json({success:true,data :user,   message: "Login Successful." });
      });
    }
  );
};

const editUser = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM users   WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error updating User: ', err);
      res.status(500).json({ error: 'Failed to update User.' });
    } else {
      res.status(200).json({ message: 'User updated successfully.', results });
    }
  });
};


const updateUser = (req, res) => {
  const id = req.params.id;
  const { name, email, phone_number, password } = req.body;

  // Check if the requested user ID matches the authenticated user ID
  if (req.body.id !== id) {
    console.log(req.body.id);
    console.log(id)
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    // Update user details in the database
    const query = 'UPDATE users SET name = ?, email = ?, phone_number = ?, password = ? WHERE id = ?';
    db.query(query, [name, email, phone_number, hashedPassword, id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error.' });
      }
      res.status(200).json({ message: 'User details updated successfully.' });
    });
  });
}

const deleteUser = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE  FROM users   WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error in deleting User: ', err);
      res.status(500).json({ error: 'Failed to delete User.' });
    }
    else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found.' })
    } else {
      res.status(200).json({ message: 'User updated successfully.', result });
    }
  });
};

// const updateUser = (req, res) => {
//   console.log(req.file.filename +"......")
//   const id = req.params.id;
//   const address = req.body.address;
//   const User_name = req.body.User_name;
//   const longitude = req.body.longitude;
//   const latitude = req.body.latitude;

//   const query = `UPDATE users SET address=?, User_name=?, longitude=?, latitude=? WHERE id=?`;
//   connection.query(query, [address, User_name, longitude, latitude, id], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error updating User');
//     } else {
//       res.status(200).json({Status:"Success", message: 'User updated successfully.', results });
//     }})
// };


module.exports = { getUser, updateUser, editUser, deleteUser, registerUser, loginUser };
// module.exports=
//     // getUser,
//     createUser
