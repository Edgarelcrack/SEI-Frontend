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
export function Privacy() {
  return (
    <div className="bg-background min-h-screen text-foreground pt-40 pb-24 px-6 lg:px-12 transition-colors duration-300">
      <PageTitle
        title="Política de Privacidad"
        description="Política de tratamiento de datos personales de SEI conforme a la Ley 1581 de 2012 de Colombia."
      />

      <div className="max-w-[1000px] mx-auto">
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.35em] uppercase text-[#1B56D2] mb-6">
            Legal // Ley 1581 de 2012
          </div>
          <h1 className="text-[14vw] sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-6">
            PRIVACIDAD<span className="text-[#E31E24]">.</span>
          </h1>
          <p className="font-mono text-xs tracking-widest uppercase text-zinc-500">
            Última actualización: 9 de junio de 2026
          </p>
        </div>

        <LegalBlock num="01" title="Responsable del tratamiento">
          <p>
            SEI («el Responsable»), con domicilio en Cali, Colombia, es responsable del tratamiento
            de los datos personales recolectados a través del sitio web sei-sistemas.com, conforme a
            la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas que los modifiquen o complementen.
          </p>
          <p>
            Canal de contacto: WhatsApp +57 319 409 7857 y los demás canales publicados en este sitio web.
          </p>
        </LegalBlock>

        <LegalBlock num="02" title="Datos que recolectamos">
          <p>
            Recolectamos únicamente los datos que nos entregas de forma voluntaria al contactarnos:
            nombre, empresa, correo electrónico, número de contacto y el contenido de tu mensaje,
            ya sea a través del formulario del sitio o de WhatsApp.
          </p>
          <p>
            Este sitio no utiliza cookies propias de rastreo ni herramientas de publicidad
            comportamental. Los servicios de terceros incrustados (ver sección 06) pueden recopilar
            datos técnicos según sus propias políticas.
          </p>
        </LegalBlock>

        <LegalBlock num="03" title="Finalidades del tratamiento">
          <ul className="list-disc pl-5 space-y-2">
            <li>Atender y responder tus solicitudes de información o cotización.</li>
            <li>Gestionar la relación comercial y precontractual contigo o con tu empresa.</li>
            <li>Enviarte información sobre nuestros servicios cuando la hayas solicitado.</li>
            <li>Cumplir obligaciones legales, contables y regulatorias.</li>
          </ul>
        </LegalBlock>

        <LegalBlock num="04" title="Derechos del titular">
          <p>Como titular de tus datos personales, la ley te garantiza el derecho a:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Conocer, actualizar y rectificar tus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada para su tratamiento.</li>
            <li>Ser informado sobre el uso que se les ha dado.</li>
            <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
            <li>
              Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por
              infracciones al régimen de protección de datos.
            </li>
          </ul>
        </LegalBlock>

        <LegalBlock num="05" title="Cómo ejercer tus derechos">
          <p>
            Puedes ejercer tus derechos enviando tu solicitud por cualquiera de los canales de
            contacto publicados en este sitio. Las consultas se responderán en un término máximo de
            diez (10) días hábiles y los reclamos en un término máximo de quince (15) días hábiles,
            conforme a la ley.
          </p>
        </LegalBlock>

        <LegalBlock num="06" title="Terceros y transferencias">
          <p>
            Este sitio enlaza o incrusta servicios de terceros — WhatsApp (Meta), YouTube (Google),
            Google Fonts y proveedores de imágenes — que pueden tratar datos técnicos bajo sus
            propias políticas de privacidad. No vendemos ni cedemos tus datos personales a terceros
            con fines comerciales.
          </p>
        </LegalBlock>

        <LegalBlock num="07" title="Seguridad y vigencia">
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger tus datos contra
            acceso, uso o divulgación no autorizados. Los datos se conservan mientras exista una
            relación comercial o una obligación legal que lo exija.
          </p>
          <p>
            Esta política puede actualizarse; la versión vigente estará siempre publicada en esta
            página. Consulta también nuestros{" "}
            <Link to="/terminos" className="text-[#1B56D2] hover:text-[#E31E24] transition-colors font-medium">
              Términos y Condiciones
            </Link>
            .
          </p>
        </LegalBlock>
      </div>
    </div>
  );
}
