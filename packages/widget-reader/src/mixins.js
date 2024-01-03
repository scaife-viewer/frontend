import { MODULE_NS } from '@scaife-viewer/store';

const RTL_LANGUAGES = new Set(['far', 'ara']);

const PassageLanguageIsRtlMixin = {
  computed: {
    passageIsRtl() {
      const rtlLanguages = this.$scaife.config.rtlLanguages || RTL_LANGUAGES;
      const metadata = this.$store.getters[`${MODULE_NS}/metadata`];
      return metadata && rtlLanguages.has(metadata.lang);
    },
  },
};

export default PassageLanguageIsRtlMixin;
