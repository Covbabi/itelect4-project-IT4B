import type { ChangeEvent, MouseEvent } from "react";
import type { User } from "../types/index";

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

function UserCard({ user, onSelect }: UserCardProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (onSelect) onSelect(user);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("Search:", event.target.value);
  };

  return (
    <article className="card user-card">
      <div className="card-header">
        <span className="badge">USER</span>
        {onSelect && (
          <button className="ghost-button" onClick={handleClick}>
            Select
          </button>
        )}
      </div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p className="meta">Role: {user.role}</p>
      <input
        className="search-field"
        onChange={handleChange}
        placeholder="Search user data..."
      />
    </article>
  );
}

export default UserCard;