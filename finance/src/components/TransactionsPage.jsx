export default function TransactionsPage({ transactions = [] }) {
  if (transactions.length === 0) {
    return <div className="empty-page">No transactions yet.</div>;
  }
  return (
    <div className="transactions-page">
      <h3>All Transactions</h3>
      <table className="tx-table">
        <thead>
          <tr>
            <th>Date/Label</th>
            <th>Type</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td>{t.label}</td>
              <td className={t.type}>{t.type}</td>
              <td>
                {t.type === "income" ? "+" : "-"}₹{t.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}