import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import TrustSection from '../components/TrustSection';
import PricingSection from '../components/PricingSection';
import CostCalculator from '../components/CostCalculator';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import FAQ from '../components/FAQ';

const Home = () => (
    <div className="transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
        <HeroSection />
        <ServicesSection />
        <HowItWorks />
        <TrustSection />
        {/* Pricing packages first, then custom estimator right below */}
        <PricingSection />
        <CostCalculator />
        <Portfolio />
        <Testimonials />
        <div id="faq">
            <FAQ />
        </div>
        <ContactSection />
    </div>
);

export default Home;
