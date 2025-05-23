import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How long do I have access to the courses?",
    answer:
      "You have lifetime access to all courses you purchase. This includes all future updates and additional materials that may be added to the course over time.",
  },
  {
    question: "Do you offer any certifications?",
    answer:
      "Yes, upon completion of each course, you'll receive a certificate that you can share on your LinkedIn profile or with potential employers to showcase your skills.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, you can request a full refund within 30 days of enrollment.",
  },
  {
    question: "Are there any prerequisites for the courses?",
    answer:
      "Prerequisites vary by course. Beginner courses typically have no prerequisites, while intermediate and advanced courses may require some prior knowledge or experience. Each course page clearly lists any prerequisites.",
  },
  {
    question: "How do the mock interviews work?",
    answer:
      "Our mock interviews are conducted by industry professionals who have experience hiring at top companies. You'll receive detailed feedback on your performance and specific areas for improvement.",
  },
  {
    question: "Do you offer any job placement assistance?",
    answer:
      "Yes, we have a career services team that helps students with resume reviews, portfolio development, and job search strategies. We also have partnerships with companies that regularly hire our graduates.",
  },
]

export default function FAQ() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-24 md:py-32" id="faq">
      <div className="container">
        <div className="mx-auto max-w-[58rem] text-center mb-16">
          <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Find answers to common questions about our platform and courses.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
