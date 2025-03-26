import React from "react";
import Tag from "./tag";
import { Tag as TagType } from "@/types/product";

interface ListTagsProps {
  tags: TagType[];
}

const listTags: React.FC<ListTagsProps> = ({ tags }) => {
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

export default listTags;
