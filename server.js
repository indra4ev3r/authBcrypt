const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json());

// User database (sample array for testing purposes)
const users = [];

//GET users from database
app.get('/users', (req, res) => {
    res.json(users);
});

//POST User into database
app.post('/users', async (req, res) => {
    try {
        // const salt = await bcrypt.genSalt();
        const hashedPassword = await  bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user);
        res.status(201).send();
    } catch (err) {
        res.status(500).send();
        console.error(err);
    }
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name == req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('success');
        } else {
            res.send('Not allowed');
        }
    } catch {
        res.status(500).send();
    }
})

app.listen(3000);
