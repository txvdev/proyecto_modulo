const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');
/*OK*/
router.get('/signin', (req, res) => {
    res.render('users/signin');
});
/*OK*/
router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signin', passport.authenticate('local', {
    successRedirect:'/notes',
    failureRedirect: '/signin',
    failureFlash: true
}));
/*OK*/
router.post('/signup', async (req, res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <= 0) {
        errors.push({text: 'Tiene que ingresar un Nombre'})
    }
    if(email.length <= 0) {
        errors.push({text: 'Tiene Que Ingresar un Email'})
    }
    if(password != confirm_password) {
        errors.push({text: 'No coinciden las contraseñas'});
    }
    if(password.length < 4) {
        errors.push({text: 'La Contraseña Tiene Que Tener Más De 4 Caracteres'})
    }
    if(errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    } else {
        /* res.send('OK formulario'); */
        
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            req.flash('error_msg ', 'Este Email Esta Siendo Usado');
            res.render('users/signup');
        }
        
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Estas Registrado!');
        res.render('users/signin');
    } 
});

router.get ('/logout', (req,res) => {
    //console.log("logging out");
    req.logout();
    res.redirect('/');
});

module.exports = router;