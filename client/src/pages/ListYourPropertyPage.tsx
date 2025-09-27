import AdminHeader from "@/components/admin/AdminHeader";
import {
  HeroSection,
  HostWorryFreeSection,
  PaymentsSection,
  SimpleToBeginSection,
  GlobalCustomerSection,
  TestimonialsSection,
  FAQSection,
  FooterSection,
} from "@/components/listYourProperty";

export default function ListYourPropertyPage() {
  return (
    <>
      <AdminHeader />
      <main>
        <HeroSection />
        <HostWorryFreeSection />
        <PaymentsSection />
        <SimpleToBeginSection />
        <GlobalCustomerSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <FooterSection />
    </>
  );
}
