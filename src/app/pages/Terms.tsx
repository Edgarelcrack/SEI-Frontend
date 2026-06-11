import type { ReactNode } from "react";
import { Link } from "react-router";
import { PageTitle } from "../components/PageTitle";

function LegalBlock({ num, title, children }: { num: string; title: string; children: ReactNode }) {
  return (
    <section className="dark:border-white/10 border-black/10 border-t py-10">
      <div className="grid md:grid-cols-[140px_1fr] gap-4 md:gap-10">
        <div className="font-mono text-sm tracking-widest text-[#E31E24]">/{num}</div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-4">{title}</h2>
          <div className="space-y-4 text-zinc-500 font-light leading-relaxed">{children}</div>
        </div>
      </div>
    </section>
  );
}

// TODO: completar razón social y NIT de SEI cuando estén definidos.
export function Terms() {
  return (
    <div className="bg-background min-h-screen text-foreground pt-40 pb-24 px-6 lg:px-12 transition-colors duration-300">
      <PageTitle
        title="Términos y Condiciones"
        description="Términos y condiciones de uso del sitio web de SEI."
      />

      <div className="max-w-[1000px] mx-auto">
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.35em] uppercase text-[#1B56D2] mb-6">
            Legal // Condiciones de uso
          </div>
          <h1 className="text-[14vw] sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
            TÉRMINOS<span className="text-[#E31E24]">.</span>
          </h1>
          <p className="font-mono text-xs tracking-widest uppercase text-zinc-500">
            Última actualización: 9 de junio de 2026
          </p>
        </div>

        <LegalBlock num="01" title="Aceptación">
          <p>
            Al acceder y navegar el sitio web sei-sistemas.com («el Sitio»), operado por SEI desde
            Cali, Colombia, aceptas estos Términos y Condiciones. Si no estás de acuerdo con ellos,
            te pedimos abstenerte de usar el Sitio.
          </p>
        </LegalBlock>

        <LegalBlock num="02" title="Uso del sitio">
          <p>
            El Sitio tiene fines informativos y comerciales: presentar nuestras plataformas y
            servicios de ingeniería de software. Te comprometes a usarlo de manera lícita, sin
            intentar vulnerar su seguridad, interferir con su funcionamiento ni extraer su contenido
            de forma automatizada sin autorización.
          </p>
        </LegalBlock>

        <LegalBlock num="03" title="Propiedad intelectual">
          <p>
            La marca SEI, los logotipos, el diseño del Sitio, su código y sus contenidos son
            propiedad de SEI o se usan bajo licencia, y están protegidos por las normas de propiedad
            intelectual de Colombia. No se permite su reproducción o uso comercial sin autorización
            previa y escrita.
          </p>
        </LegalBlock>

        <LegalBlock num="04" title="Información de productos y servicios">
          <p>
            Las descripciones, características, métricas y precios de las plataformas publicadas en
            el Sitio tienen carácter informativo y no constituyen una oferta vinculante. Las
            condiciones específicas de cada proyecto o licencia se acuerdan en la propuesta o el
            contrato correspondiente.
          </p>
        </LegalBlock>

        <LegalBlock num="05" title="Enlaces y servicios de terceros">
          <p>
            El Sitio contiene enlaces y contenido incrustado de terceros (WhatsApp, YouTube, entre
            otros). SEI no controla ni se hace responsable de sus contenidos, disponibilidad o
            políticas. El uso de esos servicios se rige por sus propios términos.
          </p>
        </LegalBlock>

        <LegalBlock num="06" title="Limitación de responsabilidad">
          <p>
            SEI procura que la información del Sitio sea precisa y esté actualizada, pero no
            garantiza la ausencia de errores ni la disponibilidad ininterrumpida del Sitio. En la
            máxima medida permitida por la ley, SEI no será responsable por daños derivados del uso
            o la imposibilidad de uso del Sitio.
          </p>
        </LegalBlock>

        <LegalBlock num="07" title="Privacidad">
          <p>
            El tratamiento de los datos personales recolectados a través del Sitio se rige por
            nuestra{" "}
            <Link to="/privacidad" className="text-[#1B56D2] hover:text-[#E31E24] transition-colors font-medium">
              Política de Privacidad
            </Link>
            , conforme a la Ley 1581 de 2012.
          </p>
        </LegalBlock>

        <LegalBlock num="08" title="Ley aplicable y modificaciones">
          <p>
            Estos términos se rigen por las leyes de la República de Colombia y cualquier
            controversia se someterá a los jueces competentes de Cali. SEI puede modificar estos
            términos en cualquier momento; la versión vigente será la publicada en esta página.
          </p>
        </LegalBlock>
      </div>
    </div>
  );
}
