require('dotenv').config({path: '../.env'});

const app = require('./app');
const PORT = process.env.PORT || 8000;



app.get('/', (req, res) => {
    res.send('API is running...');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
