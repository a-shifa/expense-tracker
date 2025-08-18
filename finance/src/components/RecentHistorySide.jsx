export default function RecentHistorySide({ transactions }) {
  const history = transactions.slice(-3).reverse();
  const salary = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <aside className="recent-side">
      <div className="rh-title">Recent History</div>
      <ul className="rh-list">
        {history.length === 0 && <li className="side-faded">No recent transactions.</li>}
        {history.map(({ label, amount, type }, idx) => (
          <li key={idx} className={type === "income" ? "positive" : "negative"}>
            <span>{label}</span>
            <span>{type === "income" ? "+" : "-"}₹{Math.abs(amount)}</span>
          </li>
        ))}
      </ul>
      <div className="side-card">
        <div>
          <div className="se-label">Salary</div>
          <div className="se-value">₹{salary.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div className="se-label">Expense</div>
          <div className="se-value">₹{expense.toLocaleString('en-IN')}</div>
        </div>
      </div>
    </aside>
  );
}