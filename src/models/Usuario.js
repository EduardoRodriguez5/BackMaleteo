const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema(
    {
        email: { type: String, required: true,  pattern:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/},
        name: {type: String, required: true},
        surname: {type: String, required: true},
        birthdate: {type: Date, required: true},
        password: { type: String, required: true, minlength:8},
        rol: {type: String, default: "user"},
        location: {type: String},
        geoLocation: {type: Array},
        images: {type: Array},
        personalImage: {type: String},
        booking: [{type: Schema.Types.ObjectId, ref: 'Reserva'}]
    },
    {
        timestamps: true,
    }
);

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
