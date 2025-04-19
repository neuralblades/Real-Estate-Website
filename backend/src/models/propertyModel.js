const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
    },
    location: {
      type: String,
      required: [true, 'Property location is required'],
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['apartment', 'house', 'villa', 'penthouse', 'commercial'],
    },
    status: {
      type: String,
      enum: ['for-sale', 'for-rent', 'sold', 'rented'],
      default: 'for-sale',
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
    },
    area: {
      type: Number,
      required: [true, 'Property area is required'],
    },
    features: [String],
    images: [String],
    mainImage: {
      type: String,
      required: [true, 'Main property image is required'],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent information is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },
    yearBuilt: Number,
    parkingSpaces: Number,
    furnished: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for inquiries
propertySchema.virtual('inquiries', {
  ref: 'Inquiry',
  localField: '_id',
  foreignField: 'property',
  justOne: false,
});

// Index for search
propertySchema.index({ title: 'text', description: 'text', location: 'text' });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
