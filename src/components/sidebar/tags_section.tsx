// TODO: The collection section component is very simialr to this file find
// a way to extract the components from the files
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdTag, MdExpandMore } from "react-icons/md";
import clsx from "clsx";
import useStore from "../../lib/store";

interface Props {
  closeSidebar: () => void;
}
function TagSection({ closeSidebar }: Props) {
  const [isTagSectionOpen, setIsTagSectionOpen] = useState(false);

  const tags = useStore((state) => state.tags);

  const toggleTagSection = () => setIsTagSectionOpen((state) => !state);

  return (
    <section className="py-2 border-b">
      <h2><button
          type="button"
          onClick={toggleTagSection}
          className="font-bold px-6 py-3 flex justify-between items-center w-full hover:bg-gray-1"
        >
          Tags{" "}
          <MdExpandMore
            className={clsx("text-lg", {
              "rotate-180": isTagSectionOpen,
            })}
          />
        </button>
      </h2>

      {isTagSectionOpen && (
        <ul className="flex flex-col">
          {tags.map((tag) => (
            <li key={tag.id}>
              <Link
                className="flex items-center py-3 px-6 hover:bg-gray-1"
                to={`/tags/${tag.id}`}
                onClick={closeSidebar}
              >
                <MdTag className="text-lg mr-3" />
                <span className="w-full truncate">{tag.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TagSection;
