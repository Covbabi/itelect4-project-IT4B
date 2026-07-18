import { useState, ChangeEvent, FormEvent } from "react";
import type { Claim, Item, User } from "./types/index";
import "./App.css";

interface FormStateUser {
  name: string;
  email: string;
}

interface FormStateItem {
  title: string;
  location: string;
  status: "lost" | "found";
  reportedBy: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<(Claim & { status: "pending" | "verified" })[]>([]);

  const [userForm, setUserForm] = useState<FormStateUser>({ name: "", email: "" });
  const [itemForm, setItemForm] = useState<FormStateItem>({ title: "", location: "", status: "lost", reportedBy: "" });

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUser: User = {
      id: Date.now(),
      name: userForm.name,
      email: userForm.email,
      role: "student",
      isActive: true,
    };
    setUsers((current) => [newUser, ...current]);
    setUserForm({ name: "", email: "" });
  };

  const handleItemChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setItemForm((current) => ({ ...current, [name]: value }));
  };

  const handleItemSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newItem: Item = {
      id: Date.now(),
      title: itemForm.title,
      description: `${itemForm.status} item`,
      location: itemForm.location,
      reportedBy: Number(itemForm.reportedBy),
      status: itemForm.status,
    };
    setItems((current) => [newItem, ...current]);
    setItemForm({ title: "", location: "", status: "lost", reportedBy: "" });
  };

  const handleClaimSubmit = (itemId: number, userId: number) => {
    const newClaim: Claim & { status: "pending" | "verified" } = {
      id: Date.now(),
      itemId,
      claimedBy: userId,
      verifiedBy: undefined,
      submittedAt: new Date(),
      status: "pending",
    };
    setClaims((current) => [newClaim, ...current]);
  };

  const verifyClaim = (claimId: number) => {
    setClaims((current) =>
      current.map((claim) =>
        claim.id === claimId ? { ...claim, status: "verified", verifiedBy: Date.now() } : claim
      )
    );
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">🏫</div>
          <div>
            <h1 className="app-title">Campus Lost & Found</h1>
            
          </div>
        </div>
      </header>

      <div className="grid grid-wide">
        <div>
          {/* USERS SECTION */}
          <section className="form-panel">
            <h2>Users</h2>
            <form className="claim-form" onSubmit={handleUserSubmit}>
              <fieldset>
                <legend>Add a student</legend>
                <label>
                  Name
                  <input name="name" value={userForm.name} onChange={handleUserChange} required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={userForm.email} onChange={handleUserChange} required />
                </label>
              </fieldset>
              <button type="submit" className="primary-btn">Add student</button>
            </form>

            <div className="users-list">
              <h3>Students ({users.length})</h3>
              {users.length === 0 ? (
                <p>No students added yet.</p>
              ) : (
                <ul>
                  {users.map((user) => (
                    <li key={user.id}>
                      <div>
                        <strong>{user.name}</strong>
                        <div className="meta">{user.email}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* ITEMS SECTION */}
          <section className="form-panel" style={{ marginTop: 18 }}>
            <h2>Items (Lost/Found Posts)</h2>
            <form className="claim-form" onSubmit={handleItemSubmit}>
              <fieldset>
                <legend>Report a lost or found item</legend>
                <label>
                  Title
                  <input name="title" value={itemForm.title} onChange={handleItemChange} required />
                </label>
                <label>
                  Location
                  <input name="location" value={itemForm.location} onChange={handleItemChange} required />
                </label>
                <label>
                  Status
                  <select name="status" value={itemForm.status} onChange={handleItemChange}>
                    <option value="lost">lost</option>
                    <option value="found">found</option>
                  </select>
                </label>
                <label>
                  Reported By
                  <select name="reportedBy" value={itemForm.reportedBy} onChange={handleItemChange} required>
                    <option value="">Select student</option>
                    {users.map((u) => (
                      <option key={u.id} value={String(u.id)}>{u.name}</option>
                    ))}
                  </select>
                </label>
              </fieldset>
              <button type="submit" className="primary-btn">Report item</button>
            </form>

            <div className="items-list">
              <h3>Items ({items.length})</h3>
              {items.length === 0 ? (
                <p>No items reported yet.</p>
              ) : (
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.title}</strong>
                        <div className="meta">{item.location} · reported by {users.find(u => u.id === item.reportedBy)?.name ?? String(item.reportedBy)}</div>
                      </div>
                      <div>
                        <span className={`status-badge ${item.status}`}>{item.status}</span>
                        {users.length > 0 && (
                          <button className="claim-button" onClick={() => handleClaimSubmit(item.id, users[0].id)}>Claim</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <aside>
          {/* CLAIMS SECTION */}
          <section className="claim-list">
            <h2>Claims (Pending Verification)</h2>
            {claims.length === 0 ? (
              <p>No claims yet.</p>
            ) : (
              <ul>
                {claims.map((claim) => (
                  <li key={claim.id}>
                    <div>
                      <strong>Claim #{claim.id}</strong>
                      <div className="meta">Item {claim.itemId} · by User {claim.claimedBy}</div>
                    </div>
                    <div>
                      <span className={`status-badge ${claim.status}`}>{claim.status}</span>
                      {claim.status === "pending" && (
                        <button className="verify-button" onClick={() => verifyClaim(claim.id)}>Verify</button>
                      )}
                      {claim.status === "verified" && <span className="verified-text">✓ Verified</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

export default App;
