import { FC, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Game, OnlineReturnState, Player } from "../../types/gameTypes";
import { useNavigate } from "react-router-dom";
import { Mode, Visibility } from "../../types/enums";
import { v4 as uuid } from "uuid";
import Lobby from "./Lobby";
import generate from "boring-name-generator";
import styled, { keyframes } from "styled-components";

// Define keyframes
const ldsDualRingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled component for the dual ring loader
const DualRingLoader = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${({ theme }) => theme.colors.secondary1};
    border-color: ${({ theme }) => theme.colors.secondary1} transparent
      ${({ theme }) => theme.colors.secondary1} transparent;
    animation: ${ldsDualRingAnimation} 1.2s linear infinite;
  }
`;
const CenteredWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  flex-direction: column;
`;
const OnlineLobbies: FC = () => {
  const [lobbies, setLobbies] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("FETCHING");
    socket.connect();
    socket.emit(
      "getLobbies",
      { gameMode: Mode.TwoPlayer },
      (props: { lobbies: Game[] }) => {
        setLobbies(props.lobbies);
        setLoading(false);
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

  if (loading)
    return (
      <CenteredWrapper>
        <DualRingLoader />
        <p>Loading Online Mode</p>
      </CenteredWrapper>
    );

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
