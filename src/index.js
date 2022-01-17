const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { engine } = exphbs;
const morgan = require('morgan');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const session = require('express-session');
const flash  = require('connect-flash');
const passport = require('passport');



// INITILIAZATIONS
const app = express();
require('./database');
require('./config/passport');

// SETTINGS
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

/* app.engine('handlebars', engine());
app.set('view engine', 'handlebars'); */

app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename:(req, file, cb, filename) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
app.use(multer({
    storage: storage
}).single('image'));

app.use(session({
    secret:'mysecretword',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// SERVER LISTEN
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});

