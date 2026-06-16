const Transaction = require('../models/Transaction');

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { type, title, amount, category, note, date } = req.body;

    if (!type || !title || !amount || !category) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      title,
      amount,
      category,
      note,
      date: date || new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all user transactions (with search, filter, pagination, sort)
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = { userId: req.user.id };

    // Title Search
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Type Filter
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Date Range Filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const transactions = await Transaction.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { type, title, amount, category, note, date } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns the transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Update
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { type, title, amount, category, note, date },
      { new: true, runValidators: true }
    );

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns the transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();

    res.json({ id: req.params.id, message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics & analytics data
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Overall Summary (Total Income, Total Expense, Balance)
    const summaryStats = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    summaryStats.forEach((stat) => {
      if (stat._id === 'income') {
        totalIncome = stat.total;
      } else if (stat._id === 'expense') {
        totalExpense = stat.total;
      }
    });

    const balance = totalIncome - totalExpense;

    // 2. Category Breakdown (mostly for Pie charts - expenses)
    const categoryStats = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
      { $sort: { value: -1 } }
    ]);

    // Income category breakdown (for optional pie chart)
    const incomeCategoryStats = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1,
        },
      },
      { $sort: { value: -1 } }
    ]);

    // 3. Monthly Breakdown for Bar/Line Chart (last 6 months)
    // We group by year and month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly data for easy recharts consumption: { month: "Jan 2026", income: X, expense: Y }
    const monthsMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Pre-populate last 6 months so charts don't look empty and maintain correct sequence
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const key = `${year}-${monthIdx + 1}`;
      monthsMap[key] = {
        month: `${monthNames[monthIdx]} ${year}`,
        income: 0,
        expense: 0,
      };
    }

    monthlyStats.forEach((stat) => {
      const key = `${stat._id.year}-${stat._id.month}`;
      // If we don't have it in map (e.g. outside 6 month prepopulation somehow), create it
      if (!monthsMap[key]) {
        monthsMap[key] = {
          month: `${monthNames[stat._id.month - 1]} ${stat._id.year}`,
          income: 0,
          expense: 0,
        };
      }
      if (stat._id.type === 'income') {
        monthsMap[key].income = stat.total;
      } else if (stat._id.type === 'expense') {
        monthsMap[key].expense = stat.total;
      }
    });

    const monthlyBreakdown = Object.values(monthsMap);

    res.json({
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
      categoryBreakdown: categoryStats,
      incomeCategoryBreakdown: incomeCategoryStats,
      monthlyBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
};
