// routes/home.js
const express = require('express')
const router = express.Router()
const baseController = require('../controllers/baseController')

router.get('/', baseController.buildHome)

router.get('/custom', (req, res) => {
  res.render('inventory/detail', {
    title: 'Custom Car',
    vehicle: {
      inv_make: 'Batmobile',
      inv_model: 'Batmobile',
      inv_year: 2022,
      inv_price: 3250000,
      inv_description: 'Ultimate custom hypercar.',
      inv_color: 'Black',
      inv_miles: 420,
      inv_image: '/images/vehicles/batmobile-tn.jpg'
    }
  })
})

router.get('/sedan', (req, res) => {
  res.render('inventory/detail', {
    title: 'Sedan Car',
    vehicle: {
      inv_make: 'Crown',
      inv_model: 'Crwn-Vic',
      inv_year: 2023,
      inv_price: 28000,
      inv_description: 'A reliable modern sedan.',
      inv_color: 'White',
      inv_miles: 5000,
      inv_image: '/images/vehicles/crwn-vic.jpg'
    }
  })
})

router.get('/sport', (req, res) => {
  res.render('inventory/detail', {
    title: 'Sport Car',
    vehicle: {
      inv_make: 'Lamboghini',
      inv_model: '911 Turbo',
      inv_year: 2024,
      inv_price: 198000,
      inv_description: 'High-performance sports car.',
      inv_color: 'White',
      inv_miles: 800,
      inv_image: '/images/vehicles/adventador.jpg'
    }
  })
})

router.get('/suv', (req, res) => {
  res.render('inventory/detail', {
    title: 'SUV',
    vehicle: {
      inv_make: 'Jeep',
      inv_model: 'Wrangler',
      inv_year: 2023,
      inv_price: 42000,
      inv_description: 'Adventure-ready SUV.',
      inv_color: 'Yellow',
      inv_miles: 3000,
      inv_image: '/images/vehicles/wrangler.jpg'
    }
  })
})

router.get('/truck', (req, res) => {
  res.render('inventory/detail', {
    title: 'Truck',
    vehicle: {
      inv_make: 'Ford',
      inv_model: 'F-150',
      inv_year: 2022,
      inv_price: 49000,
      inv_description: 'Tough and powerful truck.',
      inv_color: 'Blue',
      inv_miles: 10000,
      inv_image: '/images/vehicles/monster-truck.jpg'
    }
  })
})

module.exports = router
