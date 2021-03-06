import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg";
import logoDark from "../assets/images/logo-darkmode.svg";
import logoLight from "../assets/images/logo-lightmode.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import { Button } from "../components/Button";

import "./../styles/auth.scss";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { useTheme } from "../hooks/useTheme";

export const Home: React.FC = () => {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("This room doesn't exist.");
      return;
    }

    if (roomRef.val().closedAt) {
      alert("Room already closed.");
      setRoomCode("");
      return;
    }

    history.push(`rooms/${roomCode}`);
  };

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={illustrationImg} alt="Ilustração" />
        <strong>Toda pergunta tem uma resposta.</strong>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          {theme === "light" ? (
            <img src={logoLight} alt="Letmeask" />
          ) : (
            <img src={logoDark} alt="Letmeask" />
          )}
          <button onClick={handleCreateRoom} className="google-login">
            <img src={googleIconImg} alt="Google Icon" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
};
