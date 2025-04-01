export const temperatureTable: Record<string, number[]> = {
    air_pvc: [
      1.34, 1.29, 1.22, 1.15, 1.08, 1, 0.91, 0.82, 0.7, 0.57, 0, 0, 0, 0
    ],
    air_xlpe: [
      1.23, 1.19, 1.14, 1.1, 1.05, 1, 0.96, 0.9, 0.84, 0.78, 0.71, 0.64, 0.55, 0.45
    ],
    ground_pvc: [
      1.18, 1.12, 1.07, 1, 0.94, 0.87, 0.8, 0.71, 0.62, 0.51, 0, 0, 0, 0    
    ],
    ground_xlpe: [
      1.12, 1.08, 1.03, 1, 0.96, 0.91, 0.86, 0.82, 0.76, 0.7, 0.65, 0.57, 0.49, 0.41  
    ],
};

export const temperatureRange = [15, 20, 25, 30, 35, 40, 45, 50 , 55, 60, 65, 70, 75, 80];

export const convertInstallation = (installation: number): string => {
  if(installation == 6 || installation == 7 ){
    return 'ground'
  }else {
    return 'air'
  }
}


export const findingTempFactor = (temperature:number, tempStringTable:string) => {
  const table = temperatureTable[tempStringTable] ?? [];
  const index = temperatureRange.findIndex((value) => value >= temperature);
  if(index == -1){
    return 0
  }
  return table[index];
}

 const tableBranchCircuitFactor: Record<number,number> = {
  1 : 1,
  2 : 0.8,
  3: 0.7,
  4: 0.65,
  5: 0.6,
  6: 0.57,
  7: 0.54,
  8: 0.52,
  9: 0.50,
  12: 0.45,
  16: 0.41,
  20: 0.38
}


export const branchCircuitFactor = (numberBranch: number) => { 
  const key = Object.keys(tableBranchCircuitFactor);
  for(let i = 0 ; i <= key.length -1 ; i++){
    if(Number(key[i]) == numberBranch){
      return tableBranchCircuitFactor[Number(key[i])]
    }else if(Number(key[i + 1]) >= numberBranch){
      return tableBranchCircuitFactor[Number(key[i + 1])]
    }
  }
  return 0
}