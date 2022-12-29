export function ArrayFieldTitle({ TitleField, idSchema, title, required }: any) {
  if (!title) {
    return null;
  }
  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} required={required} />;
}