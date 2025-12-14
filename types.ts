export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ServiceItem {
  category: string;
  items: {
    name: string;
    price: string;
    description?: string;
  }[];
}

export interface ContactInfo {
  phone: string;
  website: string;
  kmongText: string;
}