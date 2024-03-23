import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    line_items:Object,
    name:String,
    email:String,
    address:String,
    province:String,
    postalCode:String,
    phone:String,
    paid:Boolean,
    deliveryStatus: String,
},{
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);