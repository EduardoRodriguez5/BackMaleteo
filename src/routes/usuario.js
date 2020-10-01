const express = require('express');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/autentication');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var multer  = require('multer')

const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const IMAGES_URL_BASE = "http://localhost:4000/profileImages";

const fileFilter = (req, file, cb) => {
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    cb(new Error('Invalid file type'));
  } else {
    cb(null, true);
  }
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public" + "/profileImages")
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
    const personalImage = IMAGES_URL_BASE + "/user.png";
    
    bcrypt.hash(password, saltRounds, function(err, hash) {
        const usuario = new Usuario()

        usuario.email = email;
        usuario.name = name;
        usuario.surname = surname;
        usuario.birthdate = birthdate;
        usuario.password = hash;
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

usuarioRouter.put("/update/:id", upload.single('avatar'), (req, res)=> {
    const id = req.params.id;


    const name = req.body.name;
    const surname = req.body.surname;
    const birthdate = req.body.birthdate;

    Usuario.findByIdAndUpdate(id, {
        name: name,
        surname: surname,
        birthdate: birthdate,
        personalImage: req.file && req.file.filename ? IMAGES_URL_BASE + "/" + req.file.filename : IMAGES_URL_BASE + "/user.png"
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

usuarioRouter.put("/changeGuardian/:id",  upload.array('images', 10), (req, res)=> {
    const id = req.params.id;

    const rol = "Guardian";
    const location = req.body.location;
    const geoLocation = req.body.geoLocation;
    const images = req.files.map((file, i) => {
        return IMAGES_URL_BASE + "/" + file.filename
    })

    Usuario.findByIdAndUpdate(id, {
        rol: rol,
        location: location,
        geoLocation: geoLocation,
        images: images
    })
        .then(()=> {
            return Usuario.findById(id);
        })
        .then((newGuardian)=> {
            res.send(newGuardian);
        })
        .catch((error)=> {
            res.status(500).send(error);
        })
})




usuarioRouter.get('/logout', authenticateJWT, (req, res)=> {

    const userData = req.user

    res.json({ loggedout : true, goodBye: userData.email})
})




module.exports = usuarioRouter;
