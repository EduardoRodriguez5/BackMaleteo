const express = require('express');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/autentication');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var multer  = require('multer')

const VALID_FILE_TYPES = ['image/png', 'image/jpg'];
const IMAGES_URL_BASE = "/profileImages";

const fileFilter = (req, file, cb) => {
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type'));
  } else {
    cb(null, true);
  }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public" + IMAGES_URL_BASE)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
  var upload = multer({ storage: storage, fileFilter: fileFilter })



const usuarioRouter = express.Router();

usuarioRouter.post('/register',  (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const surname = req.body.surname;
    const birthdate = req.body.birthdate;
    const password = req.body.password;
    
    bcrypt.hash(password, saltRounds, function(err, hash) {
        const usuario = new Usuario()

        usuario.email = email;
        usuario.name = name;
        usuario.surname = surname;
        usuario.birthdate = birthdate;
        usuario.password = hash;

        usuario.save()
            .then((newUsuario)=> {
                res.json(newUsuario);
            })
            .catch((error)=> {
                res.status(500).send(error);
            })
    });
});
usuarioRouter.post('/registerGuardian', authenticateJWT, (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const surname = req.body.surname;
    const birthdate = req.body.birthdate;
    const password = req.body.password;
    const rol = "Guardian";
    const location = req.body.location;
    const geoLocation = req.body.geoLocation;
    const images = req.body.images;
    const personalImage = req.body.personalImage;
        
    bcrypt.hash(password, saltRounds, function(err, hash) {
        const usuario = new Usuario()

        usuario.email = email;
        usuario.name = name;
        usuario.surname = surname;
        usuario.birthdate = birthdate;
        usuario.password = hash;
        usuario.rol = rol;
        usuario.location = location;
        usuario.geoLocation = geoLocation;
        usuario.images = images;
        usuario.personalImage = personalImage;

        usuario.save()
            .then((newUsuario)=> {
                res.json(newUsuario);
            })
            .catch((error)=> {
                res.status(500).send(error);
            })
    });
});

usuarioRouter.post('/login',  (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Usuario.findOne({ email : email })
    .then((user) => {
        if(user)
        {
            bcrypt.compare(password, user.password, function(err, result) {
                if(result)
                {
                    const accessToken = jwt.sign(
                        { userID: user._id, email: user.email , name: user.name, rol: user.rol},
                        process.env.JWT_SECRET);
                    return res.json({ logged : true, token: accessToken, user:{name: user.name, surname: user.surname, email: user.email, birthdate: user.birthdate, id: user._id, logged : true} })
                }
                else
                {
                    return res.status(404).json({ logged : false})
                }
            });
        }
        else
        {
            return res.status(404).json({ logged : false})
        }
    })
    .catch((err)=>{
        return res.status(404).json({ logged : false})
    })
});

usuarioRouter.get('/guardianes/:id',  (req, res)=> {
    const id = req.params.id;
    Usuario.findById(id, {__v: 0, updatedAt: 0, createdAt: 0})
        .exec((err, Usuario) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(Usuario)
            }
        })
})

usuarioRouter.get('/guardianes', (req, res) => {
    Usuario.find({rol: "Guardian"}, {__v: 0, createdAt: 0, updatedAt: 0})
        .exec((err, usuarios) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(usuarios)
            }
        })
});

usuarioRouter.put("/update/:id", (req, res)=> {
    const id = req.params.id;

    const email = req.body.email;
    const name = req.body.name;
    const surname = req.body.surname;
    const birthdate = req.body.birthdate;
   

    Usuario.findByIdAndUpdate(id, {
        email: email,
        name: name,
        surname: surname,
        birthdate: birthdate,
    })
        .then(()=> {
            return Usuario.findById(id);
        })
        .then((usuarioActualizado)=> {
            res.send(usuarioActualizado);
        })
        .catch((error)=> {
            res.status(500).send(error);
        })
})



usuarioRouter.get('/logout', authenticateJWT, (req, res)=> {

    const userData = req.user

    res.json({ loggedout : true, goodBye: userData.email})
})

// usuarioRouter.post('/profile', upload.single('avatar'), function (req, res, next) {
    
//     Usuario.findByIdAndUpdate(req.user.userID, {
//         personalImage: IMAGES_URL_BASE + "/" + req.file.filename
//     })
//     .then((updateUser,err) => {
//         if(err)
//         {
//             res.status(500).send(err)
//         }
//         else {
//             res.send("Imagen actualizada")
//         }
//     })

//   })


module.exports = usuarioRouter;
