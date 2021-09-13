const express = require( 'express' );
const routes = require( './routes/index' );
// path: lee el file system, los archivos que existen en las carpetas
const path = require( 'path' );
const flash = require( 'connect-flash' );
const session = require( 'express-session' );
const cookieParser = require( 'cookie-parser' );
const passport = require( './config/passport' );
require( 'dotenv' ).config( { path: 'variables.env' } );

// Crear la conexión a la BD
const db = require( './config/db' );

// Importar el modelo
require( './models/Proyectos' );
require( './models/Tareas' );
require( './models/Usuarios' );

// Helpers con algunas funciones
const helpers = require( './helpers' );

// sync() crea la estructura
db.sync()
    .then( () => console.log( 'Conectado al Servidor' ) )
    .catch( error => console.log( error ) );

// crear una aplicación de express
const app = express();

// Donde cargar los archivos estáticos
app.use( express.static( 'public' ) );

// Habilitar pug
app.set( 'view engine', 'pug' );

// Habilitar body-parser para leer datos del formulario
// parsea el cuerpo de la petición y lo pone todo en req.body
// app.use( expressValidator() );
app.use( express.urlencoded( { extended: true } ) );

// Añadir la carpeta de las vistas
// dirname retorna el directorio principal
app.set( 'views', path.join( __dirname, 'views' ) );

// agregar flash messages
app.use( flash() );

app.use( cookieParser() );

// sesiones nos permiten navegar entre distintas páginas sin volvernos a autenticar
app.use( session( {
    secret: 'super-secreto',
    resave: false,
    saveUninitialized: false
} ) );

// arranca una instancia de passport
app.use( passport.initialize() );
app.use( passport.session() );

// Pasar var dump a la aplicación
app.use( ( req, res, next ) => {
    
    // res.locals.<nombre>: hacer disponible la función en cualquier lugar de la aplicación
    res.locals.vardump  = helpers.vardump;
    res.locals.mensajes = req.flash();
    // req.user; se almacena todo lo referente al usuario
    res.locals.usuario = { ...req.user } || null;
    console.log( res.locals.usuario );

    next();
} );

app.use( '/', routes() );

// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen( port, host, () => console.log( 'El servidor está corriendo en el puerto:', port ) );