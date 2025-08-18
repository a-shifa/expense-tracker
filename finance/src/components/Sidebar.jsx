export default function Sidebar({
  avatar,
  username,
  setPage,
  currentPage,
  onSignOut
}) {
  const navItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "View Transactions", key: "transactions" },
    { name: "Notifications", key: "notifications" },
    { name: "Systems", key: "systems" }
  ];

  return (
    <div className="sidebar">
      <div className="user">
        <img src={avatar} alt="User" className="avatar" />
        <div>
          <div className="username">{username}</div>
          <div className="subtext">Your Money</div>
        </div>
      </div>
      <nav>
        <ul>
          {navItems.map(nav => (
            <li
              key={nav.key}
              className={currentPage === nav.key ? "active" : ""}
              onClick={() => setPage(nav.key)}
            >
              {nav.name}
            </li>
          ))}
        </ul>
      </nav>
      <button className="signout" onClick={onSignOut}>
        Sign Out
      </button>
    </div>
  );
}