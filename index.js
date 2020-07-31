'use strict'

const express = require('express')
const bodyPaser = require('body-parser') 
const mongoose = require('mongoose')

const Post = require('./models/post.js')

const app = express()
const port = process.env.PORT || 3001

app.use(bodyPaser.urlencoded({ extended: false}))
app.use(bodyPaser.json())

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Request-Headers', 'content-type');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/api/post', (req, res) => {
    Post.find({}, (err, posts) => {
        if(err) return  res.status(500).send({message: `Error al realizar la peticion ${err}`})
        if(!posts) return res.status(404).send({message: `No existen posts`})


        res.send(200, {posts } )
    })
})

app.get('/api/post/:postId', (req, res) => {
    let postId = req.params.postId

    Post.findById(postId, (err, post) => {
        if (err) return  res.status(500).send({message: `Error al realizar la peticion ${err}`})
        if(!post) return res.status(404).send({mesagge: `El producto no existe`})

        res.send(200, {post} )
  })
})

app.post('/api/post' , (req, res) => {
    console.log('POST /api/post')
    console.log(req.body)

    let post = new Post()
    post.title = req.body.title
    post.text = req.body.text
    post.timeStamp = Date.now();
    post.save((err, postStored) => {
        if(err) res.status(500).send({message: `Error al salvar en la base de datos: ${err} `})

        res.status(200).send(post)
    })
})

app.put('/api/post/:postId' , (req, res) => {
    let postId = req.params.postId
    let update = req.body
    Post.findByIdAndUpdate(postId, update, (err, postUpdated) => {
        if (err) res.status(500).send({message: `Error al actualizar el post ${err}`})


        res.status(200).send({ post: postUpdated })
    })
})

app.delete('/api/post/:postId' , (req, res) => {
    let postId = req.params.postId
    Post.findById(postId, (err, post) => {
        if (err) res.status(500).send({message: `Error al borrar el post ${err}`})

        post.remove(err => {
            if (err) res.status(500).send({message: `Error al borrar el post ${err}`});
            // si borra el post consulto nuevamente todos los post y los envio
            Post.find({}, (err, posts) => {
                if(err) return  res.status(500).send({message: `El post fue borrado pero error al realizar la peticion de posts ${err}`})
                if(!posts) return res.status(404).send({message: `El post fue borrado pero no existen posts`})
        
                res.status(200).send({message: `El post fue borrado`, posts});
            });
            
        })
    });
})

app.delete('/api/post' , (req, res) => {
    Post.remove({}, (err, posts) => {
        if(err) return  res.status(500).send({message: `Error al realizar la peticion ${err}`})
        if(!posts) return res.status(404).send({message: `No existen posts`})


        res.status(200).send({message: `Los post fueron borrados`})
    })
})

app.get('/api/post/generate_random' , (req, res) => {

    createRandomsPost();

});


mongoose.connect('mongodb://localhost:27017/challenge', (err, res) => {
    if (err) throw err
    console.log('Conexion a la base de datos establecida...')
    
    
    app.listen(port, () => {
    console.log(`Api-rest corriendo en http://localhost${port}`)
})
   
}
);
