import React from "react";
import Tag from "./Tag";
import { Tag as TagType } from "@/types/product";

interface ListTagsProps {
  tags: TagType[];
}

const ListTags: React.FC<ListTagsProps> = ({ tags }) => {
  return (
    <div className="flex gap-2">
      {tags.map((tag) => (
        <Tag
          key={tag._key}
          type={tag.type as "discount" | "new" | "limited" | "default"}
          label={tag.label}
        />
      ))}
    </div>
  );
};

export default ListTags;
