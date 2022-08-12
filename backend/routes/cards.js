const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidator, idValidator } = require('../validators/celebrate');

router.post('/', createCardValidator, createCard);
router.get('/', getCards);
router.delete('/:id', idValidator, deleteCard);
router.put('/:id/likes', idValidator, likeCard);
router.delete('/:id/likes', idValidator, dislikeCard);

module.exports = router;
