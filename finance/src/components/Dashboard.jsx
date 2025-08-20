import SummaryCards from "./SummaryCards";
import RecentHistorySide from "./RecentHistorySide";
import TransactionsChart from "./TransactionsChart";
import { useState } from "react";

export default function Dashboard({ transactions, addTransaction }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "income", amount: "", label: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate totals—these use backend data passed in
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((s, t) => s + (t.amount || 0), 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + (t.amount || 0), 0);

  const balance = income - expenses;

  // Submit transaction via the prop, using backend
  function handleSubmit() {
    if (!form.amount || !form.label) {
      setError("Please fill all fields.");
      return;
    }
    setLoading(true);
    setError("");
    addTransaction(
      {
        type: form.type,
        amount: Number(form.amount),
        label: form.label,
        category: "General", // optional, if backend uses
        date: new Date().toISOString(),
        note: ""
      }
    );
    setShowModal(false);
    setForm({ type: "income", amount: "", label: "" });
    setLoading(false);
  }

  return (
    <div className="dashboard-content">
      {error && <div className="error">{error}</div>}
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
            {error && <div className="error">{error}</div>}
            <button className="add-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}