export interface Province {
  id: number;
  name: string;
}

export interface Town {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  province: Province;
}

export interface Property extends PropertyInsert {
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
}

export interface PropertyInsert {
  address: string;
  title: string;
  description: string;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  price: number;
  townId: number;
  mainPhoto: string;
  createdAt?: string;
  status?: string;
  town: Town;
}
