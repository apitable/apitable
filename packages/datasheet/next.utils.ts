export function getServerSideProps(context) {
  const spaceId = context.query.spaceId;
  const [path, query] = context.resolvedUrl.split('?');
  if(spaceId) {
    const search = new URLSearchParams(query);
    search.delete('spaceId');
    const queryStr = search.toString();
    return {
      redirect: {
        destination: path + (queryStr ? `?${queryStr}` : ''),
        permanent: false,
      }
    };
  }
  return {
    props: {}
  };
}