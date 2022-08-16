import { useState } from "react";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";

import { useAuth } from "../../contexts/auth_context";
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

  const { logout } = useAuth();

  if (!isOpen) return null;

  return (
    <aside className="fixed z-50 h-full top-0 left-0 w-80 py-6 overflow-auto flex flex-col bg-bg">
      <header className="px-6 pb-6 flex justify-between">
        <h1 className="text-lg font-bold">BetterNotes</h1>
        <button type="button" onClick={handleClose}>
          <MdClose className="text-2xl" />
        </button>
      </header>

      <Link to="/notes" className="px-6 py-3">
        All Notes
      </Link>
      <Link to="/" className="py-3 px-6">
        Settings
      </Link>
      <button
        type="button"
        onClick={() => setIsThemeOptionsOpen(true)}
        className="py-3 px-6 flex justify-between items-center"
      >
        <span>Theme</span>
        <span className="text-sm">{humanizeString(theme)}</span>
      </button>

      <CollectionsSection closeSidebar={handleClose} />
      <TagsSection closeSidebar={handleClose} />

      <button type="button" className="py-3 px-6 text-left" onClick={logout}>
        Logout
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
