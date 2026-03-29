import { create } from 'zustand';

interface UIState {
  cartOpen: boolean;
  cartStep: 0 | 1 | 2;
  bookingEventId: string | null;
  bookingStep: 0 | 1 | 2 | 3;
  selectedPackageId: string | null;
  bookingDietary: string[];
  hireModalOpen: boolean;
  mobileMenuOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  setCartStep: (step: 0 | 1 | 2) => void;
  openBooking: (eventId: string) => void;
  closeBooking: () => void;
  setBookingStep: (step: 0 | 1 | 2 | 3) => void;
  selectPackage: (packageId: string) => void;
  toggleDietary: (label: string) => void;
  openHireModal: () => void;
  closeHireModal: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  cartStep: 0,
  bookingEventId: null,
  bookingStep: 0,
  selectedPackageId: null,
  bookingDietary: [],
  hireModalOpen: false,
  mobileMenuOpen: false,

  openCart: () => set({ cartOpen: true, cartStep: 0 }),
  closeCart: () => set({ cartOpen: false }),
  setCartStep: (step) => set({ cartStep: step }),

  openBooking: (eventId) =>
    set({
      bookingEventId: eventId,
      bookingStep: 0,
      selectedPackageId: null,
      bookingDietary: [],
    }),
  closeBooking: () => set({ bookingEventId: null }),
  setBookingStep: (step) => set({ bookingStep: step }),
  selectPackage: (packageId) => set({ selectedPackageId: packageId }),
  toggleDietary: (label) =>
    set((state) => ({
      bookingDietary: state.bookingDietary.includes(label)
        ? state.bookingDietary.filter((d) => d !== label)
        : [...state.bookingDietary, label],
    })),

  openHireModal: () => set({ hireModalOpen: true }),
  closeHireModal: () => set({ hireModalOpen: false }),

  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}));
