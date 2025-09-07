import { useState } from "react";
import gymNotes from "../assets/gymnotes.png";
import "./Login.css";
import { useToken } from "../context/TokenContext";
import { useMuscles } from "../context/MusclesContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // states para manipular o placeholder
  const [usernamePlaceholder, setUsernamePlaceholder] = useState(
    "Informe seu nome de usuário"
  );
  const [passwordPlaceholder, setPasswordPlaceHolder] =
    useState("Informe sua senha");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [notification, setNotification] = useState(null);

  //   States de criacao de conta

  const [usernameValue, setUsernameValue] = useState("");
  const [nicknameValue, setNicknameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const { login, register } = useToken();
  const { fetchData } = useMuscles();
  const navigate = useNavigate();

  // funcoes para manipular as telas de input

  const showRegisterScreen = () => {
    setIsCreatingAccount(true);
    setUsernamePlaceholder("Informe um nome de usuário");
    setPasswordPlaceHolder("Informe uma senha");
  };

  const showLoginScreen = () => {
    setIsCreatingAccount(false);
    setUsernamePlaceholder("Informe seu nome de usuário");
    setPasswordPlaceHolder("Informe sua senha");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreatingAccount) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  const handleRegister = async () => {
    if (passwordValue !== confirmPasswordValue) {
      setNotification({
        type: "error",
        message: "As duas senhas não são iguais",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }

    const user = {
      username: usernameValue,
      nickname: nicknameValue,
      email: emailValue,
      password: passwordValue,
    };

    const response = await register(
      usernameValue,
      nicknameValue,
      emailValue,
      passwordValue
    );

    setNotification({
      type: response.type,
      message: response.message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);

    if (response.type === "success") {
      setIsCreatingAccount(false);
    }
  };

  const handleLogin = async () => {
    const user = {
      username: usernameValue,
      password: passwordValue,
    };

    const response = await login(usernameValue, passwordValue);

    setNotification({
      type: response.type,
      message: response.message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);

    if (response.type === "success") {
      fetchData(response.token);
      setTimeout(() => {
        navigate("/home");
      }, 500);
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
          <p className="login-message">Faça login para utilizar o aplicativo</p>
        </div>
      </div>

      <form className="form-login" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={usernamePlaceholder}
          value={usernameValue}
          onChange={(e) => setUsernameValue(e.target.value)}
        />
        {isCreatingAccount && (
          <input
            type="text"
            placeholder="Digite seu apelido"
            value={nicknameValue}
            onChange={(e) => setNicknameValue(e.target.value)}
          />
        )}
        {isCreatingAccount && (
          <input
            type="email"
            placeholder="Informe seu email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder={passwordPlaceholder}
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        {isCreatingAccount && (
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
          />
        )}
        {isCreatingAccount ? (
          <button type="submit">Registrar</button>
        ) : (
          <button type="submit">Logar</button>
        )}
      </form>

      {isCreatingAccount ? (
        <p>
          Já tem uma conta? <span onClick={showLoginScreen}>Logar</span>
        </p>
      ) : (
        <p>
          Não tem uma conta?{" "}
          <span onClick={showRegisterScreen}>Criar conta</span>
        </p>
      )}
    </div>
  );
};

export default Login;
