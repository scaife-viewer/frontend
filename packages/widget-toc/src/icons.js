import { faEye, faEyeSlash, faHome } from '@fortawesome/free-solid-svg-icons';

const iconMap = [faEye, faEyeSlash, faHome].reduce((map, obj) => {
  return { ...map, [obj.iconName]: obj };
}, {});

export default iconMap;
