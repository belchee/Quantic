import { Camera, ShieldAlert, Wifi, Wrench, Network, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: string;
  shortDesc: string;
  description: string;
  features: string[];
  color: string;
}

export const services: Service[] = [
  {
    slug: "video-surveillance",
    icon: Camera,
    title: "Video Surveillance",
    shortDesc: "Complete CCTV and IP camera systems for total site visibility.",
    description:
      "We design, supply, and install professional video surveillance systems for homes, offices, warehouses, and industrial sites. From a single camera to a 200-channel enterprise network — we cover every scenario.",
    features: [
      "IP Cameras (2MP, 4MP, 8MP 4K)",
      "AI-powered cameras with human/vehicle detection",
      "DVR & NVR recording systems",
      "Remote monitoring via mobile app",
      "Night vision up to 100m IR",
      "License plate recognition (LPR)",
    ],
    color: "#06B6D4",
  },
  {
    slug: "alarm-systems",
    icon: ShieldAlert,
    title: "Alarm Systems",
    shortDesc: "Smart intrusion detection for homes and businesses.",
    description:
      "Protect your property with intelligent alarm systems that detect intrusions before they happen. We install and configure complete alarm ecosystems with central monitoring and instant mobile alerts.",
    features: [
      "Home and business alarm panels",
      "Motion detectors and glass-break sensors",
      "Door and window contact sensors",
      "Smoke and CO detection",
      "Siren and strobe integration",
      "24/7 instant push notifications",
    ],
    color: "#2563EB",
  },
  {
    slug: "fiber-optic",
    icon: Wifi,
    title: "Fiber Optic Solutions",
    shortDesc: "High-speed fiber infrastructure for buildings and campuses.",
    description:
      "We install single-mode and multi-mode fiber optic cabling for enterprises, ISPs, and building infrastructure. Every installation includes OTDR testing and full documentation.",
    features: [
      "Single-mode & multi-mode fiber",
      "Fusion splicing and termination",
      "OTDR testing and certification",
      "Underground and aerial cable runs",
      "Patch panels and ODF racks",
      "Long-distance backbone networks",
    ],
    color: "#06B6D4",
  },
  {
    slug: "ftth-maintenance",
    icon: Wrench,
    title: "FTTH Maintenance",
    shortDesc: "Fiber-to-the-home installation and ongoing fault support.",
    description:
      "We provide complete FTTH deployment and maintenance services — from last-mile drop cable to ONT configuration, fault detection, and emergency repairs with SLA-backed response times.",
    features: [
      "ONT and OLT configuration",
      "Last-mile drop cable installation",
      "Optical power level testing",
      "Fault detection and repair",
      "Splitter box maintenance",
      "Emergency SLA-based support",
    ],
    color: "#2563EB",
  },
  {
    slug: "network-infrastructure",
    icon: Network,
    title: "Network Infrastructure",
    shortDesc: "Structured cabling, managed switches, and enterprise networking.",
    description:
      "From Cat6 structured cabling to managed switch configuration and wireless access point deployment — we build networks that are fast, secure, and scalable.",
    features: [
      "Cat6 / Cat6A structured cabling",
      "Managed switch installation and config",
      "Wireless AP deployment (WiFi 6)",
      "VLAN segmentation and firewall setup",
      "Server rack and patch panel builds",
      "Network performance testing and documentation",
    ],
    color: "#06B6D4",
  },
  {
    slug: "technical-maintenance",
    icon: Settings,
    title: "Technical Maintenance",
    shortDesc: "Preventive and corrective maintenance for all your systems.",
    description:
      "Keep your surveillance, network, and security systems running at peak performance with our proactive maintenance contracts and rapid emergency response.",
    features: [
      "Camera and NVR preventive maintenance",
      "Network switch and router servicing",
      "UPS and power system maintenance",
      "Software updates and firmware patching",
      "System health monitoring",
      "24/7 emergency on-site response",
    ],
    color: "#2563EB",
  },
];
