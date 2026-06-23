"use client";
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const contactInfo = [
  { icon: Phone, title: 'Phone', value: '+971 XX XXX XXXX', sub: 'Mon-Sat, 8am-6pm' },
  { icon: Mail, title: 'Email', value: 'info@quantictech.ae', sub: 'We reply within 24 hours' },
  { icon: MapPin, title: 'Address', value: 'Abu Dhabi, UAE', sub: 'Serving all UAE Emirates' },
  { icon: Clock, title: 'Hours', value: '24/7 Support', sub: 'Emergency response available' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 60% 50%, rgba(0,102,255,0.07) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 text-[#00c8ff] text-sm font-medium mb-6">
              Get In Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact <span className="bg-gradient-to-r from-[#00c8ff] to-[#0066ff] bg-clip-text text-transparent">Us</span>
            </h1>
            <p className="text-[#7a8499] text-lg max-w-xl mx-auto">
              Ready to secure your property? Get a free consultation from our security experts.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {contactInfo.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-[#00c8ff]" />
                </div>
                <div className="text-white font-semibold text-sm mb-1">{item.title}</div>
                <div className="text-[#7a8499] text-xs">{item.value}</div>
                <div className="text-[#7a8499] text-xs">{item.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="lg:col-span-2 bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-8">
              <h2 className="text-white text-2xl font-bold mb-6">Send a Message</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#7a8499] mb-1.5">Full Name</label>
                    <input type="text" placeholder="John Smith" className="w-full bg-[#050508] border border-[#1a1a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/60 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#7a8499] mb-1.5">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-[#050508] border border-[#1a1a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/60 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#7a8499] mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="+971 XX XXX XXXX" className="w-full bg-[#050508] border border-[#1a1a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/60 focus:outline-none focus:border-[#00c8ff]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#7a8499] mb-1.5">Service Required</label>
                    <select className="w-full bg-[#050508] border border-[#1a1a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#00c8ff]/50 transition-colors">
                      <option value="">Select a service</option>
                      <option>CCTV Surveillance</option>
                      <option>IP Cameras</option>
                      <option>DVR/NVR Systems</option>
                      <option>Alarm Systems</option>
                      <option>Fiber Optic Installation</option>
                      <option>FTTH Maintenance</option>
                      <option>Network Infrastructure</option>
                      <option>Technology Maintenance</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#7a8499] mb-1.5">Message</label>
                  <textarea rows={5} placeholder="Tell us about your project..." className="w-full bg-[#050508] border border-[#1a1a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#7a8499]/60 focus:outline-none focus:border-[#00c8ff]/50 transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-[#00c8ff] to-[#0066ff] hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="space-y-4">
              <div className="bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">Free Site Assessment</h3>
                <p className="text-[#7a8499] text-sm mb-4">Our security experts will visit your site and provide a detailed assessment and quote — completely free of charge.</p>
                <ul className="space-y-2 text-sm text-[#7a8499]">
                  {['No obligation', 'Same-week availability', 'Detailed written quote', 'Expert recommendations'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00c8ff]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-3">Business Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#7a8499]">
                    <span>Monday – Friday</span>
                    <span>8:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[#7a8499]">
                    <span>Saturday</span>
                    <span>9:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[#7a8499]">
                    <span>Emergency Support</span>
                    <span className="text-green-400">24/7</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
