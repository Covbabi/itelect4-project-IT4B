import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import type { Claim, Item, User } from "./types/index";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";
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

// Initial Mock Data (Simulated Fetch)
const mockUsers: User[] = [
  { id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: "student", isActive: true },
  { id: 2, name: "Maria Clara", email: "maria@example.com", role: "student", isActive: true },
];

const mockItems: Item[] = [
  { id: 101, title: "Blue Hydro Flask", description: "found item", location: "Library 2nd Floor", reportedBy: 1, status: "found" },
  { id: 102, title: "Black Wallet", description: "lost item", location: "Gymnasium", reportedBy: 2, status: "lost" },
];

function App() {
  // ===== 1. TYPED STATE WITH useState<T> =====
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<(Claim & { status: "pending" | "verified"; itemTitle: string })[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Form States
  const [userForm, setUserForm] = useState<FormStateUser>({ name: "", email: "" });
  const [itemForm, setItemForm] = useState<FormStateItem>({ title: "", location: "", status: "lost", reportedBy: "" });

  // ===== 2. CUSTOM HOOKS =====
  const [showForms, toggleForms] = useToggle(true);
  const previousSearch = usePrevious(searchTerm);

  // ===== 3. TYPED DOM REFERENCE WITH useRef =====
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = (): void => {
    searchInputRef.current?.focus();
  };

  // ===== 4. LOADING MOCK DATA WITH useEffect ON MOUNT =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setItems(mockItems);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // ===== 5. TYPED DOM EVENT HANDLERS =====
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const handleUserSubmit = (event: FormEvent<HTMLFormElement>): void => {
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

  const handleItemChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setItemForm((current) => ({ ...current, [name]: value }));
  };

  const handleItemSubmit = (event: FormEvent<HTMLFormElement>): void => {
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

  const handleClaimSubmit = (itemId: number, userId: number): void => {
    const claimedItem = items.find((item) => item.id === itemId);
    const newClaim: Claim & { status: "pending" | "verified"; itemTitle: string } = {
      id: Date.now(),
      itemId,
      claimedBy: userId,
      verifiedBy: undefined,
      submittedAt: new Date(),
      status: "pending",
      itemTitle: claimedItem?.title ?? `Item #${itemId}`,
    };

    setClaims((current) => [newClaim, ...current]);
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const verifyClaim = (claimId: number): void => {
    setClaims((current) =>
      current.map((claim) =>
        claim.id === claimId ? { ...claim, status: "verified", verifiedBy: Date.now() } : claim
      )
    );
  };

  // Derived Filtered List computed during render
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lostItems = items.filter((item) => item.status === "lost");
  const foundItems = items.filter((item) => item.status === "found");
  const claimedItems = claims.map((claim) => claim);

  // Early return while loading
  if (isLoading) {
    return (
      <main className="app-shell">
        <p>Loading Campus Lost & Found data...</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">🏫</div>
          <div>
            <h1 className="app-title">Campus Lost & Found</h1>
            {selectedUser && <p className="meta">Active Student: <strong>{selectedUser.name}</strong></p>}
          </div>
        </div>
      </header>

      {/* SEARCH AND CONTROL BAR */}
      <div style={{ margin: "16px 0", display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search items by title or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="button" onClick={focusSearchInput} className="primary-btn">
          Focus Search
        </button>
        <button type="button" onClick={toggleForms} className="primary-btn">
          {showForms ? "Hide Forms" : "Show Forms"}
        </button>
      </div>

      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="meta" style={{ marginBottom: "12px" }}>
          Previous search term: "{previousSearch}"
        </p>
      )}

      <section className="status-panel">
        <h2>Status Overview</h2>
        <div className="status-summary-grid">
          <article className="status-card lost">
            <h3>Lost</h3>
            <p>{lostItems.length} item{lostItems.length === 1 ? "" : "s"}</p>
            <ul>
              {lostItems.length === 0 ? (
                <li>No lost items</li>
              ) : (
                lostItems.map((item) => <li key={item.id}>{item.title}</li>)
              )}
            </ul>
          </article>

          <article className="status-card found">
            <h3>Found</h3>
            <p>{foundItems.length} item{foundItems.length === 1 ? "" : "s"}</p>
            <ul>
              {foundItems.length === 0 ? (
                <li>No found items</li>
              ) : (
                foundItems.map((item) => <li key={item.id}>{item.title}</li>)
              )}
            </ul>
          </article>

          <article className="status-card claimed">
            <h3>Claimed</h3>
            <p>{claimedItems.length} claim{claimedItems.length === 1 ? "" : "s"}</p>
            <ul>
              {claimedItems.length === 0 ? (
                <li>No claims yet</li>
              ) : (
                claimedItems.map((claim) => (
                  <li key={claim.id}>{claim.itemTitle} ({claim.status})</li>
                ))
              )}
            </ul>
          </article>
        </div>
      </section>

      <div className="grid grid-wide">
        <div>
          {/* USERS SECTION */}
          <section className="form-panel">
            <h2>Users</h2>
            {showForms && (
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
            )}

            <div className="users-list">
              <h3>Students ({users.length})</h3>
              {users.length === 0 ? (
                <p>No students available.</p>
              ) : (
                <ul>
                  {users.map((user) => (
                    <li 
                      key={user.id} 
                      onClick={() => setSelectedUser(user)}
                      style={{ cursor: "pointer", background: selectedUser?.id === user.id ? "#e0f2fe" : undefined }}
                    >
                      <div>
                        <strong>{user.name}</strong>
                        <div className="meta">{user.email}</div>
                      </div>
                      {selectedUser?.id === user.id && <span>(Selected)</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* ITEMS SECTION */}
          <section className="form-panel" style={{ marginTop: 18 }}>
            <h2>Items (Lost/Found Posts)</h2>
            {showForms && (
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
            )}

            <div className="items-list">
              <h3>Items ({filteredItems.length})</h3>
              {filteredItems.length === 0 ? (
                <p>No items found.</p>
              ) : (
                <ul>
                  {filteredItems.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.title}</strong>
                        <div className="meta">
                          {item.location} · reported by {users.find((u) => u.id === item.reportedBy)?.name ?? String(item.reportedBy)}
                        </div>
                      </div>
                      <div>
                        <span className={`status-badge ${item.status}`}>{item.status}</span>
                        {users.length > 0 && (
                          <button 
                            className="claim-button" 
                            onClick={() => handleClaimSubmit(item.id, selectedUser ? selectedUser.id : users[0].id)}
                          >
                            Claim
                          </button>
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
                      <div className="meta">Item #{claim.itemId} · by User #{claim.claimedBy}</div>
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