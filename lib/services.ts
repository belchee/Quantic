import { Camera, ShieldAlert, Wifi, Wrench, Network, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: { sq: string; en: string };
  shortDesc: { sq: string; en: string };
  description: { sq: string; en: string };
  features: { sq: string; en: string }[];
  color: string;
}

export const services: Service[] = [
  {
    slug: "video-surveillance",
    icon: Camera,
    color: "#06B6D4",
    title: {
      sq: "Video Mbikëqyrje",
      en: "Video Surveillance",
    },
    shortDesc: {
      sq: "Sisteme të plota CCTV dhe kamera IP për mbikëqyrje totale të objektit tuaj.",
      en: "Complete CCTV and IP camera systems for total site visibility.",
    },
    description: {
      sq: "Ne projektojmë, furnizojmë dhe instalojmë sisteme profesionale të mbikëqyrjes video për shtëpi, zyra, magazina dhe objekte industriale. Nga një kamerë e vetme deri te rrjetet enterprise me 200 kanale — ne mbulojmë çdo skenar.",
      en: "We design, supply, and install professional video surveillance systems for homes, offices, warehouses, and industrial sites. From a single camera to a 200-channel enterprise network — we cover every scenario.",
    },
    features: [
      { sq: "Kamera IP (2MP, 4MP, 8MP 4K)", en: "IP Cameras (2MP, 4MP, 8MP 4K)" },
      { sq: "Kamera me AI për detektim njerëzish/automjetesh", en: "AI-powered cameras with human/vehicle detection" },
      { sq: "Sisteme regjistrimi DVR dhe NVR", en: "DVR & NVR recording systems" },
      { sq: "Monitorim në distancë nga celulari", en: "Remote monitoring via mobile app" },
      { sq: "Vizion nate deri në 100m IR", en: "Night vision up to 100m IR" },
      { sq: "Njohje e targave (LPR)", en: "License plate recognition (LPR)" },
    ],
  },
  {
    slug: "alarm-systems",
    icon: ShieldAlert,
    color: "#2563EB",
    title: {
      sq: "Sisteme Alarmi",
      en: "Alarm Systems",
    },
    shortDesc: {
      sq: "Detektim i zgjuar i ndërhyrjes për shtëpi dhe biznese.",
      en: "Smart intrusion detection for homes and businesses.",
    },
    description: {
      sq: "Mbroni pronën tuaj me sisteme alarmi inteligjente që zbulojnë ndërhyrjet para se të ndodhin. Ne instalojmë dhe konfigurojmë ekosisteme të plota alarmi me monitorim qendror dhe njoftim të menjëhershëm në celular.",
      en: "Protect your property with intelligent alarm systems that detect intrusions before they happen. We install and configure complete alarm ecosystems with central monitoring and instant mobile alerts.",
    },
    features: [
      { sq: "Panele alarmi për shtëpi dhe biznese", en: "Home and business alarm panels" },
      { sq: "Sensorë lëvizjeje dhe thyerjeje xhami", en: "Motion detectors and glass-break sensors" },
      { sq: "Sensorë kontakti për dyer dhe dritare", en: "Door and window contact sensors" },
      { sq: "Detektim tymi dhe CO", en: "Smoke and CO detection" },
      { sq: "Integrimi me sirenë dhe stroboskop", en: "Siren and strobe integration" },
      { sq: "Njoftim i menjëhershëm 24/7 në celular", en: "24/7 instant push notifications" },
    ],
  },
  {
    slug: "fiber-optic",
    icon: Wifi,
    color: "#06B6D4",
    title: {
      sq: "Fiber Optike",
      en: "Fiber Optic Solutions",
    },
    shortDesc: {
      sq: "Infrastrukturë fiber me shpejtësi të lartë për ndërtesa dhe kampuse.",
      en: "High-speed fiber infrastructure for buildings and campuses.",
    },
    description: {
      sq: "Ne instalojmë kabllo fiber optike single-mode dhe multi-mode për ndërmarrje, ISP dhe infrastrukturë ndërtesash. Çdo instalim përfshin testim OTDR dhe dokumentacion të plotë.",
      en: "We install single-mode and multi-mode fiber optic cabling for enterprises, ISPs, and building infrastructure. Every installation includes OTDR testing and full documentation.",
    },
    features: [
      { sq: "Fiber single-mode dhe multi-mode", en: "Single-mode & multi-mode fiber" },
      { sq: "Saldim dhe terminim me fusion", en: "Fusion splicing and termination" },
      { sq: "Testim dhe certifikim OTDR", en: "OTDR testing and certification" },
      { sq: "Kabllo nëntokësore dhe ajrore", en: "Underground and aerial cable runs" },
      { sq: "Patch panele dhe raft ODF", en: "Patch panels and ODF racks" },
      { sq: "Rrjeta backbone me distance të gjatë", en: "Long-distance backbone networks" },
    ],
  },
  {
    slug: "ftth-maintenance",
    icon: Wrench,
    color: "#2563EB",
    title: {
      sq: "Mirëmbajtje FTTH",
      en: "FTTH Maintenance",
    },
    shortDesc: {
      sq: "Instalim fiber-to-the-home dhe mbështetje e vazhdueshme për defektet.",
      en: "Fiber-to-the-home installation and ongoing fault support.",
    },
    description: {
      sq: "Ne ofrojmë shërbime të plota vendosje dhe mirëmbajtje FTTH — nga kabllo drop deri te konfigurimi ONT, zbulimi i defekteve dhe riparimi urgjent me kohë reagimi të garantuar SLA.",
      en: "We provide complete FTTH deployment and maintenance services — from last-mile drop cable to ONT configuration, fault detection, and emergency repairs with SLA-backed response times.",
    },
    features: [
      { sq: "Konfigurimi ONT dhe OLT", en: "ONT and OLT configuration" },
      { sq: "Instalim kabllo drop last-mile", en: "Last-mile drop cable installation" },
      { sq: "Testim i nivelit të fuqisë optike", en: "Optical power level testing" },
      { sq: "Zbulimi dhe riparimi i defekteve", en: "Fault detection and repair" },
      { sq: "Mirëmbajtje e kutive splitter", en: "Splitter box maintenance" },
      { sq: "Mbështetje urgjente me SLA", en: "Emergency SLA-based support" },
    ],
  },
  {
    slug: "network-infrastructure",
    icon: Network,
    color: "#06B6D4",
    title: {
      sq: "Infrastrukturë Rrjeti",
      en: "Network Infrastructure",
    },
    shortDesc: {
      sq: "Kabllo të strukturuara, switch të menaxhuar dhe rrjeta enterprise.",
      en: "Structured cabling, managed switches, and enterprise networking.",
    },
    description: {
      sq: "Nga kabllo Cat6 të strukturuara deri te konfigurimi i switch-ave të menaxhuar dhe vendosja e pikave të aksesit wireless — ne ndërtojmë rrjeta që janë të shpejta, të sigurta dhe të shkallëzueshme.",
      en: "From Cat6 structured cabling to managed switch configuration and wireless access point deployment — we build networks that are fast, secure, and scalable.",
    },
    features: [
      { sq: "Kabllo të strukturuara Cat6 / Cat6A", en: "Cat6 / Cat6A structured cabling" },
      { sq: "Instalim dhe konfigurim switch të menaxhuar", en: "Managed switch installation and config" },
      { sq: "Vendosje AP wireless (WiFi 6)", en: "Wireless AP deployment (WiFi 6)" },
      { sq: "Segmentim VLAN dhe konfigurim firewall", en: "VLAN segmentation and firewall setup" },
      { sq: "Ndërtim raftesh serveri dhe patch panelesh", en: "Server rack and patch panel builds" },
      { sq: "Testim dhe dokumentim i performancës së rrjetit", en: "Network performance testing and documentation" },
    ],
  },
  {
    slug: "technical-maintenance",
    icon: Settings,
    color: "#2563EB",
    title: {
      sq: "Mirëmbajtje Teknike",
      en: "Technical Maintenance",
    },
    shortDesc: {
      sq: "Mirëmbajtje parandaluese dhe korrigjuese për të gjitha sistemet tuaja.",
      en: "Preventive and corrective maintenance for all your systems.",
    },
    description: {
      sq: "Mbani sistemet tuaja të mbikëqyrjes, rrjetit dhe sigurisë në performancë maksimale me kontratat tona proaktive të mirëmbajtjes dhe reagim të shpejtë urgjent.",
      en: "Keep your surveillance, network, and security systems running at peak performance with our proactive maintenance contracts and rapid emergency response.",
    },
    features: [
      { sq: "Mirëmbajtje parandaluese kamerash dhe NVR", en: "Camera and NVR preventive maintenance" },
      { sq: "Servisim i switch-ave dhe router-ave", en: "Network switch and router servicing" },
      { sq: "Mirëmbajtje UPS dhe sistemesh energjie", en: "UPS and power system maintenance" },
      { sq: "Përditësim softueri dhe firmware", en: "Software updates and firmware patching" },
      { sq: "Monitorim i shëndetit të sistemit", en: "System health monitoring" },
      { sq: "Reagim urgjent 24/7 në vendndodhje", en: "24/7 emergency on-site response" },
    ],
  },
];
