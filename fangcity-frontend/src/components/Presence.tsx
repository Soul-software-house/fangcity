import React, { useCallback, useEffect, useRef, useState } from "react";
import useInterval from "@jdthornton/useinterval";
import { motion, useAnimation } from "framer-motion";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import { isEqual } from "lodash";
import Moralis from "moralis-v1";
import { isMobile } from "react-device-detect";
import { useMoralis, useMoralisQuery, useMoralisSubscription, useMoralisCloudFunction } from "react-moralis";
import useSound from "use-sound";
import { ChatIcon } from "@heroicons/react/solid";
import TextareaAutosize from "react-textarea-autosize";

import { useGlobalState } from "../App";
import { useContainerDimensions, useKeyPress } from "../utils";
import { COLORS, Fangster } from "./Fangster";

import enterFx from "../assets/sounds/enterfx.mp3";
import chatFx from "../assets/sounds/popfx.mp3";

const fiveMins = () => new Date(new Date().getTime() - 5 * 60 * 1000);
const oneMin = () => new Date(new Date().getTime() - 60 * 1000);

const parsePosition = (position: number): string => `${position}px`;

export const Presence = () => {
  const { isAuthenticated, isWeb3Enabled } = useMoralis();
  const [oneMinAgo, setOneMinAgo] = useState(oneMin());
  const [fiveMinsAgo, setFiveMinsAgo] = useState(fiveMins());
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [playEnter] = useSound(enterFx, { volume: 0.75 });
  const [playChat] = useSound(chatFx, { volume: 0.75 });
  const aPress = useKeyPress("a");
  const leftPress = useKeyPress(37);
  const rightPress = useKeyPress(39);
  const dPress = useKeyPress("d");
  const wPress = useKeyPress("w");
  const spacePress = useKeyPress(32);
  const upPress = useKeyPress(38);
  const enterPress = useKeyPress("Enter");
  const controls = useAnimation();
  const scrollTo = useRef(null);
  const totalWidth = useRef(null);
  const mobileRef = useRef();
  const { width } = useContainerDimensions(totalWidth);
  const [currentFangster] = useGlobalState("currentFangster");
  const [userFangsters] = useGlobalState("userFangsters");
  const [mobileControls] = useGlobalState("mobileControls");
  const [location] = useGlobalState("location");
  const [chatMessages, setChatMessages] = useState({});
  const [enterChat, setEnterChat] = useState(false);
  const [allTokenIds, setAllTokenIds] = useState([]);
  const [modal] = useGlobalState("modal");

  const createChatMessage = useMoralisCloudFunction("createChatMessage");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updatePosition = useCallback(
    throttle(async _position => {
      try {
        if (isAuthenticated && currentFangster?.get("tokenId") && position !== _position) {
          Moralis.Cloud.run("updateCurrentPosition", { position: _position });
        }
      } catch (e) {
        console.log("There was a problem updating the current location!");
      }
    }, 250),
    [isAuthenticated, currentFangster]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateDirection = useCallback(
    throttle(async _direction => {
      try {
        if (isAuthenticated && currentFangster?.get("tokenId") >= 0) {
          Moralis.Cloud.run("updateCurrentDirection", { direction: _direction });
        }
      } catch (e) {
        console.log("There was a problem updating the current direction!");
      }
    }, 250),
    [isAuthenticated, currentFangster]
  );

  useEffect(() => {
    const handle = setInterval(() => {
      setOneMinAgo(oneMin());
      setFiveMinsAgo(fiveMins());
    }, 10_000);

    return () => clearInterval(handle);
  }, [currentFangster]);

  // FANGSTERS
  //
  const fangsters = useMoralisQuery(
    "Fangster",
    q =>
      q
        .equalTo("currentLocation", location)
        .greaterThan("lastActivityAt", fiveMinsAgo)
        .notContainedIn("tokenId", userFangsters?.map(f => Number(f.get("tokenId"))) || []),
    [currentFangster, userFangsters],
    {
      live: true,
    }
  );
  useMoralisSubscription(
    "Fangster",
    q =>
      q
        .equalTo("currentLocation", location)
        .greaterThan("lastActivityAt", fiveMinsAgo)
        .notContainedIn("tokenId", userFangsters?.map(f => Number(f.get("tokenId"))) || []),
    [currentFangster, userFangsters],
    {
      onEnter: () => playEnter(),
    }
  );

  useEffect(() => {
    if (currentFangster) {
      playEnter();
    }

    fangsters.fetch();
  }, [currentFangster]); // eslint-disable-line react-hooks/exhaustive-deps

  // CHAT
  //
  useEffect(() => {
    if (location && currentFangster?.get("tokenId")) {
      const ids = [Number(currentFangster?.get("tokenId"))].concat(
        fangsters?.data?.map(f => Number(f.get("tokenId"))) || []
      );
      setAllTokenIds(ids);
    } else {
      setAllTokenIds([]);
    }
  }, [location, fangsters?.data, currentFangster]);

  const chats = useMoralisQuery(
    "ChatMessage",
    q =>
      q
        .equalTo("location", location)
        .containedIn("tokenId", allTokenIds)
        .greaterThan("createdAt", oneMinAgo)
        .ascending("createdAt"),
    [location, allTokenIds],
    {
      live: true,
      onLiveCreate: (entity, all) => {
        chats.fetch();
        return [...all, entity];
      },
    }
  );

  useEffect(() => {
    if (chats?.data && !chats?.isFetching && !chats?.isLoading) {
      const messages = chats.data.reduce((acc, c) => {
        acc[c.get("tokenId")] = c.get("message");
        return acc;
      }, {});

      if (!isEqual(messages, chatMessages)) {
        setChatMessages(messages);
      }
    }
  }, [chats?.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useInterval(
    () => {
      chats.fetch();
      fangsters.fetch();
    },
    isAuthenticated && isWeb3Enabled ? 30_000 : null
  );

  const sendChatMessage = async (message: string) => {
    const tokenId = currentFangster?.get("tokenId");

    if (message.length > 0 && (tokenId || tokenId === 0)) {
      const success = await createChatMessage.fetch({ params: { location, tokenId, message } });

      if (success) {
        chatMessages[tokenId] = message;
        playChat();
        setEnterChat(false);
      }
    }
  };

  // Keyboard handlers
  //
  debounce(() => {
    if (!modal && !enterChat && (aPress || leftPress) && !dPress && !rightPress) {
      const p = Math.max(position - 15, 0);
      setPosition(p);
      updatePosition(p);
      setDirection(-1);
      updateDirection(-1);
      scrollTo?.current?.scrollIntoView({ behavior: "auto", inline: "center" });
    }
    if (!modal && !enterChat && (dPress || rightPress) && !aPress && !leftPress) {
      const p = Math.max(Math.min(position + 15, width), 0);
      setPosition(p);
      updatePosition(p);
      setDirection(1);
      updateDirection(1);
      scrollTo?.current?.scrollIntoView({ behavior: "auto", inline: "center" });
    }
    if (!modal && !enterChat && (spacePress || upPress || wPress)) {
      controls.start({
        scale: 1,
        y: [0, -100, 0],
        transition: { duration: 0.35 },
      });
    }
    if (!modal && !enterChat && enterPress) {
      setEnterChat(true);
    }
  }, 20)();

  return (
    <>
      {isAuthenticated && isMobile && mobileControls && (
        <div ref={mobileRef} className="fixed left-0 right-0 z-[998] w-full select-none pb-[3vh]">
          <button
            onTouchStart={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keydown", { bubbles: true, keyCode: 37 })
              )
            }
            onMouseDown={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keydown", { bubbles: true, keyCode: 37 })
              )
            }
            onMouseUp={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keyup", { bubbles: true, keyCode: 37 })
              )
            }
            onTouchEnd={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keyup", { bubbles: true, keyCode: 37 })
              )
            }
            onTouchCancel={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keyup", { bubbles: true, keyCode: 37 })
              )
            }
            className={`absolute bottom-0 left-0 select-none text-${
              COLORS[
                `${currentFangster?.get("background")}${
                  currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                }`
              ] || "slate-300"
            }`}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 drop-shadow-nfc"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{
                scale: 1.05,
                boxShadow: "-7px 5px 0px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{
                scale: 0.95,
                boxShadow: "-3px 2px 0px rgba(0, 0, 0, 0.15)",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </motion.svg>
          </button>
          <button
            onTouchStart={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keydown", { bubbles: true, keyCode: 39 })
              )
            }
            onMouseDown={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keydown", { bubbles: true, keyCode: 39 })
              )
            }
            onMouseUp={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keyup", { bubbles: true, keyCode: 39 })
              )
            }
            onTouchEnd={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keyup", { bubbles: true, keyCode: 39 })
              )
            }
            onTouchCancel={() =>
              (mobileRef.current as any)?.dispatchEvent(
                new window.KeyboardEvent("keyup", { bubbles: true, keyCode: 39 })
              )
            }
            className={`absolute right-0 bottom-0 select-none text-${
              COLORS[
                `${currentFangster?.get("background")}${
                  currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                }`
              ] || "slate-300"
            }`}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 drop-shadow-nfc"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{
                scale: 1.05,
                boxShadow: "-7px 5px 0px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{
                scale: 0.95,
                boxShadow: "-3px 2px 0px rgba(0, 0, 0, 0.15)",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </button>
        </div>
      )}
      <div className="items-bottom absolute left-0 right-0 bottom-0 z-[900] flex shrink flex-row justify-around pb-[3vh]">
        <div ref={totalWidth} className="relative ml-[3vh] mr-[13vh] h-full w-full">
          {currentFangster && (
            <motion.div
              className="absolute bottom-0"
              ref={scrollTo}
              style={{
                left: `min(100%,${parsePosition(position)}`,
              }}
              animate={controls}
            >
              <div className="group items-middle flex flex-col">
                {enterChat ? (
                  <TextareaAutosize
                    minRows={1}
                    maxLength={280}
                    autoFocus
                    onBlur={() => setEnterChat(false)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && e.currentTarget.value.length > 0) {
                        e.preventDefault();
                        sendChatMessage(e.currentTarget.value);
                      } else if (e.key === "Escape") {
                        setEnterChat(false);
                      }
                    }}
                    style={{ boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)" }}
                    className={`focus:ring-${
                      COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"
                    } mb-2 block w-full appearance-none rounded-xl border-[0.5vh] border-${
                      COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"
                    } bg-${
                      COLORS[currentFangster?.get("background")] || "purple-dark"
                    } px-4 py-2 text-center text-white placeholder-white focus:border-${
                      COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"
                    } focus:outline-none`}
                  />
                ) : (
                  <>
                    {chatMessages[currentFangster?.get("tokenId")] ? (
                      <p
                        style={{ boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)" }}
                        className={`mx-auto mb-2 max-w-[14rem] truncate whitespace-normal rounded-xl border-[0.5vh] px-4 py-2 text-center font-medium text-black group-hover:z-[999]
                        border-${COLORS[currentFangster?.get("background")] || "purple-dark"} bg-${
                          COLORS[`${currentFangster?.get("background")}Light`] || "purple-light"
                        }`}
                        onClick={() => setEnterChat(true)}
                      >
                        {chatMessages[currentFangster.get("tokenId")]}
                      </p>
                    ) : (
                      <ChatIcon
                        onClick={() => setEnterChat(true)}
                        className={`mx-auto mb-2 h-[4vh] w-[4vh] text-center text-${
                          COLORS[
                            `${currentFangster?.get("background")}${
                              currentFangster?.get("background") === "Purple" ? "Lightest" : "Light"
                            }`
                          ] || "slate-300"
                        } drop-shadow-nfc`}
                      />
                    )}
                  </>
                )}
                <div className="mx-auto">
                  <Fangster fangster={currentFangster} direction={direction} />
                </div>
              </div>
            </motion.div>
          )}
          {fangsters?.data
            ?.filter(f => Number(f.get("tokenId")) !== Number(currentFangster?.get("tokenId")))
            ?.map((fangster, i) => (
              <div
                key={i}
                className="absolute bottom-0 transition-[left]"
                style={{
                  left: `min(100%,${parsePosition(fangster?.get("currentPosition"))}`,
                }}
              >
                <div className="group items-middle flex flex-col">
                  {chatMessages[fangster.get("tokenId")] ? (
                    <p
                      style={{ boxShadow: "-6px 4px 1px rgba(0, 0, 0, 0.15)" }}
                      className={`mx-auto mb-2 max-w-[14rem] truncate whitespace-normal rounded-xl border-[0.5vh] px-4 py-2 text-center font-medium text-black group-hover:z-[999]
                        border-${COLORS[fangster?.get("background")] || "purple-dark"} bg-${
                        COLORS[`${fangster?.get("background")}Light`] || "purple-light"
                      }`}
                    >
                      {chatMessages[fangster.get("tokenId")]}
                    </p>
                  ) : null}
                  <div className="mx-auto">
                    <Fangster fangster={fangster} direction={fangster.get("currentDirection")} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
