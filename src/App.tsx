import { useState, useEffect, useRef, ChangeEvent, FormEvent, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import type { Claim, Item, User } from "./types/index";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";
import UserCard from "./components/UserCard";
import ItemCard from "./components/CourseCard"; 
import SubmissionBadge from "./components/SubmissionBadge";
import useAuthStore from "./store/authStore";

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

const mockUsers: User[] = [
  { id: 1, name: "Juan dela Cruz", email: "juan@example.com", role: "student", isActive: true },
  { id: 2, name: "Maria Clara", email: "maria@example.com", role: "student", isActive: true },
];

const mockItems: Item[] = [
  { id: 101, title: "Blue Hydro Flask", description: "Found blue insulated bottle", location: "Library 2nd Floor", reportedBy: 1, status: "found" },
  { id: 102, title: "Black Wallet", description: "Leather wallet with IDs", location: "Gymnasium", reportedBy: 2, status: "lost" },
];

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<(Claim & { status: "pending" | "verified"; itemTitle: string })[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [userForm, setUserForm] = useState<FormStateUser>({ name: "", email: "" });
  const [itemForm, setItemForm] = useState<FormStateItem>({ title: "", location: "", status: "lost", reportedBy: "" });

  const [showForms, toggleForms] = useToggle(true);
  const previousSearch = usePrevious(searchTerm);
  const navigate = useNavigate();
  const userEmail = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const focusSearchInput = (): void => {
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setItems(mockItems);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Event Handlers
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const handleUserChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const handleUserSubmit = useCallback((event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    const newUser: User = {
      id: Date.now(),
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      role: "student",
      isActive: true,
    };

    setUsers((current) => [newUser, ...current]);
    setUserForm({ name: "", email: "" });
  }, [userForm]);

  const handleItemChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setItemForm((current) => ({ ...current, [name]: value }));
  };

  const handleItemSubmit = useCallback((event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!itemForm.title.trim() || !itemForm.location.trim() || !itemForm.reportedBy) {
      return;
    }

    const newItem: Item = {
      id: Date.now(),
      title: itemForm.title.trim(),
      description: `${itemForm.status.toUpperCase()} item reported at ${itemForm.location.trim()}`,
      location: itemForm.location.trim(),
      reportedBy: Number(itemForm.reportedBy),
      status: itemForm.status,
    };

    setItems((current) => [newItem, ...current]);
    setItemForm({ title: "", location: "", status: "lost", reportedBy: "" });
  }, [itemForm]);

  const handleClaimSubmit = useCallback((itemId: number, userId?: number): void => {
    const activeUserId = userId ?? selectedUser?.id ?? users[0]?.id;
    if (!activeUserId) {
      alert("Please select or add a student to submit a claim.");
      return;
    }

    const claimedItem = items.find((item) => item.id === itemId);
    const newClaim: Claim & { status: "pending" | "verified"; itemTitle: string } = {
      id: Date.now(),
      itemId,
      claimedBy: activeUserId,
      verifiedBy: undefined,
      submittedAt: new Date(),
      status: "pending",
      itemTitle: claimedItem?.title ?? `Item #${itemId}`,
    };

    setClaims((current) => [newClaim, ...current]);
    setItems((current) => current.filter((item) => item.id !== itemId));
  }, [items, selectedUser, users]);

  const verifyClaim = useCallback((claimId: number): void => {
    const activeVerifierId = selectedUser?.id ?? users[0]?.id ?? 1;

    setClaims((current) =>
      current.map((claim) =>
        claim.id === claimId 
          ? { ...claim, status: "verified", verifiedBy: activeVerifierId } 
          : claim
      )
    );
  }, [selectedUser, users]);

  // Computed Values & Memoization
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!normalizedSearchTerm) return items;
    return items.filter((item) => {
      const searchableText = `${item.title} ${item.location} ${item.description}`.toLowerCase();
      return searchableText.includes(normalizedSearchTerm);
    });
  }, [items, normalizedSearchTerm]);

  const { lostItems, foundItems } = useMemo(() => {
    return {
      lostItems: items.filter((item) => item.status === "lost"),
      foundItems: items.filter((item) => item.status === "found"),
    };
  }, [items]);

  // Loading State UI
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading Campus Lost & Found data...</p>
        </div>
      </main>
    );
  }

  // Error State UI
  if (isError) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 transition-colors flex items-center justify-center">
        <div className="max-w-md w-full rounded-xl border border-red-200 bg-red-50 p-6 dark:bg-red-950/40 dark:border-red-900 text-center space-y-3">
          <h2 className="text-lg font-bold text-red-800 dark:text-red-300">Unable to load data</h2>
          <p className="text-sm text-red-600 dark:text-red-400">Something went wrong while fetching campus records.</p>
          <button
            type="button"
            onClick={() => setIsError(false)}
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 dark:bg-red-500"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div>
      <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header Controls */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-label="school icon">🏫</span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Campus Lost & Found</h1>
                {selectedUser && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Active Student: <strong>{selectedUser.name}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {userEmail && (
                <span className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  {userEmail}
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300"
              >
                Log Out
              </button>
            </div>
          </header>

          {/* Search Bar */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search items by title, description, or location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={focusSearchInput}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Focus
              </button>
            </div>

            {previousSearch !== undefined && previousSearch !== searchTerm && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Previous search: <span className="italic font-medium">"{previousSearch}"</span>
              </p>
            )}
          </div>

          {/* Status Overview Panel */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold">Status Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Lost Panel */}
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-red-900 dark:text-red-300">Lost</h3>
                  <SubmissionBadge status="lost" variant="compact" />
                </div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{lostItems.length}</p>
                <ul className="mt-2 space-y-1 text-xs text-red-600 dark:text-red-300">
                  {lostItems.length === 0 ? <li>No lost items</li> : lostItems.map((item) => <li key={item.id}>• {item.title}</li>)}
                </ul>
              </div>

              {/* Found Panel */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-300">Found</h3>
                  <SubmissionBadge status="found" variant="compact" />
                </div>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{foundItems.length}</p>
                <ul className="mt-2 space-y-1 text-xs text-emerald-600 dark:text-emerald-300">
                  {foundItems.length === 0 ? <li>No found items</li> : foundItems.map((item) => <li key={item.id}>• {item.title}</li>)}
                </ul>
              </div>

              {/* Claims Panel */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">Claimed</h3>
                  <SubmissionBadge status="pending" variant="compact" />
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{claims.length}</p>
                <ul className="mt-2 space-y-1 text-xs text-blue-600 dark:text-blue-300">
                  {claims.length === 0 ? <li>No claims yet</li> : claims.map((claim) => (
                    <li key={claim.id}>• {claim.itemTitle} ({claim.status})</li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">

              {/* Users Section */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Students ({users.length})</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      isSelected={selectedUser?.id === user.id}
                      onSelect={setSelectedUser}
                      variant="default"
                    />
                  ))}
                </div>
              </section>

              {/* Items Section */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold">Items ({filteredItems.length})</h2>

                {showForms && (
                  <form onSubmit={handleItemSubmit} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 space-y-3">
                    <legend className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Report Item</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        name="title"
                        placeholder="Title"
                        value={itemForm.title}
                        onChange={handleItemChange}
                        required
                        className="rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        name="location"
                        placeholder="Location"
                        value={itemForm.location}
                        onChange={handleItemChange}
                        required
                        className="rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <select
                        name="status"
                        value={itemForm.status}
                        onChange={handleItemChange}
                        className="rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="lost">Lost</option>
                        <option value="found">Found</option>
                      </select>
                      <select
                        name="reportedBy"
                        value={itemForm.reportedBy}
                        onChange={handleItemChange}
                        required
                        className="rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select Student</option>
                        {users.map((u) => (
                          <option key={u.id} value={String(u.id)}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                      Report Item
                    </button>
                  </form>
                )}

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm.trim() ? `No items matching "${searchTerm.trim()}"` : "No items listed."}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        reporterName={users.find((u) => u.id === item.reportedBy)?.name}
                        onClaim={() => handleClaimSubmit(item.id)}
                        variant="default"
                      />
                    ))}
                  </div>
                )}
              </section>

            </div>

            {/* Sidebar Claims List */}
            <aside className="space-y-4">
              <h2 className="text-xl font-bold">Claims Verification</h2>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                {claims.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No active claims.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {claims.map((claim) => (
                      <li key={claim.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{claim.itemTitle}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Claimed by Student #{claim.claimedBy}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <SubmissionBadge status={claim.status} variant="compact" />
                          {claim.status === "pending" && (
                            <button
                              type="button"
                              onClick={() => verifyClaim(claim.id)}
                              className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;