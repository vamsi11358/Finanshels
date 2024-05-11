import { create } from 'zustand'
const useStore = create((set) => ({
    cartData: [{
        id: 1,
        name: '',
        href: '#',
        color: '',
        price: '',
        quantity: 1,
        imageSrc: '',
        imageAlt: '', }],
    updateCartData: (newData) => set({ cartData: newData }),
    totalCost: '',
    updateTotalCost: (newCost) => set({ totalCost: newCost }),
  }));
  
  export default useStore;