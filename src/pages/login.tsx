import { useAuth } from "../hooks/auth";

const Login = () => {
  const { login } = useAuth();

  return (
    <div>
      <h2>Login to URL Shortener</h2>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
};

export default Login;
