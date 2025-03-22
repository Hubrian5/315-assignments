const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  emailId: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
});

module.exports = mongoose.model('Order', OrderSchema);