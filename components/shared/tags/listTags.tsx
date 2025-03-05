import React from "react";
import Tag from "./tag";

const listTags = ({ tags }) => {
  return (
    <div className="flex gap-2">
      {tags.map((tag, index) => (
        <Tag key={index} type={tag.type} label={tag.label} />
      ))}
    </div>
  );
};

export default listTags;
