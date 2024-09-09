import { useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

import useTheme from "../../hooks/use_theme";
import OptionsModal from "../options_modal";
import CollectionsSection from "./collections_section";
import TagsSection from "./tags_section";
import { ThemeOptions } from "../../lib/types";
import { humanizeString } from "../../lib/utils";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}
function SideBar({ isOpen, handleClose }: Props) {
  const [isThemeOptionsOpen, setIsThemeOptionsOpen] = useState(false);
  const { theme, updateTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <aside className="fixed z-50 h-full top-0 left-0 w-80 py-6 overflow-auto flex flex-col bg-bg shadow-lg">
      <header className="px-6 pb-3 flex justify-between">
        <h1 className="text-lg font-bold">BetterNotes</h1>
        <button
          className="p-2 rounded-full hover:bg-gray-2"
          type="button"
          onClick={handleClose}
        >
          <MdClose className="text-2xl" />
        </button>
      </header>

      <Link to="/notes" className="px-6 py-3 hover:bg-gray-1">
        All Notes
      </Link>

      <CollectionsSection closeSidebar={handleClose} />
      <TagsSection closeSidebar={handleClose} />

      <Link to="/" className="py-3 px-6 hover:bg-gray-1">
        Settings
      </Link>
      <button
        type="button"
        onClick={() => setIsThemeOptionsOpen(true)}
        className="py-3 px-6 flex justify-between items-center hover:bg-gray-1"
      >
        <span>Theme</span>
        <span className="text-sm">{humanizeString(theme)}</span>
      </button>

      <OptionsModal
        title="Choose theme"
        isOpen={isThemeOptionsOpen}
        onClose={() => setIsThemeOptionsOpen(false)}
        items={[
          { node: "Light", onClick: () => updateTheme(ThemeOptions.LIGHT) },
          { node: "Dark", onClick: () => updateTheme(ThemeOptions.DARK) },
        ]}
      />
    </aside>
  );
}

export default SideBar;
