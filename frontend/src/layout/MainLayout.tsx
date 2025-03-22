import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import { PlaybackControls } from "./components/PlaybackContrlols";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen text-white bg-black">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-1 h-full overflow-hidden"
      >
        {/* Left Sidebar */}
        <ResizablePanel
          defaultSize={isMobile ? 20 : 20}
          minSize={isMobile ? 20 : 10}
          maxSize={isMobile ? 20 : 30}
          collapsedSize={0}
          collapsible
        >
          <LeftSidebar />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="w-2 bg-black rounded-lg" />

        {/* Main Content */}
        <ResizablePanel
          defaultSize={isMobile ? 80 : 60}
          minSize={isMobile ? 80 : 40}
          maxSize={isMobile ? 80 : 80}
        >
          <Outlet />
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="w-2 bg-black rounded-lg" />

        {/* Right Sidebar */}
        <ResizablePanel
          defaultSize={isMobile ? 0 : 20}
          minSize={isMobile ? 0 : 10}
          maxSize={isMobile ? 0 : 30}
          collapsedSize={0}
          collapsible
        >
          <RightSidebar />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Playback Controls at the Bottom */}
      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
