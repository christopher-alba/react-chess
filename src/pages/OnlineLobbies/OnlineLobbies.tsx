import { FC, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Game, OnlineReturnState } from "../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { Mode } from "../../types/enums";

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
  },[]);
  return (
    <div>
      <button
        onClick={() => {
          socket.connect();
          socket.emit("create", { name: "Frank" }, ({ color, state }) => {
            navigate("/online/classicChess", {
              state: {
                color,
                state,
              } as OnlineReturnState,
            });
          });
        }}
      >
        Create Game
      </button>
      {lobbies.map((lobby) => (
        <div>
          {lobby.gameID}
          <button
            onClick={() => {
              socket.emit(
                "join",
                { name: "Frank 2", gameID: lobby.gameID },
                ({ color, state }) => {
                  navigate("/online/classicChess", {
                    state: {
                      color,
                      state,
                    } as OnlineReturnState,
                  });
                }
              );
            }}
          >
            Join
          </button>
        </div>
      ))}
    </div>
  );
};

export default OnlineLobbies;
