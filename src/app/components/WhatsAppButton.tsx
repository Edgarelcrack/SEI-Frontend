import { useLocation } from "react-router";
import { getSoftwareById } from "../data/software";

const WHATSAPP_NUMBER = "573127824123";
const WHATSAPP_MESSAGE = "Hola SEI, estoy interesado en sus servicios de software. ¿Podrían brindarme más información?";

export function WhatsAppButton() {
  const { pathname } = useLocation();

  // En la página de una plataforma, el mensaje llega prellenado con su nombre.
  const match = pathname.match(/^\/software\/([^/]+)/);
  const software = match ? getSoftwareById(decodeURIComponent(match[1])) : undefined;
  const message = software
    ? `Hola SEI, estoy interesado en la plataforma ${software.name}. ¿Podrían brindarme más información?`
    : WHATSAPP_MESSAGE;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        software
          ? `Chatea por WhatsApp sobre ${software.name}`
          : "Chatea con nosotros por WhatsApp"
      }
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
    >
      <svg
        viewBox="0 0 32 32"
        className="relative h-7 w-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.744 3.05 9.38L1.05 31.32l6.124-1.96A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.824 32 16S24.826 0 16.004 0zm9.31 22.594c-.386 1.09-1.918 1.994-3.14 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826s1.204-3.426 1.63-3.894c.354-.388.94-.564 1.5-.564.18 0 .344.008.49.016.43.018.646.044.93.726.354.85 1.214 2.95 1.318 3.166.106.216.176.468.034.778-.134.31-.252.45-.466.694-.214.244-.408.434-.622.694-.196.234-.418.486-.17.916.248.42 1.106 1.824 2.374 2.954 1.636 1.456 2.99 1.908 3.466 2.124.354.156.778.122 1.06-.186.354-.388.788-1.032 1.232-1.67.314-.456.71-.512 1.12-.36.418.146 2.65 1.25 3.106 1.476.456.226.756.336.866.526.108.196.108 1.108-.278 2.198z" />
      </svg>
    </a>
  );
}
