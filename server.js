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
    let q, p;
    let query = req.query
    console.log(query);
    if(query.hasOwnProperty('code')) {
        q = 'SELECT * FROM Codes WHERE code = ? ';
        p = query.code;
        p = p.split(',');
        for(let i = 1; i < p.length; i++){
            q = q + ' OR code = ?';
        }
    } else {
        q = 'SELECT * FROM Codes';
    }

    databaseSelect(q, p)
    .then((data) => {
        res.status(200).type('json').send(data); // <-- you will need to change this
    })


});


// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    let p, q;
    let query = req.query
    

    if(query.hasOwnProperty('id')) {
        q = "SELECT * FROM Neighborhoods WHERE neighborhood_number = ?";
        p = query.id;
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
    p = [];
    let query = req.query;
    let second = false;
    console.log(query);

    q = 'SELECT * FROM Incidents';

    if(query.hasOwnProperty('code')) {
        if(second){
            q = q + ' AND';
        } else {
            q = q + ' WHERE';
            second = true;
        }
        let t = query.code;
        t = t.split(',');
        t.forEach(element =>{
            p.push(element);
        })
        q = q + ' code = ?';
        for(let i = 1; i < t.length; i++){
            q = q + ' OR code = ?';
        }
    } 

    if(query.hasOwnProperty('neighborhood')) {
        if(second){
            q = q + ' AND';
        } else {
            q = q + ' WHERE';
            second = true;
        }
        let t = query.neighborhood;
        t = t.split(',');
        t.forEach(element =>{
            p.push(element);
        })
        q = q + ' neighborhood_number = ?';
        for(let i = 1; i < t.length; i++){
            q = q + ' OR neighborhood_number = ?';
        }
    }

    if(query.hasOwnProperty('grid')) {
        if(second) {
            q = q+ ' AND';
        } else {
            q = q + ' WHERE';
            second = true;
        }
        let t = query.grid;
        t = t.split(',');
        t.forEach(element => {
            p.push(element);
        })
        q = q + ' police_grid = ?';
        for(let i = 1; i<t.length; i++) {
            q = q + ' OR police_grid = ?';
        }
    }

    if(query.hasOwnProperty('start_date')) {
        if(second) {
            q = q + ' AND';
        } else {
            q = q + ' WHERE';
            second = true;
        }
        let t = query.start_date;
        p.push(t);
        q = q + ' date(date_time) > ?';
    }

    if(query.hasOwnProperty('end_date')) {
        if(second) {
            q = q + ' AND';
        } else {
            q = q + ' WHERE';
            second = true;
        }
        let t = query.end_date;
        p.push(t);
        q = q + ' date(date_time) < ?';
    }

    q = q + ' ORDER BY date_time';

    if(query.hasOwnProperty('limit')) {
        q = q + ' LIMIT ?';
        p.push(query.limit);
    } else {
        q = q + ' LIMIT 1000';
    }


    databaseSelect(q, p)
    .then((data) => {
        
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

    let p, q;
    let incidentFound = false;
    let insertCaseNumber = req.body.case_number;
    let insertDateTime = req.body.date + "T" + req.body.time;
    let insertCode = req.body.code;
    let insertIncident = req.body.incident;
    let insertPoliceGrid = req.body.police_grid;
    let insertNeighborhoodNumber = req.body.neighborhood_number;
    let insertBlock = req.body.block.toString();
    
    //check if obj is in db
    q = 'SELECT * FROM Incidents WHERE case_number = ' + insertCaseNumber;

    databaseSelect(q, p)
    .then((data) => {
        console.log(data);
        data.forEach(element => {
            //if object found, object will be deleted = true
            if (element.case_number === '' + insertCaseNumber) {
                incidentFound = true;
            }
        });
        //if object !found, 500 error will be thrown
        if (incidentFound == true) {
            return res.status(500).send({'500 error page: ' :insertCaseNumber + ' already exists. Try another incident number.'});
        }
        else {

            //if case_number is not in the DB delete
            q = 'INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES \
            (' + insertCaseNumber + ',\'' + insertDateTime + '\',' + insertCode + ',\'' + insertIncident +'\',' +insertPoliceGrid + ',' 
            + insertNeighborhoodNumber + ',\'' + insertBlock +'\')';

            databaseRun(q, p)
            .then(() => {
                q = 'SELECT * FROM Incidents WHERE case_number = ' + insertCaseNumber;
                databaseSelect(q, p)
                .then((data) => {
                    console.log(data);
                });
                res.status(200).type('txt').send('Incident with case number ' + insertCaseNumber + ' was added.'); // <-- you may need to change this
            })
        }
    })
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data

    let p, q;
    let incidentFound = false;
    let removeNumber = req.body.case_number;
    
    q = 'SELECT * FROM Incidents WHERE case_number = ' + removeNumber;

    databaseSelect(q, p)
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
        else {
            // if case_number is in the DB delete
            q = 'DELETE FROM Incidents WHERE case_number = ' + removeNumber;

            databaseRun(q, p)
            .then(() => {
             res.status(200).type('txt').send('Incident with case number ' + removeNumber + ' was removed.'); // <-- you may need to change this
            })
        }
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
//curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 14174007, \"date\": \"2014-08-17\", \"time\": \"04:02:00\", \"code\": 1410, \"incident\": \"Vandalism\", \"police_grid\": 50, \"neighborhood_number\": 6, \"block\": \"FRONT AV "&" WESTERN\"}"
//curl -X DELETE "http://localhost:8000/remove-incident" -H "Content-Type: application/json" -d "{\"case_number\": 14174007}"  