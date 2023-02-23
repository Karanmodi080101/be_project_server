exports.getChildren = (sections, givingSection) => {
  return sections.filter((section) =>
    givingSection._id.equals(section.parentId)
  );
};
