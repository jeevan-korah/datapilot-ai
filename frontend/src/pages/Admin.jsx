// 

import "./Admin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [showdiv, setshowdiv] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(data);
  }, []);

  const deleteEmployee = (id) => {
    const updated = employees.filter(emp => emp.id !== id);
    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));
  };
  

  const updateRole = (id, newRole) => {
    const updated = employees.map(emp =>
      emp.id === id ? { ...emp, role: newRole } : emp
    );
    setEmployees(updated);
    localStorage.setItem("employees", JSON.stringify(updated));
  };

  return (
    <>
            <h1>ADMIN PANEL</h1>

      <div className="auth-container">
        <form className="admin-form">
          <input type="text" placeholder="Database connection string" required />
          <input type="text" placeholder="Database schema" />
          <button>Submit</button>
        </form>
      </div >

      <button onClick={() => setshowdiv(true)} className="view-btn">View Employees</button>

      {showdiv && (
        <div className="emp-div">
          <h2>Employee List</h2>

          <button className="form-btn" onClick={() => navigate("/add-employee")}>
            Add Employee +
          </button>

          {employees.map(emp => (
            <div key={emp.id} style={{ marginTop: "10px" }}>
              <p><strong>{emp.email}</strong> — {emp.role}</p>

              <button onClick={() => {
                const newRole = prompt("Enter new role:");
                if (newRole) updateRole(emp.id, newRole);
              }}>
                Change Role
              </button>
            <button
                className="delete-btn" onClick={() => deleteEmployee(emp.id)}>
                  Delete 
            </button>
            </div>
          ))}

          <button onClick={() => setshowdiv(false)}>Close</button>
        </div>
      )}
    </>
  );
}

export default Admin;
