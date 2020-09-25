import {
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHome,
  faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons';

const iconMap = [
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHome,
  faWindowMaximize,
].reduce((map, obj) => {
  return {...map, [obj.iconName]: obj};
}, {});

export default iconMap;
