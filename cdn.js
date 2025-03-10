const express = require('express');
const path = require('path');
const request = require('request');

const app = express();
const PORT = 1223;

app.set('trust proxy', true);

app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'interest-cohort=()');
    next();
});

app.use((req, res) => {
    res.status(404).json({errors:[{code:0,message:"NotFound"}]}) 
});

app.listen(PORT, () => {
    console.log(`Express started on port ${PORT}`);
});