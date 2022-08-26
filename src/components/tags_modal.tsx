import { useState, ChangeEvent } from "react";
import Modal from "./modal";
import useStore from "../lib/store";
import { Tag } from "../lib/types";

interface Props {
  selectedTags: Tag["id"][];
  onTagsChange: (tags: Tag["id"][]) => void;
  onClose: () => void;
  isOpen: boolean;
}

function TagsModal({ selectedTags, onTagsChange, onClose, isOpen }: Props) {
  const [tagName, setTagName] = useState("");
  const tags = useStore((state) => state.tags);
  const createTag = useStore((state) => state.createTag);

  const selectedTagsMap = selectedTags.reduce(
    (map, tagId) => ({
      ...map,
      [tagId]: true,
    }),
    {} as Record<string, boolean>
  );

  const handleTagNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTagName(value);
  };

  const createNewTag = () => {
    const tag = createTag({ name: tagName });
    setTagName("");
    // Add new tag to selected tags
    onTagsChange([...selectedTags, tag.id]);
  };

  const handleTagChange = (tagId: Tag["id"]) => {
    const isPreviouslySelected = selectedTagsMap[tagId];
    if (isPreviouslySelected) {
      // Remove tag from selected tags
      const filtered = selectedTags.filter((id) => id !== tagId);
      onTagsChange(filtered);
    } else {
      // Add tag to selected tag
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const tagExists = tags.find(
    (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
  );
  const tagsToShow = tags.filter((tag) =>
    tag.name.toLowerCase().startsWith(tagName.toLowerCase())
  );

  return (
    <Modal onRequestClose={onClose} isOpen={isOpen}>
      <h2 className="text-xl mb-2">Tags</h2>
      <div className="mb-2">
        <label htmlFor="tag-name" className="sr-only">
          Search or create tag
        </label>
        <input
          type="text"
          value={tagName}
          placeholder="Enter tag name"
          className="bg-transparent placeholder:text-text/80 focus:outline-none"
          onChange={handleTagNameChange}
          aria-label="Enter tag name"
        />
      </div>
      {tagName && !tagExists && (
        <button
          type="button"
          className="block w-full px-4 py-2 hover:bg-gray-1"
          onClick={createNewTag}
        >
          Create &quot;{tagName}&quot;
        </button>
      )}
      <ul>
        {tagsToShow.map((tag) => (
          <li key={tag.id} className="flex items-center py-2">
            <input
              id={tag.id}
              type="checkbox"
              className="mr-2 p-2 rounded-full hover:bg-gray-1"
              checked={!!selectedTagsMap[tag.id]}
              onChange={() => handleTagChange(tag.id)}
            />
            <label className="grow hover:bg-gray-1" htmlFor={tag.id}>
              {tag.name}
            </label>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

export default TagsModal;
