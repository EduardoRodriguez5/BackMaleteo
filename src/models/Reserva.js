const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservaSchema = new Schema(
    {
        initialDate: {type: Date, required:true},
        finalDate: {type:Date, required:true},
        nSuitcases: {type:Number, required: true},
        price:{type: Number, default: 6},
        client: {type:String, required:true},
        guardian:{type: Schema.Types.ObjectId, ref:"Usuario"},
        review:{type:String}

    }

);


const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;
