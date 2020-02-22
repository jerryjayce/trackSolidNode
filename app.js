let express = require('express');
let bodyParser = require('body-parser');
require('dotenv').config();
let app = express();





// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//routes
const adminRouter = require('./routes/adminRouter');

app.use(adminRouter);



//spun up server
const port = process.env.PORT;

app.listen(port, (err)=>{
    console.log('you are listening to port' + port);
});