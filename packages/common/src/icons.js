import {
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

const iconMap = [faChevronRight, faChevronLeft].reduce((map, obj) => {
  return { ...map, [obj.iconName]: obj };
}, {});

export default iconMap;
