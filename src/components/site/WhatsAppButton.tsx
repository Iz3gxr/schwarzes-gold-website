import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/4915567167624?text=Hallo%2C%20ich%20ben%C3%B6tige%20ein%20Angebot%20f%C3%BCr%20LKW-Reifen."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-[var(--shadow-gold-strong)] pulse-ring hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-background" strokeWidth={2.5} />
    </a>
  );
}
