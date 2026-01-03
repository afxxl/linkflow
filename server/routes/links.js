const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const {
    getLinks,
    getLink,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    toggleLink
} = require('../controllers/linkController');

// Validation rules
const linkValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must not exceed 100 characters'),
    body('url')
        .trim()
        .notEmpty()
        .withMessage('URL is required')
        .matches(/^https?:\/\/.+/)
        .withMessage('URL must start with http:// or https://')
];

// All routes are protected
router.use(auth);

// Routes
router.get('/', getLinks);
router.post('/', linkValidation, validate, createLink);
router.get('/:id', getLink);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);
router.patch('/reorder', reorderLinks);
router.patch('/:id/toggle', toggleLink);

module.exports = router;
