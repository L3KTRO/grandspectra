export interface Occupation {
  id: number;
  name: string;
  position: number;
}

export enum OccupationEnum {
  Creator = 1,
  Director,
  Writer,
  Producer,
  Composer,
  Cinematographer,
  Editor,
  ProductionDesigner,
  ArtDirector,
  Actor
}

namespace Occupation {
  export function getDisplayName(occupation: OccupationEnum): string {
    return OccupationEnum[occupation]; // Devuelve el nombre de la propiedad como string
  }

  // También puedes añadir nombres personalizados si lo prefieres
  const displayNames: Record<OccupationEnum, string> = {
    [OccupationEnum.Creator]: "Creador",
    [OccupationEnum.Director]: "Director",
    [OccupationEnum.Writer]: "Guionista",
    [OccupationEnum.Producer]: "Productor",
    [OccupationEnum.Composer]: "Compositor",
    [OccupationEnum.Cinematographer]: "Director de fotografía",
    [OccupationEnum.Editor]: "Editor",
    [OccupationEnum.ProductionDesigner]: "Diseñador de producción",
    [OccupationEnum.ArtDirector]: "Director de arte",
    [OccupationEnum.Actor]: "Actor"
  };
}
