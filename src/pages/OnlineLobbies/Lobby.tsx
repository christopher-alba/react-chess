import { FC, useState } from "react";
import { Game, OnlineReturnState, Player } from "../../types/gameTypes";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

const Lobby: FC<{ lobby: Game }> = ({ lobby }) => {
  const [password, setPassword] = useState<string>("");
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
            ({
              error,
              player,
              game,
            }: {
              error: string;
              player: Player;
              game: Game;
            }) => {
              if (error) return;
              navigate("/online/classicChess", {
                state: {
                  player,
                  game,
                } as OnlineReturnState,
              });
            }
          );
        }}
      >
        Join
      </button>
      <button
        onClick={() => {
          socket.emit(
            "joinAsSpectator",
            { name: "Frank 2", gameID: lobby.gameID, password: password },
            ({
              error,
              newSpectator,
              game,
            }: {
              error: string;
              newSpectator: Player;
              game: Game;
            }) => {
              if (error) return;
              console.log(game.spectators);

              navigate("/online/classicChess", {
                state: {
                  player: newSpectator,
                  game,
                } as OnlineReturnState,
              });
            }
          );
        }}
      >
        Spectate
      </button>
    </div>
  );
};

export default Lobby;
