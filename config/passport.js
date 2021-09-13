const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;

// Referencia al modelo a donde vamos autenticar
const Usuarios = require( '../models/Usuarios' );

// local strategy - Login con credenciales propias ( usuari - password )
// passport.use(): nos permite configurar passport
passport.use( new LocalStrategy(
        // por default passport espera un usuario y password, pero se puede reescribir esa funcionalidad
        {
            // email y password: nombres de como vienen en el modelo
            usernameField: 'email',
            passwordField: 'password'
        },

        // Una vez que se define que campos van a autenticar al usuario es donde se realiza la consulta a la BD
        // para saber si existe o no la cuenta
        async ( email, password, done ) => {

            try {

                const usuario = await Usuarios.findOne( { where: { 
                    email,
                    activo: 1
                } } );

                // El usuario existe, password incorrecto
                if( !usuario.verificarPassword( password ) ){
                    return done( null, false, {
                        message: 'Password incorrecto'
                    } );
                }

                // El email existe y el password es correcto
                return done( null, usuario );
            }

            catch( error ) {
                // ese usuario no existe
                // next o done toma 3 parámetros: error, usuario
                return done( null, false, {
                    message: 'Esa cuenta no existe'
                } );
            }

        }
    )
)

// Leer los valores del objeto

// serializar el usuario
passport.serializeUser( ( usuario, callback ) => {
    // cb() resgresa error y usuario
    callback( null, usuario );
} );

// deserializar el usuario
passport.deserializeUser( ( usuario, callback ) => {
    callback( null, usuario );
} );

 module.exports = passport;