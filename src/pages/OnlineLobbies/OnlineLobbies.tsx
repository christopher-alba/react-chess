import { FC, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Game, OnlineReturnState, Player } from "../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { Mode, Visibility } from "../../types/enums";
import { v4 as uuid } from "uuid";
import Lobby from "./Lobby";
import generate from "boring-name-generator";

const OnlineLobbies: FC = () => {
  const [lobbies, setLobbies] = useState<Game[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("FETCHING");
    socket.connect();
    socket.emit(
      "getLobbies",
      { gameMode: Mode.TwoPlayer },
      (props: { lobbies: Game[] }) => {
        setLobbies(props.lobbies);
      }
    );
  }, []);
  useEffect(() => {
    socket.on("lobbyModified", () => {
      console.log("lobby Modified");
      socket.connect();
      socket.emit(
        "getLobbies",
        { gameMode: Mode.TwoPlayer },
        (props: { lobbies: Game[] }) => {
          setLobbies(props.lobbies);
        }
      );
    });
    return () => {
      socket.off("lobbyModified");
    };
  }, []);
  return (
    <div>
      <button
        onClick={() => {
          socket.connect();
          socket.emit(
            "create",
            {
              name: generate({ number: true }).spaced,
              visibility: Visibility.Public,
            },
            ({
              player,
              password,
              game,
            }: {
              player: Player;
              password: string;
              game: Game;
            }) => {
              console.log(password);
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
        Create Public Game
      </button>
      <button
        onClick={() => {
          socket.connect();
          socket.emit(
            "create",
            {
              name: generate({ number: true }).spaced,
              visibility: Visibility.Private,
              password: uuid(),
            },
            ({ player, game }: { player: Player; game: Game }) => {
              console.log(game.password);
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
        Create Private Game
      </button>
      {lobbies.map((lobby) => (
        <Lobby lobby={lobby} />
      ))}
    </div>
  );
};

export default OnlineLobbies;
