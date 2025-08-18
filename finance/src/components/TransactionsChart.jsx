import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TransactionsChart({ transactions }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data = months.map(m => ({
    name: m,
    income: transactions
      .filter(t => t.type === "income" && t.label.toLowerCase().includes(m.toLowerCase()))
      .reduce((sum, t) => sum + t.amount, 0),
    expense: transactions
      .filter(t => t.type === "expense" && t.label.toLowerCase().includes(m.toLowerCase()))
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ece6f7"/>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={val =>` ₹${val}`} />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#a37539" strokeWidth={3} dot={{ r: 5 }} />
        <Line type="monotone" dataKey="expense" stroke="#bd3b2c" strokeWidth={3} dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}