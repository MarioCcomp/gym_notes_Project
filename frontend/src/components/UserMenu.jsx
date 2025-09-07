import { useToken } from "../context/TokenContext";
import "./UserMenu.css";

const UserMenu = () => {
  const { nickname, logout, loading } = useToken();

  if (loading) return <p>Carregando...</p>;
  if (!nickname) return null;

  return (
    <div className="userMenu">
      <div className="avatar">{nickname[0]}</div>
      <span className="greeting">Olá, {nickname}</span>
      <button className="logoutBtn" onClick={logout}>
        Sair
      </button>
    </div>
  );
};

export default UserMenu;
