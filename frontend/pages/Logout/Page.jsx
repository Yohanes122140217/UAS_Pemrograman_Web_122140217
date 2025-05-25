import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1) remove the token
    localStorage.removeItem("token");
    // 2) send them to login (replace so they can’t hit “back”)
    navigate("/login", { replace: true });
  }, [navigate]);

  // nothing to render
  return null;
}
