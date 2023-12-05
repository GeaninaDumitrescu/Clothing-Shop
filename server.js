const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const ejs = require('ejs');
const bodyParser = require('body-parser'); 
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const { User, Product } = require('./models'); 


// Exemplu de utilizare a modelului User
const newUser = new User({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'hashed_password', 
});

newUser.save((err, user) => {
  if (err) return console.error(err);
  console.log('Utilizatorul a fost salvat cu succes:', user);
});

// Exemplu de utilizare a modelului Product
const newProduct = new Product({
  name: 'Tricou alb',
  category: 'Tricouri',
  price: 70.0,
});

newProduct.save((err, product) => {
  if (err) return console.error(err);
  console.log('Produsul a fost salvat cu succes:', product);
});


// URL-ul de conexiune la MongoDB
const mongoURI = 'mongodb+srv://dumitrescugeanina23:<password>@geanina.qzrakho.mongodb.net/?retryWrites=true&w=majority';

// Conectare la MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Obține conexiunea la baza de date
const db = mongoose.connection;

// Verifică dacă există erori la conectare
db.on('error', console.error.bind(console, 'Eroare la conectarea la MongoDB:'));
// Afisează mesajul de succes la conectare
db.once('open', function() {
  console.log('Conexiunea la MongoDB a fost realizată cu succes!');
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(bodyParser.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Adaugă o rută pentru gestionarea datelor din formular
app.post('/submit-form', (req, res) => {
    console.log('Date primite de la client:', req.body);
    
    res.send('Date primite cu succes!'); 
});

app.get('/clothing', async (req, res) => {
    try {
        const dataFile = await fs.readFile(path.join(__dirname, 'data/clothingData.json'), 'utf-8');
        const clothingItems = JSON.parse(dataFile);
        res.render('clothing', { pageTitle: 'Articole de Îmbrăcăminte', clothingItems });
    } catch (error) {
        console.error(error);
        res.status(500).send('Eroare la citirea datelor despre îmbrăcăminte.');
    }
});

app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Eroare la obținerea utilizatorilor din baza de date:', error);
      res.status(500).send('Eroare la obținerea utilizatorilor din baza de date.');
    }
  });

app.listen(port, () => {
    console.log(`Serverul rulează la adresa http://localhost:${port}`);
});
