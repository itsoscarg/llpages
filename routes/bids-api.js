const express   = require('express');
const mongoose  = require('mongoose');

const Bid       = require('../models/bids');

const router    = express.Router();
const app       = express();

app.get('/', (req, res, next) => {
  // send views/index.ejs for displaying in the browser
  res.render('index');
});

  // GET http://localhost:3000/api/bids
router.get('/bids', (req, res, next) => {
  Bid.find((err, bidsList) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(bidsList);
  });
});

  // POST http://localhost:3000/api/bids
router.post('/bids', (req, res, next) => {
  const theBid = new Bid({
    name: req.body.brand,
    brand: req.body.name
    // specs: req.body.specs,
    // image: req.body.image
  });

  theBid.save((err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'new bid created!',
      id: theBid._id
    });
  });
});

router.get('/bids/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  Phone.findById(req.params.id, (err, theBid) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json(theBid);
  });
});

router.put('/bids/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    name: req.body.brand,
    brand: req.body.name
    // specs: req.body.specs,
    // image: req.body.image
  };

  Phone.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Bid updated successfully'
    });
  });
});

router.delete('/bids/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400)
       .json({ message: 'Specified id is not valid' });
    return;
  }

  Phone.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Bid has been removed!'
    });
  });
});


module.exports = router;
