const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Address = require('../models/Address');

router.get('/addresses', (req, res, next) => {
  console.log('calling /addresses route <==')
  Address.find()
    .then(addressesFromDb => {
      res.json({ addresses: addressesFromDb, success: true })
    }).catch(error => res.json(error))
})

router.put('/remove/:addressId', (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { $pull: { address: req.params.addressId } }, { new: true })
    .then(() => {
      Address.findByIdAndDelete(req.params.addressId)
        .then(() => {
          res.json({ message: 'Adress removed successfully', success: true })
        }).catch(error => res.json(error))
    }).catch(error => res.json(error))
})

router.post('/:userId', (req, res, next) => {
  Address.create(req.body)
    .then(addressFromDb => {
      User.findByIdAndUpdate(req.params.userId, { $push: { address: addressFromDb._id } }, { new: true })
        .then(updatedUser => {
          res.json({ user: updatedUser, address: addressFromDb, success: true })
        }).catch(error => res.json(error))
    }).catch(error => res.json(error))
})

router.get('/:addressId', (req, res, next) => {
  console.log('addressId is required for this route')
  Address.findById(req.params.addressId)
    .then(addressFromDb => {
      res.json({ address: addressFromDb, success: true });
    }).catch(error => res.json(error))
})

router.put('/:addressId', (req, res, next) => {
  Address.findByIdAndUpdate(req.params.addressId, req.body, { new: true })
    .then(updatedAddress => {
      res.json({ address: updatedAddress, success: true })
    }).catch(error => res.json(error))
})

router.delete('/:addressId', (req, res, next) => {
  Address.findByIdAndDelete(req.params.addressId)
    .then(() => {
      User.find({ adress: { $elemMatch: { $eq: req.params.addressId } } })
        .then(usersFromDb => {

          usersFromDb.forEach(user => {
            user.address.pull(req.params.addressId)
            user.save()
          })

          Promise.all(usersFromDb)
            .then(() => {
              res.json({ message: 'Address deleted successfully', success: true })
            }).catch(error => res.json(error))
        }).catch(error => res.json(error))
    }).catch(error => res.json(error))
})


module.exports = router;
