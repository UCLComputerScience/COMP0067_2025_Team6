import AuthGuard from "@/components/guards/AuthGuard"; // Import your AuthGuard

const Alerts = ({ children }: { children: ReactNode }) => {
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
        {children}
      </div>
    </AuthGuard>
  );
};

export default Alerts;
