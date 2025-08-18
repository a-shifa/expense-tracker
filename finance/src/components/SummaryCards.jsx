export default function SummaryCards({ income, expenses, balance }) {
  function formatRupees(val) {
    return` ₹${val.toLocaleString('en-IN')}`;
  }

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="sc-title">Total Income</div>
        <div className="sc-value income">{formatRupees(income)}</div>
      </div>
      <div className="summary-card">
        <div className="sc-title">Total Expenses</div>
        <div className="sc-value expense">{formatRupees(expenses)}</div>
      </div>
      <div className="summary-card total-balance-card">
        <div className="sc-title">Total Balance</div>
        <div className="sc-value balance">{formatRupees(balance)}</div>
      </div>
    </div>
  );
}