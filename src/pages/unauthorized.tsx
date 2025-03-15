import React from "react";
import Link from "next/link";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <Link
        href="/dashboard/lab1"
        style={{ color: "blue", textDecoration: "underline", fontSize: "18px" }}
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
