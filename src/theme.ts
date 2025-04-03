//mypreset.ts
import {definePreset} from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const preset = definePreset(Aura, {
  components: {
    toggleswitch: {
      colorScheme: {
        dark: {
          root: {
            checkedBackground: '{amber.100}',
            checkedHoverBackground: '{amber.100}',
            uncheckedBackground: '{amber.100}',
          }
        }
      }
    }
  }
});

export default preset;
