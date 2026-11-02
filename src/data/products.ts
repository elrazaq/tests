import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: '無線藍牙耳機', price: 2999, stepMultiple: 1, category: 'Audio' },
  { id: 2, name: '智慧手錶', price: 8999, stepMultiple: 1, category: 'Wearable' },
  { id: 3, name: '便攜式充電器', price: 1299, stepMultiple: 1, category: 'Power' },
  { id: 4, name: '無線滑鼠', price: 899, stepMultiple: 1, category: 'Accessory' },
  { id: 5, name: '機械鍵盤', price: 3999, stepMultiple: 1, category: 'Accessory' },
  { id: 6, name: '網路攝影機', price: 2199, stepMultiple: 1, category: 'Video' },
  { id: 7, name: 'USB隨身碟 (5入裝)', price: 599, stepMultiple: 5, category: 'Storage', badge: 'Kelipatan 5' },
  { id: 8, name: '桌面擴音器 (雙聲道組)', price: 1599, stepMultiple: 2, category: 'Audio', badge: 'Kelipatan 2' },
];

