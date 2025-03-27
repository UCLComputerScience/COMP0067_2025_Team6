import AuthGuard from "@/components/guards/AuthGuard"; // Import your AuthGuard

const Alerts = () => {
  console.log("Alerts Page - Required Roles:", [
    "ADMIN",
    "STANDARD_USER",
    "SUPER_USER",
  ]);

  return (
    <AuthGuard requiredRoles={["ADMIN", "STANDARD_USER", "SUPER_USER"]}>
      {" "}
      {/* Allow Admin, Standard User, and Super User */}
      <div>
        <h2>Alerts</h2>
      </div>
    </AuthGuard>
  );
};

export default Alerts;
