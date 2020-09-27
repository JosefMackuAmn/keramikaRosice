// Library imports
const router = require('express').Router();

// Custom imports
const pagesController = require('../controllers/pages');

router.get('/', pagesController.getIndex);
router.get('/kontakt', pagesController.getContact);
router.get('/o-mne', pagesController.getAbout);

module.exports = router;