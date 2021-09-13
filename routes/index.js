// const express = require( 'express' );
// const router = express.Router();
const router = require( 'express' ).Router();
// Importar express-validator
// { body } porque express validator puede validar body, cookies, headers, params, query
const { body } = require( 'express-validator/check' );

// Importar el controlador
const proyectosController = require( '../controllers/proyectosController' );
const tareasController = require( '../controllers/tareasController' );
const usuariosController = require( '../controllers/usuariosController' );
const authController = require( '../controllers/authController' );

module.exports = function (){

    // ruta para el home
    router.get( '/', 
        authController.usuarioAutenticado, 
        proyectosController.proyectoHome 
    );

    router.get( '/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto 
    );

    router.post( '/nuevo-proyecto',
        authController.usuarioAutenticado,
        body( 'nombre' ).trim().not().isEmpty().escape(),
        proyectosController.nuevoProyecto 
    );

    // Listar Proyecto
    // /:comodín: toma al comodín como parámetro, se podrá accesar a sus valores a través de req.params
    router.get( '/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl 
    );

    // Actualizar el proyecto
    router.get( '/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar 
    );

    router.post( '/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body( 'nombre' ).trim().not().isEmpty().escape(),
        proyectosController.actualizarProyecto 
    );

    // Eliminar proyecto
    router.delete( '/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto 
    );

    // Tareas
    router.post( '/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea 
    );

    // Actualizar Tarea
    router.patch( '/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea 
    );

    // Eliminar tarea
    router.delete( '/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea 
    );

    // Crear nueva cuenta
    router.get( '/crear-cuenta', usuariosController.formCrearCuenta );
    router.post( '/crear-cuenta', usuariosController.crearCuenta );
    router.get( '/confirmar/:correo', usuariosController.confirmarCuenta );

    // iniciar sesión
    router.get( '/iniciar-sesion', usuariosController.formIniciarSesion );
    router.post( '/iniciar-sesion', authController.autenticarUsuario );

    // cerrar sesion
    router.get( '/cerrar-sesion', authController.cerrarSesion );

    // reestablecer contraseña
    router.get( '/reestablecer', usuariosController.formRestablecerPassword );
    router.post( '/reestablecer', authController.enviarToken );
    router.get( '/reestablecer/:token', authController.validarToken );
    router.post( '/reestablecer/:token', authController.actualizarPassword );

    return router;
}