import { ReactNode, ReactElement } from "react";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { MdMoreVert } from "react-icons/md";

interface Props {
  menuButton?: ReactElement;
  items: {
    node: ReactNode;
    onClick: () => void;
  }[];
}

function OptionsMenu({ items, menuButton }: Props) {
  // eslint-disable-next-line no-param-reassign
  menuButton ||= (
    <button type="button">
      <MdMoreVert className="text-2xl" />
    </button>
  );
  return (
    <Menu
      menuButton={menuButton}
      menuClassName="py-2 bg-gray-2 min-w-[6rem] mr-4 shadow-md rounded-md"
    >
      {items.map(({ node, onClick }) => (
        <MenuItem onClick={onClick} className="px-4 py-1 hover:bg-gray-1">
          {node}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default OptionsMenu;
