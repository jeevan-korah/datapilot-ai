import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css"
const AddEmployee = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const existing = JSON.parse(localStorage.getItem("employees")) || [];

    const newEmployee = {
      id: Date.now(),
      email,
      role,
    };

    localStorage.setItem(
      "employees",
      JSON.stringify([...existing, newEmployee])
    );

    navigate("/admin"); // 🔥 go back
  };

  return (
    <div >
      <form className="addemp-div" onSubmit={handleSubmit}>
        <h2>Add Employee</h2>

        <input
          type="email"
          placeholder="Employee Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="Developer">Developer</option>
          <option value="HR">HR</option>
          <option value="Businness Analyst">Business Analyst</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddEmployee;
