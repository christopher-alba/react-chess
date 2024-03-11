import { FC, useState } from "react";
import { Game, OnlineReturnState } from "../../types/gameTypes";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

const Lobby: FC<{ lobby: Game }> = ({ lobby }) => {
  const [password, setPassword] = useState(undefined);
  const navigate = useNavigate();
  const changePw = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <div>
      {lobby.gameID}
      <input
        onPaste={(e: React.ClipboardEvent) => {
          console.log(e.clipboardData.getData("text"));
          setPassword(e.clipboardData.getData("text"));
        }}
        onChange={changePw}
      />
      <button
        onClick={() => {
          socket.emit(
            "join",
            { name: "Frank 2", gameID: lobby.gameID, password: password },
            ({ error, color, state }) => {
              if (error) return;
              navigate("/online/classicChess", {
                state: {
                  color,
                  state,
                  password,
                } as OnlineReturnState,
              });
            }
          );
        }}
      >
        Join
      </button>
    </div>
  );
};

export default Lobby;
