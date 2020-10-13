import { faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const iconMap = [faUser, faMapMarkerAlt].reduce((map, obj) => {
  return {
    ...map,
    [obj.iconName]: obj,
  };
}, {});

export default iconMap;
