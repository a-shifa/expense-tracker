import SummaryCards from "./SummaryCards";
import RecentHistorySide from "./RecentHistorySide";
import TransactionsChart from "./TransactionsChart";
import { useState } from "react";

export default function Dashboard({ transactions = [], addTransaction }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "income", amount: "", label: "" });

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + (t.amount || 0), 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + (t.amount || 0), 0);

  const balance = income - expenses;

  function submit() {
    if (!form.amount || !form.label) return;
    addTransaction({ ...form, amount: Number(form.amount) });
    setShowModal(false);
    setForm({ type: "income", amount: "", label: "" });
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-maincol">
        <div className="dashboard-top">
          <div className="chart-box">
            <h2>All Transactions</h2>
            <TransactionsChart transactions={transactions} />
          </div>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Income/Expense
          </button>
        </div>
        <SummaryCards
          income={income}
          expenses={expenses}
          balance={balance}
        />
      </div>
      <RecentHistorySide transactions={transactions} />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Transaction</h3>
            <label>
              Type:
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label>
              Amount:
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              />
            </label>
            <button className="add-btn" onClick={submit}>Add</button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}