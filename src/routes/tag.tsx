import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdMenu, MdSearch } from "react-icons/md";
import toast from "react-hot-toast";

import useStore from "../lib/store";
import useDocumentTitle from "../hooks/use_document_title";
import NotePreview from "../components/note_preview";
import SideBar from "../components/sidebar";
import ResourceNotFound from "../components/resource_not_found";
import OptionsMenu from "../components/options_menu";
import ConfirmModal from "../components/confirm_modal";
import TagFormModal, { FormData } from "../components/name_form_modal";

const confirmDeleteMessage =
  "Are you sure you want to delete this tag? Only the tag will be deleted and your notes will not be deleted";

function Tag() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isTagFormOpen, setIsTagFormOpen] = useState(false);

  const { id } = useParams() as { id: string };
  const navigate = useNavigate();

  const tag = useStore((state) => state.tags.find((t) => t.id === id));
  const notes = useStore((state) =>
    state.notes.filter((n) => n.tag_ids.includes(id))
  );
  const updateTag = useStore((state) => state.updateTag);
  const deleteTag = useStore((state) => state.deleteTag);

  useDocumentTitle(`BetterNotes | ${tag?.name || "Not found"}`);

  if (!tag) return <ResourceNotFound resource="tag" />;

  const saveTag = (tagData: FormData) => {
    toast.success("Tag updated");
    updateTag({ ...tag, ...tagData });
  };

  const handleDeleteTag = () => {
    deleteTag(tag.id);
    toast.success("Tag deleted");
    navigate("/");
  };

  const toggleSideBar = () => setIsSideBarOpen((state) => !state);

  return (
    <main>
      <header className="sticky top-0 flex justify-between items-center p-6 bg-bg">
        <button type="button" className="mr-4" onClick={toggleSideBar}>
          <span className="sr-only">Menu</span>
          <MdMenu className="text-2xl" />
        </button>

        <h1 className="text-lg font-bold w-full text-center truncate">
          # {tag.name}
        </h1>

        <div className="flex items-center">
          <Link to={`/search/?tag_id=${tag.id}`} className="px-2 mr-2">
            <span className="sr-only">Search</span>
            <MdSearch className="text-2xl" />
          </Link>
          <OptionsMenu
            options={[
              { node: "Edit", onClick: () => setIsTagFormOpen(true) },
              { node: "Delete", onClick: () => setIsConfirmModalOpen(true) },
            ]}
          />
        </div>
      </header>

      <ul className="px-6 pb-6">
        {notes.map((note) => (
          <li key={note.id}>
            <NotePreview note={note} />
          </li>
        ))}
      </ul>

      {isSideBarOpen && (
        <SideBar
          isOpen={isSideBarOpen}
          handleClose={() => setIsSideBarOpen(false)}
        />
      )}

      {isTagFormOpen && (
        <TagFormModal
          defaultValues={tag}
          onSubmit={saveTag}
          onClose={() => setIsTagFormOpen(false)}
          isOpen={isTagFormOpen}
          title="Edit Tag"
        />
      )}

      <ConfirmModal
        text={confirmDeleteMessage}
        isOpen={isConfirmModalOpen}
        onConfirm={handleDeleteTag}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </main>
  );
}

export default Tag;
