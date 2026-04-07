import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const bounce: Variants = {
  initial: { scale: 0.9 },
  animate: { 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
};

export const springTransition: any = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const kineticHover: any = {
  y: -4,
  scale: 1.02,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 17,
  },
};

export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }
};

export const checkboxVariants: Variants = {
  unchecked: { scale: 1 },
  checked: { 
    scale: [1, 1.2, 1],
    transition: { duration: 0.2 }
  }
};
