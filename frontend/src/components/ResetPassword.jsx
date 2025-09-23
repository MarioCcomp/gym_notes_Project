import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import gymNotes from "../assets/gymnotes.png";
import "./Login.css";

import api from "../config/axiosConfig";

const ResetPassword = () => {
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const [notification, setNotification] = useState(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordValue !== confirmPasswordValue) {
      setNotification({
        type: "error",
        message: "As senhas digitadas devem ser iguais!",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return;
    }

    try {
      console.log(
        "Aq eu tento mudar a senha do usuario baseado no id dele, caso de certo notifico"
      );

      const response = await api.post("/auth/reset-password/confirm", null, {
        params: { novaSenha: passwordValue },
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotification({
        type: "sucess",
        message: "Senha redefinida com sucesso",
      });

      setTimeout(() => {
        setNotification(null);
        navigate("/");
      }, 3000);
    } catch (err) {
      console.log("aq caiu se deu errado, ai eu notifico");
      console.log(err.response.data.message);

      setNotification({
        type: err.response.data.type,
        message: err.response.data.message,
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className="main main-login">
      {notification && (
        <div
          className={`notification ${
            notification.type === "error" ? "error" : "success"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="header">
        <img src={gymNotes} alt="" />
        <div className="ps">
          <p>Seu app de treino</p>
          <p className="login-message">Redefina sua senha</p>
        </div>
      </div>

      <form className="form-login" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Defina uma senha"
          value={passwordValue}
          required
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirme sua senha"
          value={confirmPasswordValue}
          required
          onChange={(e) => setConfirmPasswordValue(e.target.value)}
        />

        <button type="submit">Redefinir senha</button>
      </form>
    </div>
  );
};

export default ResetPassword;
