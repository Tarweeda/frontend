import { Hero } from '../components/home/Hero';
import { Pillars } from '../components/home/Pillars';
import { Story } from '../components/home/Story';
import { ShopSection } from '../components/shop/ShopSection';
import { CateringSection } from '../components/catering/CateringSection';
import { SupperSection } from '../components/supper-club/SupperSection';
import { HireSection } from '../components/hire/HireSection';
import { HampersSection } from '../components/hampers/HampersSection';
import { Values } from '../components/home/Values';
import { Contact } from '../components/home/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <Story />
      <ShopSection />
      <CateringSection />
      <SupperSection />
      <HireSection />
      <HampersSection />
      <Values />
      <Contact />
    </>
  );
}
