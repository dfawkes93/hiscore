import { useState } from "react";
import { DataTypes } from "../Models";

function UserForm({ handleSubmit }: { handleSubmit: any }) {
  function handleChange(event: any) {
    const value = event.target.value as string;
    const name = event.target.name as "name" | "short" | "email";
    setFormData({ ...formData, [name]: value });
  }
  const doSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit(DataTypes.User, formData);
  };
  const [formData, setFormData] = useState({
    name: "",
    short: "",
    email: "",
  });
  return (
    <div>
      <form onSubmit={doSubmit} className="grid grid-cols-1">
        <label>Name:</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <label>Short:</label>
        <input
          name="short"
          type="text"
          value={formData.short}
          onChange={handleChange}
        />
        <label>Email (optional):</label>
        <input
          name="email"
          type="text"
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit">Add New User</button>
      </form>
    </div>
  );
}

export default UserForm;
