const express = require('express');
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.get('/stats', getTransactionStats);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
