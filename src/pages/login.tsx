import { useAuth } from "../hooks/auth";

const getInitials = (name: string | null) => {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
};

const Login = () => {
  const { user, login, logout } = useAuth();

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.authContainer}>
          {user ? (
            <>
              <div style={styles.avatar}>{getInitials(user.displayName)}</div>
              <button onClick={logout} style={styles.button}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={login} style={styles.button}>
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    marginTop: "-10%",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    color: "white",
  },
  authContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#6200ea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "bold",
  },
  button: {
    padding: "8px 15px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#61dafb",
    color: "black",
  },
};

export default Login;
