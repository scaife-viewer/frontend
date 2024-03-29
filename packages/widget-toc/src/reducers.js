const tocReducer = (data, query) => {
  const lenses = { getLabel: obj => obj.label, getUri: obj => obj.uri };
  return {
    ...data,
    items: data.items.filter(obj =>
      Object.values(lenses)
        .map(lens =>
          lens(obj)
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .some(Boolean),
    ),
  };
};

export default { tocReducer };
