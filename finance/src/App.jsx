import { useState, useEffect } from "react";
import TransactionsPage from "./components/TransactionsPage";
import NotificationsPage from "./components/NotificationsPage";
import SystemsPage from "./components/SystemsPage";
import Sidebar from "./components/Sidebar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import "./index.css";

function getAvatar(name = "guest") {
  return` https://avatars.dicebear.com/api/adventurer/${encodeURIComponent(name)}.svg`;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [showThankYou, setShowThankYou] = useState(false);
  const [mode, setMode] = useState("signin");
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // When user logs in, load their transactions from localStorage
  useEffect(() => {
    if (user && user.email) {
      const saved = localStorage.getItem(`transactions_${user.email}`);
      setTransactions(saved ? JSON.parse(saved) : []);
    } else {
      setTransactions([]);
    }
  }, [user]);

  // When transactions change, save them in localStorage for the current user
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`transactions_${user.email}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8001/api/auth/me", {
        headers: { Authorization:` Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setUser(data); });
    }
  }, []);

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
    setTransactions([]); // clear UI when logging out
    setMode("signin");
  }

  function addTransaction(txn) {
    setTransactions(list => [txn, ...list]);
    handleAddNotification("Transaction added!");
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