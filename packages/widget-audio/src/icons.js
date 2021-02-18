import { faVolumeUp, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const iconMap = [faVolumeUp, faPlay, faPause].reduce((map, obj) => {
  return {
    ...map,
    [obj.iconName]: obj,
  };
}, {});

export default iconMap;
