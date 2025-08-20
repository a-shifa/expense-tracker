import { useState, useEffect } from "react";
import TransactionsPage from "./components/TransactionsPage";
import NotificationsPage from "./components/NotificationsPage";
import SystemsPage from "./components/SystemsPage";
import Sidebar from "./components/Sidebar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL;

function getAvatar(name = "guest") {
  return `https://avatars.dicebear.com/api/adventurer/${encodeURIComponent(name)}.svg`;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [showThankYou, setShowThankYou] = useState(false);
  const [mode, setMode] = useState("signin");
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Load user info from backend if JWT token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token} `}
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser(data); });
    }
  }, []);

  // Load transactions from backend after login
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/api/transactions`, {
        headers: { Authorization:` Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : { items: [] })
        .then(data => setTransactions(data.items || []));
    } else {
      setTransactions([]);
    }
  }, [user]);

  function handleSignIn(u, token) {
    setUser(u);
    localStorage.setItem("token", token);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
    setPage("dashboard");
    setMode("app");
  }

  function handleSignUp(u, token) {
    setUser(u);
    localStorage.setItem("token", token);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
    setPage("dashboard");
    setMode("app");
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    setUser(null);
    setTransactions([]);
    setMode("signin");
  }

  async function addTransaction(txn) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(txn)
      });
      const newTxn = await response.json();
      if (response.ok) {
        setTransactions(list => [newTxn, ...list]);
        handleAddNotification("Transaction added!");
      } else {
        handleAddNotification(newTxn.message || "Could not add transaction");
      }
    } catch {
      handleAddNotification("Server error while adding transaction");
    }
  }

  function handleAddNotification(msg) {
    setNotifications(n => [{ message: msg, id: Date.now() }, ...n.slice(0, 9)]);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  if (!user && mode === "signin") {
    return (
      <div className="fade-in">
        <SignIn onSignIn={handleSignIn} toSignUp={() => setMode("signup")} />
      </div>
    );
  }

  if (!user && mode === "signup") {
    return (
      <div className="fade-in">
        <SignUp onSignUp={handleSignUp} toSignIn={() => setMode("signin")} />
      </div>
    );
  }

  return (
    <div className="main-app">
      <Sidebar
        avatar={getAvatar(user?.name || "guest")}
        username={user?.name || ""}
        setPage={setPage}
        currentPage={page}
        onSignOut={handleSignOut}
      />
      <div className="page-area">
        {showThankYou && (
          <div className="thank-you-popup">
            Thank you for logging in, {user?.name || ""}!
          </div>
        )}
        {showNotification && notifications.length > 0 && (
          <div className="noti-popup">{notifications[0].message}</div>
        )}
        {page === "dashboard" && (
          <Dashboard
            transactions={transactions}
            addTransaction={addTransaction}
          />
        )}
        {page === "transactions" && (
          <TransactionsPage transactions={transactions} />
        )}
        {page === "notifications" && (
          <NotificationsPage notifications={notifications} />
        )}
        {page === "systems" && <SystemsPage user={user} />}
      </div>
    </div>
  );
}