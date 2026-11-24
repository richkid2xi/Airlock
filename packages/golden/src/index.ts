// TODO: typed loader for golden vectors
export interface GoldenVector {
  name: string;
  policy: any;
  simulatedEffects: any;
  expectedVerdict: any;
  expectedRule?: string;
}

export const loadGoldenVectors = (): GoldenVector[] => {
  // TODO: implement loader
  return [];
};
