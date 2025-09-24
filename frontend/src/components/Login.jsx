import { useState } from "react";
import gymNotes from "../assets/gymnotes.png";
import "./Login.css";
import { useToken } from "../context/TokenContext";
import { useMuscles } from "../context/MusclesContext";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosConfig";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

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
  const [isSeeingPassword, setIsSeeingPassword] = useState(false);
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [isSeeingConfirmPassword, setIsSeeingConfirmPassword] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [loading, setLoading] = useState(false);

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
    } else if (!forgetPassword) {
      handleLogin();
    } else {
      handleForgetPassword();
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

  const handleForgetPassword = async () => {
    console.log("entrou");
    try {
      setLoading(true);
      const response = await api.post("/auth/reset-password", {
        email: emailValue,
      });

      const data = response.data;

      setNotification({
        type: data.type,
        message: data.message,
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      setNotification({
        type: err.response.data.type,
        message: err.response.data.message,
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } finally {
      setLoading(false);
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
          {!isCreatingAccount && !forgetPassword && (
            <p className="login-message">
              Faça login para utilizar o aplicativo
            </p>
          )}
          {isCreatingAccount && !forgetPassword && (
            <p className="login-message">
              Crie uma conta para utilizar o aplicativo
            </p>
          )}
          {forgetPassword && (
            <p className="login-message">Esqueceu sua senha?</p>
          )}
        </div>
      </div>

      <form className="form-login" onSubmit={handleSubmit}>
        {!forgetPassword && (
          <input
            type="text"
            placeholder={usernamePlaceholder}
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        )}
        {isCreatingAccount && (
          <input
            type="text"
            placeholder="Digite seu apelido"
            value={nicknameValue}
            onChange={(e) => setNicknameValue(e.target.value)}
          />
        )}
        {(forgetPassword || isCreatingAccount) && (
          <input
            type="email"
            placeholder="Informe seu email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />
        )}
        {!forgetPassword && (
          <div className="password-box">
            <input
              type={isSeeingPassword ? "text" : "password"}
              placeholder={passwordPlaceholder}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
            />
            {isSeeingPassword ? (
              <FaEye
                onClick={() => setIsSeeingPassword(false)}
                className="eye"
              />
            ) : (
              <FaEyeSlash
                className="eye"
                onClick={() => setIsSeeingPassword(true)}
              />
            )}
          </div>
        )}
        {!forgetPassword && isCreatingAccount && (
          <div className="password-box">
            <input
              type={isSeeingConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
            />
            {isSeeingConfirmPassword ? (
              <FaEye
                onClick={() => setIsSeeingConfirmPassword(false)}
                className="eye"
              />
            ) : (
              <FaEyeSlash
                className="eye"
                onClick={() => setIsSeeingConfirmPassword(true)}
              />
            )}
          </div>
        )}
        {!forgetPassword ? (
          isCreatingAccount ? (
            <button type="submit">Registrar</button>
          ) : (
            <button type="submit">Logar</button>
          )
        ) : (
          <button type="submit" disabled={loading}>
            {loading ? "Enviando email..." : "Enviar link de redefinição"}
          </button>
        )}
      </form>

      {!forgetPassword ? (
        isCreatingAccount ? (
          <p>
            Já tem uma conta? <span onClick={showLoginScreen}>Logar</span>
          </p>
        ) : (
          <>
            <p>
              Não tem uma conta?{" "}
              <span onClick={showRegisterScreen}>Criar conta</span>
            </p>
            <span onClick={() => setForgetPassword(true)} id="forget-password">
              Esqueci minha senha
            </span>
          </>
        )
      ) : (
        <span id="back-login" onClick={() => setForgetPassword(false)}>
          Voltar ao login
        </span>
      )}
    </div>
  );
};

export default Login;
