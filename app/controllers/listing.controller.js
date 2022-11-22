const db = require('../models/index.js')
const Listing = db.listings
// const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
// const mapboxToken = process.env.MAPBOX_TOKEN
// const geocoder = mbxgeocoding({ accessToken: mapboxToken })
// const { cloudinary } = require('../cloudinary')

exports.create = (req, res) => {
  // Validate request
  // if (!req.body.title) {
  //   res.status(400).send({ message: "Content can not be empty!", messageStatus:'error' });
  //   return;
  // }

  // Create a Tutorial
  const { model, year, trim, interior, exterior, autopilot, mileage, condition, title, location, price, description, author, images } = req.body
  console.log(req.body.images)
  console.log(req.body)
  const newListing = new Listing(
    // req.body
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
    images: images
  }
  );
  // Save Listings in the database
  newListing
    .save()
    .then(data => {
      res.send({id: data._id.toString(), message:'Listing created successfully', messageStatus: 'success'});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Listing.",
          messageStatus:'error'
      });
    });
};

exports.findAll = (req, res) => {
  // const title = req.query.title;
  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  Listing.find()
    .populate('author')
    .populate('images')
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

exports.findOne = (req, res) => {
  const id = req.params.id;
  Listing.findById(id)
  .populate('author')
  .populate('images')
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Listing with id " + id , messageStatus: 'error'});
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

    const {id} = req.params;
  
    Listing.findByIdAndUpdate(id, req.body)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Listing with id=${id}. Maybe Listing was not found!`, messageStatus: 'error'
          });
        } else res.send({ message: "Listing was updated successfully.", messageStatus:'success' });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Listing with id=" + id, messageStatus: 'error'
        });
      });
}

exports.delete = (req, res) => {
  const id = req.params.id;
  Listing.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Listing with id=${id}. Maybe Listing was not found!`,
          messageStatus:'error'
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
};

exports.deleteAll = (req, res) => {
  Listing.deleteMany({})
  .then(()=> {
    res.send({message: 'You just done deleted all them listings', messageStatus:'success'})
  })
}

exports.seed = (req, res) => {
  Listing.insertMany(req.body)
}




// exports.index = async (req, res) => {
//     const { model, year, trim, exteriorColor, interiorColor, auto, sort = 'Price', order = 'Ascending'} = req.query;
//     let filter = {};
//     let other = {};
//     if (model) {
//         filter = { ...filter, model }
//     } else {
//         other = { ...other, model: 'All' }
//     }
//     if (year) {
//         filter = { ...filter, year }
//     } else {
//         other = { ...other, year: 'All' }
//     }
//     if (trim) {
//         filter = { ...filter, trim }
//     } else {
//         other = { ...other, trim: 'All' }
//     }
//     if (exteriorColor) {
//         filter = { ...filter, exteriorColor }
//     } else {
//         other = { ...other, exteriorColor: 'All' }
//     }
//     if (interiorColor) {
//         filter = { ...filter, interiorColor }
//     } else {
//         other = { ...other, interiorColor: 'All' }
//     }
//     if (auto) {
//         filter = { ...filter, autopilot: auto }
//     } else {
//         other = { ...other, autopilot: 'All' }
//     }
//     let listings = await Listing.find({ ...filter }).sort({});
//     if (sort === 'Price') {
//         if (order === 'Ascending') {
//             listings.sort(function (a, b) {
//                 return parseFloat(a.price) - parseFloat(b.price);
//             });
//         } else if (order === 'Descending') {
//             listings.sort(function (a, b) {
//                 return parseFloat(b.price) - parseFloat(a.price);
//             });
//         }
//     } else if (sort === 'Mileage') {
//         if (order === 'Ascending') {
//             listings.sort(function (a, b) {
//                 return parseFloat(a.mileage) - parseFloat(b.mileage);
//             })
//         } else if (order === 'Descending') {
//             listings.sort(function (a, b) {
//                 return parseFloat(b.mileage) - parseFloat(a.mileage);
//             })
//         }
//     } else {
//         listings.sort(function (a, b) {
//             return parseFloat(a.price) - parseFloat(b.price);
//         })
//     }
// res.render('listings/index', { listings, ...filter, ...other, sort, order });

//     // if (model && year && auto){
//     //     const listings = await Listing.find({model,year, autopilot: auto }).sort({price: 'asc'});;
//     //     res.render('listings/index', { listings, model, year, auto, sort: 'Price', order:'asc' });
//     // } else if (model && year) {
//     //     const listings = await Listing.find({model,year}).sort({price: 'asc'});
//     //     res.render('listings/index', { listings, model, year, auto:'All', sort: 'Price', order:'asc' });
//     // } else if (model && auto) {
//     //     const listings = await Listing.find({model,autopilot: auto}).sort({price: 'asc'});
//     //     res.render('listings/index', { listings, model, year:'All', auto, sort: 'Price', order:'asc' });
//     // } else if (year && auto) {
//     //     const listings = await Listing.find({year,autopilot: auto}).sort({price: 'asc'});
//     //     res.render('listings/index', { listings, model: 'All', year, auto, sort: 'Price', order:'asc' });
//     // } else if (model) {
//     //     const listings = await Listing.find({model}).sort({price: 'asc'});
//     //     res.render('listings/index', { listings, model, year:'All', auto:'All', sort: 'Price', order:'asc' });
//     // } else if (year) {
//     //     const listings = await Listing.find({year}).sort({price: 'asc'});
//     //     res.render('listings/index', { listings, model: 'All', year, auto:'All', sort: 'Price', order:'asc' });
//     // } else if (auto) {
//     //     const listings = await Listing.find({autopilot: auto}).sort({price: 'asc'});
//     //     res.render('listings/index', { listings, model: 'All', year:'All', auto, sort: 'Price', order:'asc' });
//     // } else {
//     // let listings = await Listing.find({})
//     // .sort({price:'asc'});
//     // res.render('listings/index', { listings, model:'All', year: 'All', auto:'All', sort: 'Price', order:'asc' });
//     // }
// }

// module.exports.renderNewForm = (req, res) => {
//     res.render('listings/new');
// }

// module.exports.createListing = async (req, res) => {
//     const geodata = await geocoder.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1
//     }).send()
//     const newListing = new Listing(req.body.listing);
//     newListing.images = req.files.map(img => ({ filename: img.filename, url: img.path }))
//     newListing.author = req.user._id;
//     newListing.geometry = geodata.body.features[0].geometry;
//     await newListing.save();
//     req.flash('success', 'Successfully created listing')
//     res.redirect(`/listings/${newListing._id}`)
// }

// module.exports.showListing = async (req, res) => {
//     const listing = await Listing.findById(req.params.id).populate({
//         path: 'images',
//         path: 'comments',
//         populate: {
//             path: 'author'
//         }
//     }).populate('author');
//     if (!listing) {
//         req.flash('error', 'Could not find listing')
//         return res.redirect('/listings')
//     }
//     res.render('listings/show', { listing })
// }

// module.exports.renderEditForm = async (req, res) => {
//     const year = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
//     const model = ['Model S', 'Model 3', 'Model X', 'Model Y'];
//     const exteriorColor = ['Black', 'White', 'Gray', 'Blue', 'Red'];
//     const interiorColor = ['Black', 'White', 'Cream'];
//     const autopilot = ['None', 'Autopilot', 'Enhanced Autopilot', 'Full Self-Driving'];
//     const condition = ['Excellent', 'Good', 'Fair'];
//     const title = ["Clean", "Salvage", "Rebuilt"];
//     const listing = await Listing.findById(req.params.id).populate('images');
//     res.render('listings/edit', { year, listing, model, exteriorColor, interiorColor, autopilot, condition, title });
// }

// module.exports.editListing = async (req, res) => {
//     const geodata = await geocoder.forwardGeocode({
//         query: req.body.listing.location,
//         limit: 1
//     }).send()
//     const { id } = req.params;
//     const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     const imgs = req.files.map(f => ({ filename: f.filename, url: f.path }));
//     listing.images.push(...imgs);
//     listing.geometry = geodata.body.features[0].geometry;
//     await listing.save();
//     if (req.body.deleteImages) {
//         for (let filename of req.body.deleteImages) {
//             await cloudinary.uploader.destroy(filename)
//             await listing.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//         }
//     }
//     req.flash('success', 'Successfully updated listing')
//     res.redirect(`/listings/${id}`);
// }

// module.exports.delete = async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     req.flash('success', 'Successfully deleted listing')
//     res.redirect('/listings')
// }