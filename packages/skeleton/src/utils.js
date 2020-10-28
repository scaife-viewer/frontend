const displayName = (name, $root) => {
  // NOTE: Passing the root instance in allows
  // callables to access $scaife, $store, etc

  // https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-the-Root-Instance
  const isCallable = typeof name === 'function';
  return isCallable ? name($root) : name;
};

export default {
  displayName,
};
