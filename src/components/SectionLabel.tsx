import React from "react";

interface SectionLabelProps {
  text: string;
}

const SectionLabel = ({ text }: SectionLabelProps) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="h-px bg-beige-dark flex-grow"></div>
    <span className="text-xs font-bold uppercase tracking-[0.4em] text-text-mid whitespace-nowrap">
      {text}
    </span>
    <div className="h-px bg-beige-dark flex-grow"></div>
  </div>
);

export default SectionLabel;
