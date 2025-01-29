export interface Make {
  MakeId: string;
  MakeName: string;
}

export interface MakeAndYear {
  make: string;
  year: string;
}

export interface FetchMakesResponse {
  Results: Make[];
}

export interface Model {
  Model_ID: string;
  Model_Name: string;
}
