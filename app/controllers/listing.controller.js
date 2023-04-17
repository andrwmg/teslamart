const db = require('../models/index.js')
const Listing = db.listings
// const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
// const mapboxToken = process.env.MAPBOX_TOKEN
// const geocoder = mbxgeocoding({ accessToken: mapboxToken })
// const { cloudinary } = require('../cloudinary')

exports.create = (req, res) => {
  const { model, year, trim, interior, exterior, autopilot, mileage, condition, title, location, price, description, author, images } = req.body
  console.log(req.body)
  const newListing = new Listing(
    {
      model: model,
      year: year,
      trim: trim,
      interior: interior,
      exterior: exterior,
      autopilot: autopilot,
      mileage: mileage,
      condition: condition,
      title: title,
      location: location,
      price: price,
      description: description,
      author: author,
      comments: [],
      images: images,
      author: req.session.user._id
    }
  );
  // Save Listings in the database
  newListing
    .save()
    .then(data => {
      res.send({ id: data._id.toString(), message: 'Listing created successfully', messageStatus: 'success' });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Listing.",
        messageStatus: 'error'
      });
    });
};

exports.findAll = (req, res) => {
  Listing.find()
    .populate('author')
    .populate('images')
    .populate({
      path: 'comments',
      populate: { path: 'author' }
    })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving listings.", messageStatus: 'error'
      });
    });
};

exports.findSome = (req, res) => {
  const { model, year, trim, interior, exterior, autopilot, sort, order } = req.query
  const filter = {}
  const sortOrder = {}
  if (sort && order) {
    sortOrder[sort] = order
  } else {
    sortOrder['createdAt'] = -1
  }
  if (model) {
    filter.model = model
  }
  if (year) {
    filter.year = year
  }
  if (trim) {
    filter.trim = trim
  }
  if (interior) {
    filter.interior = interior
  }
  if (exterior) {
    filter.exterior = exterior
  }
  if (autopilot) {
    filter.autopilot = autopilot
  }
  Listing.find(filter).sort(sortOrder)
    .populate('author')
    .populate('images')
    .populate({
      path: 'comments',
      populate: { path: 'author' }
    })
    .then(data => {
      res.send(data)
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id;
  Listing.findById(id)
    .populate('author')
    .populate('images')
    .populate({
      path: 'comments',
      populate: {
        path: 'author'
      }
    })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Listing with id " + id, messageStatus: 'error' });
      } else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Listing with id=" + id, messageStatus: 'error' });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!", messageStatus: 'error'
    });
  }

  const { id } = req.params;

  Listing.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Listing with id=${id}. Maybe Listing was not found!`, messageStatus: 'error'
        });
      } else res.send({ message: "Listing was updated successfully.", messageStatus: 'success' });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Listing with id=" + id, messageStatus: 'error'
      });
    });
}

exports.delete = (req, res) => {
  const {id} = req.params;
  Listing.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Listing with id=${id}. Maybe Listing was not found!`,
          messageStatus: 'error'
        });
      } else {
        res.send({
          message: "Listing was deleted successfully!", messageStatus: 'success'
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Listing with id=" + id,
        messageStatus: 'error'
      });
    });
  }

exports.deleteAll = (req, res) => {
  Listing.deleteMany({})
    .then(() => {
      res.send({ message: 'You just done deleted all them listings', messageStatus: 'success' })
    })
}

exports.seed = (req, res) => {
  Listing.insertMany(req.body)
}