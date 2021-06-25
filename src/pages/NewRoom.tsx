/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg";
import logoDark from "../assets/images/logo-darkmode.svg";
import logoLight from "../assets/images/logo-lightmode.svg";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { database } from "../services/firebase";

import "./../styles/auth.scss";

export const NewRoom: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState("");

  const handleCreateRoom = async (event: FormEvent) => {
    event.preventDefault();

    if (newRoom.trim() === "") {
      return;
    }

    const roomRef = database.ref("rooms");

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    history.push(`/rooms/${firebaseRoom.key}`);
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
          <h1>{user?.name}</h1>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
