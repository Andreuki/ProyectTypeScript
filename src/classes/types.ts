export type Province = {
  id: number;
  name: string;
};

export type Town = {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  province: Province;
};

export type Property = {
  id?: number; 
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  mainPhoto: string;
  createdAt?: string; 
  status?: string;   
  town: Town;
};