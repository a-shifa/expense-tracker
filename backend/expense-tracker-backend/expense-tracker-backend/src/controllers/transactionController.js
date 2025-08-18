import { validationResult } from "express-validator";
import { Transaction } from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTransaction = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { amount, type, category, date, note } = req.body;
  const tx = await Transaction.create({
    user: req.user.id,
    amount,
    type,
    category,
    date: date ? new Date(date) : new Date(),
    note
  });
  res.status(201).json(tx);
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { from, to, type, category, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user.id };
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1, _id: -1 }).skip(skip).limit(Number(limit)),
    Transaction.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const tx = await Transaction.findOneAndUpdate(
    { _id: id, user: req.user.id },
    body,
    { new: true, runValidators: true }
  );
  if (!tx) return res.status(404).json({ message: "Transaction not found" });
  res.json(tx);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tx = await Transaction.findOneAndDelete({ _id: id, user: req.user.id });
  if (!tx) return res.status(404).json({ message: "Transaction not found" });
  res.json({ message: "Deleted", id });
});

// Basic stats: totals by type (+ net) and optional monthly breakdown
export const getStats = asyncHandler(async (req, res) => {
  const { year } = req.query; // optional numeric year for monthly breakdown
  const match = { user: req.user.id };

  const base = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } }
  ]);
  const summary = base.reduce((acc, cur) => {
    acc[cur._id] = { total: cur.total, count: cur.count };
    return acc;
  }, {});
  const income = summary.income?.total || 0;
  const expense = summary.expense?.total || 0;
  const net = income - expense;

  let monthly = [];
  if (year) {
    const y = Number(year);
    monthly = await Transaction.aggregate([
      { $match: { ...match, date: {
        $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1)
      } } },
      { $group: {
        _id: { m: { $month: "$date" }, type: "$type" },
        total: { $sum: "$amount" }
      } },
      { $group: {
        _id: "$_id.m",
        byType: { $push: { type: "$_id.type", total: "$total" } }
      } },
      { $project: {
        _id: 0,
        month: "$_id",
        income: { $ifNull: [ { $first: { $filter: { input: "$byType", as: "t", cond: { $eq: ["$$t.type", "income"] } } } }.total, 0 ] },
        expense: { $ifNull: [ { $first: { $filter: { input: "$byType", as: "t", cond: { $eq: ["$$t.type", "expense"] } } } }.total, 0 ] }
      } },
      { $sort: { month: 1 } }
    ]);
  }

  res.json({ totals: { income, expense, net }, monthly });
});
