const express = require("express");
const app = express();
// const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");                    
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({extended: true}));   
// app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public"))); 
app.engine("ejs", ejsMate);

app.listen(8080, () => {
    console.log("server is listening");
});

app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.get('/predict', (req, res) => {
  res.render('predict', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.get('/simulate', (req, res) => {
  res.render('simulate', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.get('/download', (req, res) => {
  res.render('download', { 
    title: 'Home', 
    currentPage: 'home' 
  });
});

app.post('/predict', (req, res) => {
  // Process prediction
  res.render('predict', { 
    title: 'Predict', 
    currentPage: 'predict',
    prediction: results 
  });
});