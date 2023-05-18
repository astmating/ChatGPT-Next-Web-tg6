import { useEffect, useRef } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/guanwang1.svg";
import ChatGptIcon from "../icons/chatgpt.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import MaskIcon from "../icons/mask.svg";
import PluginIcon from "../icons/plugin.svg";

import Locale from "../locales";

import { useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  REPO_URL,
} from "../constant";
{/*  Buy_URL,  */}

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showToast } from "./ui-lib";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();

  const config = useAppConfig();

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>AI研究所-企业级</div>
        <div className={styles["sidebar-sub-title"]} style={{ margin: '10px 0' }}>
          {/* lh */}
          <a style={{ textDecoration: 'none' }} href='https://s.pdb2.com/pages/20230518/1NrjjCa7OCpOqh2.html'>欢迎使用ChatGPT,点击我加入AI交流群.</a>
        </div>
        <div className={styles["sidebar-sub-title"]} style={{ margin: '10px 0' }}>
          <a style={{ textDecoration: 'none' }} href='https://mp.weixin.qq.com/s/V07P7Ms0ZuwioWJ9R2KlIQ'>点击我查看使用技巧.</a>
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <ChatGptIcon />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        {/* 面具 */}
        {/* <a style={{ textDecoration: 'none' }}   target="_blank"> */}
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : Locale.Mask.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.NewChat, { state: { fromHome: true } })}
          shadow
        />
        {/* </a> */}
        {/* 买课中心课程教学 */}
        {/* <Link to={Buy_URL}> */}
        {/* <a style={{ textDecoration: 'none' }} href={Buy_URL}  target="_blank">*/}
        <IconButton
          icon={<PluginIcon />}
          text="课程教学" 
          className={styles["sidebar-bar-button"]}
          onClick={() => window.location.href='https://appulfjljvg3856.h5.xiaoeknow.com/p/decorate/homepage?share_user_id=anonymous_A9mkXFpUh8RhxLq8T&wework_share_customer_id=anonymous_A9mkXFpUh8RhxLq8T&entry=2&entry_type=200'
}
          shadow 
         />
        {/* </a> */}
        {/* </Link> */}
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>
      
      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={() => {
                if (confirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          {/* 设置 */}
          <div className={styles["sidebar-action"]}>
            <Link style={{ textDecoration: 'none' }} to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} text="设置" shadow />
            </Link>
          </div>
          {/* 视频号 */}
          <div className={styles["sidebar-action"]}>
            <a style={{ textDecoration: 'none' }} href={REPO_URL}  target="_blank">
              <IconButton icon={<GithubIcon />} text="视频号" shadow />
            </a>
          </div>
        </div>
        <div>
        {/* 新建信息 */}
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              if (config.dontShowMaskSplashScreen) {
                chatStore.newSession();
                navigate(Path.Chat);
              } else {
                navigate(Path.NewChat);
              }
            }}
            shadow
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
    </div>
  );
}
