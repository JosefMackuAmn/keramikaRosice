// Library imports
const router = require('express').Router();

// Custom imports
const pagesController = require('../controllers/pages');

router.get('/', pagesController.getIndex);
router.get('/kontakt', pagesController.getContact);
router.get('/o-mne', pagesController.getAbout);

router.get('/podminky', pagesController.getConditions);
router.get('/ochrana-udaju', pagesController.getGDPR);

module.exports = router;