const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservaSchema = new Schema(
    {
        initialDate: {type: Date, required:true},
        finalDate: {type:Date, required:true},
        price:{type: Number, required: true},
        client: {type:String, required:true},
        guardian:{type:String, required: true},
        review:{type:String}

    }

);


const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;
