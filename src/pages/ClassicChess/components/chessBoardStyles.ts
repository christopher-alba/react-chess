import styled from "styled-components";

export const Tile = styled("div")`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
`;

export const TilesWrapper = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  overflow: hidden;
  background: #805e3e;
  backdrop-filter: blur(8px);
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  aspect-ratio: 1/1;
`;

export const CapturedPiecesWrapper = styled("div")`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  margin-left: auto;
  background: #805e3e;
`;

export const CapturedPiecesWrapperOverlay = styled("div")`
  height: 100%;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding-right: 20px;
`;

export const CapturedDivWrapper = styled("div")`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  height: 50px;
  align-items: center;
`;

export const PlayerName = styled("h3")`
  margin: 0;
  width: 200px;
  transition: 500ms;
  padding-left: 30px;
  font-weight: 200;
  letter-spacing: 3px;
  text-overflow: ellipsis;
`;

export const MainChessboardWrapper = styled("div")`
  max-width: 550px;
  display: flex;
  flex-direction: column;
`;
