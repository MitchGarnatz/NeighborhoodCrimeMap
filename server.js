// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = 8000;

app.use(express.json());

// Open SQLite3 database (in read-write mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});


// GET request handler for crime codes
app.get('/codes', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let q, p, x;
    let query = req.query
    if(query.hasOwnProperty('code')) {
        p = "("+query.code+")"
        console.log('P:', p)
        q = 'SELECT * FROM Codes WHERE code IN ' + p; //Not the way to do this but it works. Always get a syntax error if using the ? symbol
    } else {
        q = 'SELECT * FROM Codes';
    }

    databaseSelect(q, x)
    .then((data) => {
        res.status(200).type('json').send(data); // <-- you will need to change this
    })


});


// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    let p, q;
    let query = req.query
    
    console.log(query);
    if(query.hasOwnProperty('neighborhood')) {
        q = "SELECT * FROM Neighborhoods WHERE neighborhood_number = ?";
        p = query.neighborhood;
        p = p.split(',');
        for(let i = 1; i < p.length; i++){
            q = q + ' OR neighborhood_number = ?';
        }
    } else {
        q = 'SELECT * FROM Neighborhoods';
    }

    databaseSelect(q, p)
    .then((data) => {
        res.status(200).type('json').send(data); // <-- you will need to change this
    })
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let p, q;
    let query = req.query
    console.log(query);

    q = 'SELECT * FROM Incidents ORDER BY date_time LIMIT 1000';

    databaseSelect(q, p)
    .then((data) => {
        console.log(data);
        data.forEach(element => {
            date_time = element.date_time.split('T')
            element.date = date_time[0];
            element.time = date_time[1];
            delete element.date_time;
        });
        res.status(200).type('json').send(data); // <-- you will need to change this
    })
    
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {

    //select case number and check against query, throw exception if case numbers match. update db otherwise.

    console.log(req.body); // uploaded data
    
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data

    let p1, p2, q1, q2;
    let incidentFound = false;
    let removeNumber = req.body.case_number;
    
    q1 = 'SELECT * FROM Incidents WHERE case_number = ' + removeNumber;

    databaseSelect(q1, p1)
    .then((data) => {
        console.log(data);
        data.forEach(element => {
            //if object found, object will be deleted = true
            if (element.case_number === '' + removeNumber) {
                incidentFound = true;
            }
        });
        //if object !found, 500 error will be thrown
        if (incidentFound == false) {
            return res.status(500).send({'500 error page: ' :removeNumber + ' does not exist. Try another incident number.'});
        }
    })
    // if case_number is in the DB delete
    q2 = 'DELETE FROM Incidents WHERE case_number = ' + removeNumber;

    databaseRun(q2, p2)
    .then(() => {
        res.status(200).type('txt').send('Incident with case number ' + removeNumber + ' was removed.'); // <-- you may need to change this
    })
});


// Create Promise for SQLite3 database SELECT query 
function databaseSelect(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        })
    })
}

// Create Promise for SQLite3 database INSERT or DELETE query
function databaseRun(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
}


// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});


//order by most recent: select * from Incidents where date(date_time) < '2022-01-02' ORDER BY date_time DESC LIMIT 15;
// IN CMD: curl "http://localhost:8000/codes"
// for puts : curl -X PUT "http//localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"key1\": 42}"
// for deletes: curl -X DELETE "http//localhost:8000/remove-incident" -H "Content-Type: application/json" -d "{\"key1\": 42}"