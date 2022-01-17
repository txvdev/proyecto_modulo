const express = require('express');
const router = express.Router();
const path = require('path');
const { unlink } = require('fs-extra');

const Image = require('../models/Image');

const { isAuthenticated } = require('../helpers/auth')
//ruta para crear notas
router.get('/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/upload', isAuthenticated, async (req, res) => {
    
    const image = new Image();

    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    const errors = [];

    if(!image.filename) {
        errors.push({text: 'Ingresa una Imagen'})
    }

    if(!image.title) {
        errors.push({text: 'Ingresa un Título'})
    }

    if(!image.description) {
        errors.push({text: 'Ingresa una Descripción'})
    }

    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
        });
    } else {
        
        image.user = req.user.id;
        await image.save();
        req.flash('success_msg', 'Nota Creada Correctamente');
        res.redirect('/notes');
    }
    
    /* console.log(errors);
    console.log(image); */
    /* res.redirect('/add') */
});

router.get('/image/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const image = await Image.findById(id);
    /* console.log(image); */
    res.render('notes/profile', { image });
})

router.get('/image/:id/delete', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const image = await Image.findByIdAndRemove(id);
    await unlink(path.resolve('./src/public' + image.path));
    req.flash('success_msg', 'Nota Eliminada');
    res.redirect('/notes');
});

router.get('/image/:id/edit', isAuthenticated, async (req, res) => {
    
    const { id } = req.params;
    const image = await Image.findById(id);
    /* console.log(image) */
    /* const note = await Image.findById(req.params.id) */
    res.render('notes/edit-note', { image });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    await Image.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Nota Actualizada Correctamente');
    res.redirect('/notes')
});

//vista para ver todas las notas
router.get('/notes', isAuthenticated, async (req, res) => {
    const image = await Image.find({user: req.user.id});
    /* console.log(image); */
    res.render('notes/all-notes', { image });
});


module.exports = router;