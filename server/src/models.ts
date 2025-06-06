import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
password: { type: String, required: true },
isAdmin: { type: Boolean, default: false },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
createdAt: { type: Date, default: Date.now },
});

const banSchema = new mongoose.Schema({
ip: { type: String, required: true },
duration: { type: Number, required: true },
end: { type: Number, required: true },
reason: { type: String },
issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
issuedAt: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema({
reporterId: { type: String, required: true },
reportedId: { type: String, required: true },
reason: { type: String, required: true },
pairId: { type: String },
messages: [{ text: String, gifId: String, timestamp: Number }],
timestamp: { type: Date, default: Date.now },
status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
});

export const Admin = mongoose.model('Admin', adminSchema);
export const Ban = mongoose.model('Ban', banSchema);
export const Report = mongoose.model('Report', reportSchema);
