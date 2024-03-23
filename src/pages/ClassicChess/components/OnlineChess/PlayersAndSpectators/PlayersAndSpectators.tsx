import { FC, useContext, useState } from "react";
import {
  GameIdBackground,
  GameIdHeader,
  Header,
  MainWrapper,
  SmallPrint,
  TickCircleIcon,
} from "./styled";
import { socket } from "../../../../../socket";
import { useDispatch, useSelector } from "react-redux";
import { updateGameInstance } from "../../../../../redux/slices/gameStateSlice";
import { Button } from "../../../../../components/buttons";
import { ThemeContext } from "styled-components";
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "../../../../../components/buttonGroups";
import { NotificationType, Visibility } from "../../../../../types/enums";
import { RootState } from "../../../../../redux/store";
import { createOrUpdateSavedGame } from "../../../../../api/savedGames";
import { useAuth0 } from "@auth0/auth0-react";
import { addNotification } from "../../../../../redux/slices/notificationSlice";
import { v4 } from "uuid";

const PlayersAndSpectators: FC<{ gameID: string; password?: string }> = ({
  gameID,
  password,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [visiblity, setVisibility] = useState<Visibility>(Visibility.Auto);
  const [saving, setSaving] = useState(false);
  const reduxState = useSelector((state: RootState) => state.gameStateReducer);
  const { getIdTokenClaims, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);

  const saveGame = async () => {
    setSaving(true);
    dispatch(
      addNotification({
        id: v4(),
        type: NotificationType.INFO,
        message: `Saving game`,
      })
    );
    const token = await getAccessTokenSilently();
    const tokenClaims = await getIdTokenClaims();
    await createOrUpdateSavedGame(
      {
        auth0UserId: tokenClaims?.sub,
        gameId: reduxState.gamesStates[0].gameId,
        gameStatesJson: JSON.stringify(reduxState),
        modifiedOn: "",
      },
      token
    );

    setSaving(false);
    dispatch(
      addNotification({
        id: v4(),
        type: NotificationType.SUCCESS,
        message: `Saved game`,
      })
    );
  };

  const disconnect = () => {
    socket.disconnect();
    dispatch(
      updateGameInstance({
        gamesStates: [],
        currentMovesState: [],
      })
    );
    navigate("/online");
  };
  const copyId = () => {
    navigator.clipboard.writeText(gameID);
    setCopiedId(true);
    setTimeout(() => {
      setCopiedId(false);
    }, 3000);
  };
  const copyPassword = () => {
    navigator.clipboard.writeText(password ?? "");
    setCopiedPassword(true);
    setTimeout(() => {
      setCopiedPassword(false);
    }, 3000);
  };
  return (
    <MainWrapper>
      <div>
        <GameIdHeader>
          <Header>GameID</Header>
          <Button
            $background={theme?.colors.tertiary1}
            $fontSize="0.7rem"
            onClick={copyId}
            $width={"70px"}
          >
            {copiedId ? <TickCircleIcon /> : "Copy"}
          </Button>
        </GameIdHeader>
        <GameIdBackground onClick={copyId}>
          <SmallPrint>
            <code>{gameID}</code>
          </SmallPrint>
        </GameIdBackground>
        <GameIdHeader style={{ marginTop: "20px" }}>
          <Header>Password</Header>
          <Button
            $background={theme?.colors.tertiary1}
            $fontSize="0.7rem"
            onClick={copyPassword}
            $width={"70px"}
          >
            {copiedPassword ? <TickCircleIcon /> : "Copy"}
          </Button>
        </GameIdHeader>
        <GameIdBackground onClick={copyPassword}>
          <SmallPrint>
            <code>{password}</code>
          </SmallPrint>
        </GameIdBackground>
        <Header>Visiblity</Header>
        <ButtonGroup>
          <Button
            onClick={() => setVisibility(Visibility.Public)}
            $width="100%"
            style={{ opacity: visiblity === Visibility.Public ? 1 : 0.5 }}
            $background={
              visiblity === Visibility.Public
                ? theme?.colors.tertiary1
                : theme?.colors.primary1
            }
            $textColor={theme?.colors.secondary1}
          >
            Visible
          </Button>{" "}
          <Button
            onClick={() => setVisibility(Visibility.Auto)}
            $width="100%"
            $background={
              visiblity === Visibility.Auto
                ? theme?.colors.tertiary1
                : theme?.colors.primary1
            }
            style={{ opacity: visiblity === Visibility.Auto ? 1 : 0.5 }}
            $textColor={theme?.colors.secondary1}
          >
            Auto
          </Button>{" "}
          <Button
            onClick={() => setVisibility(Visibility.Private)}
            $background={
              visiblity === Visibility.Private
                ? theme?.colors.tertiary1
                : theme?.colors.primary1
            }
            $width="100%"
            $textColor={theme?.colors.secondary1}
            style={{ opacity: visiblity === Visibility.Private ? 1 : 0.5 }}
          >
            Private
          </Button>
        </ButtonGroup>
      </div>
      <div>
        <Button
          disabled={saving}
          onClick={saveGame}
          $background={
            saving ? theme?.colors.tertiary1 + "55" : theme?.colors.tertiary1
          }
          $textColor={theme?.colors.secondary1}
          $width="100%"
          style={{
            marginBottom: "10px",
          }}
        >
          {saving ? "Saving..." : "Save Game"}
        </Button>
        <Button
          onClick={disconnect}
          $background={theme?.colors.primary1}
          $textColor={theme?.colors.secondary1}
          $width="100%"
        >
          Disconnect
        </Button>
      </div>
    </MainWrapper>
  );
};

export default PlayersAndSpectators;
