"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "sq" | "en";

const t = {
  sq: {
    // Nav
    nav_home: "Kreu",
    nav_products: "Produktet",
    nav_services: "Shërbimet",
    nav_about: "Rreth nesh",
    nav_contact: "Kontakt",
    nav_cta: "Na kontakto",
    // Hero
    hero_label: "Sisteme Sigurie & Teknologji",
    hero_h1_1: "Mbroni çdo gjë",
    hero_h1_2: "që ka rëndësi.",
    hero_sub: "Kamera sigurie, sisteme alarmi, rrjeta fiber optike dhe infrastrukturë IT — instalim profesional në të gjithë Kosovën.",
    hero_cta_primary: "Shiko produktet",
    hero_cta_secondary: "Na kontakto",
    hero_trust_1: "Mbi 1,000 instalime",
    hero_trust_2: "Garanci direkte nga prodhuesi",
    hero_trust_3: "Mbështetje 24/7",
    // Stats
    stat_cameras: "Kamera të instaluara",
    stat_projects: "Projekte të përfunduara",
    stat_support: "Mbështetje teknike",
    stat_uptime: "Besueshmëri e sistemit",
    // Services
    services_label: "Shërbime",
    services_h2: "Zgjidhje të plota sigurie dhe teknologjie",
    services_sub: "Nga kamera deri te rrjetat — ne projektojmë, instalojmë dhe mirëmbajmë çdo gjë.",
    svc_cctv_title: "Video Mbikëqyrje",
    svc_cctv_desc: "Kamera IP me rezolucion të lartë, sisteme NVR dhe mbikëqyrje 24/7 për bizneset dhe shtëpitë tuaja.",
    svc_alarm_title: "Sisteme Alarmi",
    svc_alarm_desc: "Sisteme alarmi inteligjente me sensor lëvizjeje, detektim tymi dhe njoftim të menjëhershëm.",
    svc_fiber_title: "Fiber Optike",
    svc_fiber_desc: "Instalim dhe mirëmbajtje e rrjetave fiber optike FTTH me shpejtësi të lartë dhe besueshmëri maksimale.",
    svc_network_title: "Infrastrukturë Rrjeti",
    svc_network_desc: "Ndërtim i infrastrukturës së rrjetit, switch-a, router-a dhe sisteme Wi-Fi enterprise.",
    svc_it_title: "Shërbime IT",
    svc_it_desc: "Mirëmbajtje e sistemeve IT, konfigurimi i serverëve dhe mbështetje teknike e vazhdueshme.",
    svc_maint_title: "Mirëmbajtje",
    svc_maint_desc: "Kontrata mirëmbajtjeje për sisteme sigurie dhe rrjeta — parandalim dhe riparim i shpejtë.",
    svc_learn: "Mëso më shumë",
    // Products
    products_label: "Produktet tona",
    products_h2: "Pajisje të certifikuara nga liderët botërorë",
    products_sub: "Shitës i autorizuar i Tiandy, Dahua dhe TVT në Kosovë.",
    hero_partner_seller: "Shitës partner i Tiandy, Dahua dhe TVT në Kosovë.",
    products_see_all: "Shiko të gjitha produktet",
    products_buy: "Bli tani",
    products_filter: "Filtro",
    products_sort: "Rendit",
    products_sort_default: "Parazgjedhje",
    products_sort_asc: "Çmimi: Ulët – Lartë",
    products_sort_desc: "Çmimi: Lartë – Ulët",
    products_showing: "Produkte",
    products_in_stock: "Në stok",
    products_out_of_stock: "Jashtë stokut",
    products_cat_all: "Të gjitha",
    products_filter_price: "Çmimi",
    products_filter_cat: "Kategoria",
    products_clear: "Fshi filtrat",
    products_no_results: "Nuk u gjet asnjë produkt.",
    // Brands
    brands_label: "Partnerët tanë",
    brands_h2: "Punojmë me liderët e industrisë",
    // CTA
    cta_h2: "Gati të siguroni biznesin tuaj?",
    cta_sub: "Merrni konsultim falas dhe ofertë të personalizuar nga ekipi ynë.",
    cta_primary: "Merrni ofertë falas",
    cta_phone: "Na telefononi",
    // Contact
    contact_label: "Kontakt",
    contact_h1: "Le të flasim.",
    contact_sub: "Gati për konsultim falas? Na kontaktoni me telefon, WhatsApp ose formularin më poshtë.",
    contact_name: "Emri i plotë",
    contact_email: "Email",
    contact_phone: "Telefon",
    contact_subject: "Tema",
    contact_message: "Mesazhi",
    contact_send: "Dërgo mesazhin",
    contact_success_h: "Mesazhi u dërgua!",
    contact_success_sub: "Do t'ju kthehemi brenda 2 orëve. Për çështje urgjente, na telefononi direkt.",
    contact_subject_cctv: "Kamera CCTV / Mbikëqyrje",
    contact_subject_alarm: "Sistem Alarmi",
    contact_subject_fiber: "Fiber Optike",
    contact_subject_network: "Infrastrukturë Rrjeti",
    contact_subject_maint: "Kontratë Mirëmbajtjeje",
    contact_subject_other: "Tjetër",
    contact_info_phone: "Telefon",
    contact_info_email: "Email",
    contact_info_location: "Vendndodhja",
    contact_info_whatsapp: "WhatsApp",
    // About
    about_label: "Rreth nesh",
    about_h1: "Teknologji që mbron.",
    about_sub: "Quantic SHPK është kompania lider e teknologjisë dhe sigurisë në Kosovë, me mbi 5 vjet eksperiencë në instalimin dhe mirëmbajtjen e sistemeve profesionale.",
    // Footer
    footer_company: "Kompania",
    footer_services: "Shërbime",
    footer_contact: "Kontakt",
    footer_rights: "Të gjitha të drejtat e rezervuara.",
    footer_tagline: "Zgjidhje Profesionale Sigurie & Rrjeti · Kosovë",
    footer_hours: "E Hënë–E Shtunë, 08:00–18:00",
    // Misc
    read_more: "Lexo më shumë",
    back: "Kthehu",
    loading: "Duke ngarkuar...",
  },
  en: {
    nav_home: "Home",
    nav_products: "Products",
    nav_services: "Services",
    nav_about: "About",
    nav_contact: "Contact",
    nav_cta: "Contact Us",
    hero_label: "Security & Technology Systems",
    hero_h1_1: "Protect everything",
    hero_h1_2: "that matters.",
    hero_sub: "Security cameras, alarm systems, fiber optic networks and IT infrastructure — professional installation across Kosovo.",
    hero_cta_primary: "View Products",
    hero_cta_secondary: "Contact Us",
    hero_trust_1: "Over 1,000 installations",
    hero_trust_2: "Direct manufacturer warranty",
    hero_trust_3: "24/7 Support",
    stat_cameras: "Cameras Installed",
    stat_projects: "Projects Completed",
    stat_support: "Technical Support",
    stat_uptime: "System Reliability",
    services_label: "Services",
    services_h2: "Complete security & technology solutions",
    services_sub: "From cameras to networks — we design, install and maintain everything.",
    svc_cctv_title: "Video Surveillance",
    svc_cctv_desc: "High-resolution IP cameras, NVR systems and 24/7 monitoring for businesses and homes.",
    svc_alarm_title: "Alarm Systems",
    svc_alarm_desc: "Smart alarm systems with motion sensors, smoke detection and instant notifications.",
    svc_fiber_title: "Fiber Optic",
    svc_fiber_desc: "FTTH fiber optic network installation and maintenance with high speed and maximum reliability.",
    svc_network_title: "Network Infrastructure",
    svc_network_desc: "Network infrastructure, switches, routers and enterprise Wi-Fi systems.",
    svc_it_title: "IT Services",
    svc_it_desc: "IT systems maintenance, server configuration and continuous technical support.",
    svc_maint_title: "Maintenance",
    svc_maint_desc: "Maintenance contracts for security systems and networks — prevention and fast repair.",
    svc_learn: "Learn More",
    products_label: "Our Products",
    products_h2: "Certified equipment from world leaders",
    products_sub: "Authorized dealer of Tiandy, Dahua and TVT in Kosovo.",
    hero_partner_seller: "Partner seller of Tiandy, Dahua and TVT in Kosovo.",
    products_see_all: "View all products",
    products_buy: "Buy Now",
    products_filter: "Filter",
    products_sort: "Sort",
    products_sort_default: "Default",
    products_sort_asc: "Price: Low to High",
    products_sort_desc: "Price: High to Low",
    products_showing: "Products",
    products_in_stock: "In Stock",
    products_out_of_stock: "Out of Stock",
    products_cat_all: "All",
    products_filter_price: "Price",
    products_filter_cat: "Category",
    products_clear: "Clear filters",
    products_no_results: "No products found.",
    brands_label: "Our Partners",
    brands_h2: "We work with industry leaders",
    cta_h2: "Ready to secure your business?",
    cta_sub: "Get a free consultation and custom quote from our team.",
    cta_primary: "Get a Free Quote",
    cta_phone: "Call Us",
    contact_label: "Contact",
    contact_h1: "Let's talk.",
    contact_sub: "Ready for a free consultation? Contact us by phone, WhatsApp or the form below.",
    contact_name: "Full Name",
    contact_email: "Email",
    contact_phone: "Phone",
    contact_subject: "Subject",
    contact_message: "Message",
    contact_send: "Send Message",
    contact_success_h: "Message Sent!",
    contact_success_sub: "We'll get back to you within 2 hours. For urgent matters, call us directly.",
    contact_subject_cctv: "CCTV / Surveillance",
    contact_subject_alarm: "Alarm System",
    contact_subject_fiber: "Fiber Optic",
    contact_subject_network: "Network Infrastructure",
    contact_subject_maint: "Maintenance Contract",
    contact_subject_other: "Other",
    contact_info_phone: "Phone",
    contact_info_email: "Email",
    contact_info_location: "Location",
    contact_info_whatsapp: "WhatsApp",
    about_label: "About Us",
    about_h1: "Technology that protects.",
    about_sub: "Quantic SHPK is Kosovo's leading technology and security company, with over 5 years of experience in professional system installation and maintenance.",
    footer_company: "Company",
    footer_services: "Services",
    footer_contact: "Contact",
    footer_rights: "All rights reserved.",
    footer_tagline: "Professional Security & Network Solutions · Kosovo",
    footer_hours: "Mon–Sat, 08:00–18:00",
    read_more: "Read More",
    back: "Back",
    loading: "Loading...",
  },
} as const;

type TranslationKey = keyof typeof t.sq;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "sq",
  setLang: () => {},
  tr: (k) => t.sq[k],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sq");

  useEffect(() => {
    const stored = localStorage.getItem("qs-lang") as Lang | null;
    if (stored === "sq" || stored === "en") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("qs-lang", l);
  }

  function tr(key: TranslationKey): string {
    return t[lang][key] ?? t.sq[key];
  }

  return <LangContext.Provider value={{ lang, setLang, tr }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
