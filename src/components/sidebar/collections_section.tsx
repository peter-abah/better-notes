import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdAdd, MdFolder, MdExpandMore } from "react-icons/md";
import clsx from "clsx";
import toast from "react-hot-toast";
import CollectionFormModal, { FormData } from "../name_form_modal";
import useStore from "../../lib/store";

interface Props {
  closeSidebar: () => void;
}
function CollectionsSection({ closeSidebar }: Props) {
  const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);
  const [isCollectionSectionOpen, setIsCollectionSectionOpen] = useState(true);

  const createCollection = useStore((state) => state.createCollection);
  const collections = useStore((state) => state.collections);

  const navigate = useNavigate();

  const toggleCollectionSection = () =>
    setIsCollectionSectionOpen((state) => !state);

  const saveCollection = (data: FormData) => {
    const collection = createCollection(data);
    toast.success("Collection created");
    closeSidebar();
    navigate(`/collections/${collection.id}`);
  };

  return (
    <section className="py-2 border-y">
      <h2>
        <button
          type="button"
          onClick={toggleCollectionSection}
          className="font-bold px-6 py-3 flex justify-between items-center w-full hover:bg-gray-1"
        >
          Collections{" "}
          <MdExpandMore
            className={clsx("text-lg", {
              "rotate-180": isCollectionSectionOpen,
            })}
          />
        </button>
      </h2>

      {isCollectionSectionOpen && (
        <ul className="flex flex-col">
          {collections.map((collection) => (
            <li key={collection.id}>
              <Link
                className="flex items-center py-3 px-6 hover:bg-gray-1"
                to={`/collections/${collection.id}`}
                onClick={closeSidebar}
              >
                <MdFolder className="text-lg mr-3" />
                <span className="w-full truncate">{collection.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="flex items-center px-6 py-3 hover:bg-gray-1"
        onClick={() => setIsCollectionFormOpen(true)}
      >
        <MdAdd className="text-lg mr-3" />
        Add new collection
      </button>

      {isCollectionFormOpen && (
        <CollectionFormModal
          title="Create collection"
          onSubmit={saveCollection}
          isOpen={isCollectionFormOpen}
          onClose={() => setIsCollectionFormOpen(false)}
        />
      )}
    </section>
  );
}

export default CollectionsSection;
