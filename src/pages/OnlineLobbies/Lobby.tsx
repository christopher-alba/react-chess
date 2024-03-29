import { FC, useContext, useState } from "react";
import { Game, OnlineReturnState, Player } from "../../types/gameTypes";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import generate from "boring-name-generator";
import { ControlsWrapper, LobbyWrapper, PasswordInput } from "./styled";
import { Button } from "../../components/buttons";
import { ThemeContext } from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const Lobby: FC<{ lobby: Game }> = ({ lobby }) => {
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);
  const { user } = useAuth0();
  const changePw = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  return (
    <LobbyWrapper>
      {lobby.gameID}
      <div>
        {lobby.players?.map((player) => (
          <p>{player.name}</p>
        ))}
      </div>
      <div>Number of spectators: {lobby.spectators?.length}</div>
      <ControlsWrapper>
        {lobby.password && (
          <PasswordInput
            placeholder="password"
            onPaste={(e: React.ClipboardEvent) => {
              console.log(e.clipboardData.getData("text"));
              setPassword(e.clipboardData.getData("text"));
            }}
            onChange={changePw}
          />
        )}
        {lobby.players.length < 2 && (
          <Button
            $background={theme?.colors.secondary1}
            $textColor={theme?.colors.primary1}
            $width="100%"
            onClick={() => {
              socket.emit(
                "join",
                {
                  name: user?.email ?? generate({ number: true }).spaced,
                  gameID: lobby.gameID,
                  password: password,
                },
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
          </Button>
        )}
        <Button
          $background={theme?.colors.primary4}
          $textColor={theme?.colors.secondary1}
          $width="100%"
          onClick={() => {
            socket.emit(
              "joinAsSpectator",
              {
                name: user?.email ?? generate({ number: true }).spaced,
                gameID: lobby.gameID,
                password: password,
              },
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
        </Button>
      </ControlsWrapper>
    </LobbyWrapper>
  );
};

export default Lobby;
