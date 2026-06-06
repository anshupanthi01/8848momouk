import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import SectionTitle from "@/components/SectionTitle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqAndCta() {
  const { t } = useTranslation("home")

  return (
    <>
      {/* FAQ (interactive) */}
      <section className="max-w-4xl px-4 mx-auto py-14">
        <SectionTitle kicker={t("faq.kicker")} title={t("faq.title")} />
        <div className="p-4 mt-8 bg-white border border-black/10 md:p-6">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("faq.items.0.q")}</AccordionTrigger>
              <AccordionContent>{t("faq.items.0.a")}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>{t("faq.items.1.q")}</AccordionTrigger>
              <AccordionContent>{t("faq.items.1.a")}</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>{t("faq.items.2.q")}</AccordionTrigger>
              <AccordionContent>{t("faq.items.2.a")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl px-4 pt-4 pb-20 mx-auto">
        <div className="p-8 bg-white border border-black/10 md:p-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="text-xs font-extrabold tracking-[0.3em] text-[#de1d3d]">
                {t("cta.kicker")}
              </div>
              <div className="mt-2 text-2xl font-black text-[#21408e] md:text-3xl">
                {t("cta.title")}
              </div>
              <div className="mt-2 text-sm font-medium text-[#21408e]/70">
                {t("cta.subtitle")}
              </div>
            </div>

            <Button className="h-11 w-full bg-[#de1d3d] px-10 font-extrabold tracking-wide hover:bg-[#c51625] md:w-auto">
              {t("cta.button")}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
