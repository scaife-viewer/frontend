import PassageCitationTOCWidget, {
  displayNameCallback,
} from './PassageCitationTOCWidget.vue';

export default PassageCitationTOCWidget;

// NOTE: exporting `displayNameCallback` allows us to shim the
// dynamic display name functionality into SV 1
export { displayNameCallback };
