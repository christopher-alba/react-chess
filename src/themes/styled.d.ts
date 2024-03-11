// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    name: string;
    colors: {
      primary1: string;
      primary2: string;
      secondary1: string;
      secondary2: string;
      secondary3: string;
      tertiary1: string;
      tertiary1Hover: string;
      tertiary2: string;
      tertiaryMain: string;
      tertiaryMainOffset: string;
    };
  }
}
