export default function SystemsPage({ user }) {
  return (
    <div className="systems-info" style={{textAlign:"center"}}>
      <h3>System Information</h3>
      <ul style={{listStyle:"none",padding:0,textAlign:"left",maxWidth:"320px",margin:"30px auto"}}>
        <li><strong>User name:</strong> {user?.name}</li>
        <li><strong>Email:</strong> {user?.email}</li>
        <li><strong>Account Created:</strong> {user?.createdAt?.slice(0,10) || "unknown"}</li>
        <li><strong>Browser:</strong> {window.navigator.userAgent}</li>
        <li><strong>OS:</strong> {window.navigator.platform}</li>
      </ul>
      <div style={{marginTop:"22px"}}>
        <div>Expense Tracker secures your data just for you.</div>
        <div style={{marginTop:"12px",color:"#594100"}}>Transactions are private and visible only to you.</div>
        <div style={{marginTop:"12px",fontWeight:"700",color:"#b9691a"}}>Happy money management!</div>
      </div>
    </div>
  );
}