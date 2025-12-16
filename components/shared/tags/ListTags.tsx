import React from "react";
import Tag from "./Tag";
import { Tag as TagType } from "@/lib/types/product";

interface ListTagsProps {
  tags: TagType[];
}

const ListTags = ({ tags }: ListTagsProps) => {
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
