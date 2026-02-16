import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import SEO from "../components/SEO";
import { FaPaperPlane, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import FAQ from "../components/contact/FAQ";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  // EmailJS Configuration
  // 1. Create account at https://www.emailjs.com/
  // 2. Add Email Service (Gmail) -> Get Service ID
  // 3. Add Email Template -> Get Template ID
  // 4. Account > API Keys -> Get Public Key
  const SERVICE_ID = "service_vr0p9hi"; 
  const TEMPLATE_ID = "template_dv924xl";
  const PUBLIC_KEY = "sIWIuNBhbXcJPGjrE";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if keys are still placeholders (just in case)
    if (SERVICE_ID === "YOUR_SERVICE_ID") {
        alert("EmailJS configuration missing.");
        return;
    }

    setStatus("sending");
    
    try {
        await emailjs.send(
            SERVICE_ID, 
            TEMPLATE_ID, 
            {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_name: "Aditya Anugrah",
            }, 
            PUBLIC_KEY
        );
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
    } catch (error) {
        console.error("EmailJS Error:", error);
        setStatus("error");
        setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto min-h-screen flex flex-col justify-center">
      <SEO 
        title="Contact | Aditya Anugrah" 
        description="Get in touch with Aditya Anugrah for collaborations or inquiries."
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
            Let's work <span className="text-gradient">together.</span>
        </h1>
        <p className="text-white/60 text-lg">
            Have a project in mind? I'm always open to discussing new ideas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 glass-panel p-6 md:p-12 rounded-3xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold mb-2">My Contacts</h3>
                <p className="text-white/50 mb-6">Feel free to reach out directly.</p>
                
                <div className="space-y-4">
                    <a href="mailto:admin@adityaanugra.me" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                            <FaEnvelope />
                        </div>
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest">Email</div>
                            <div className="font-mono">admin@adityaanugra.me</div>
                        </div>
                    </a>
                    <a href="https://wa.me/6281379430432" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                            <FaWhatsapp />
                        </div>
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest">WhatsApp</div>
                            <div className="font-mono">+62 813 7943 0432</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <div className="relative min-h-[400px]">
            {status === "success" ? (
                <div 
                    className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 h-full"
                >
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-400 text-3xl animate-bounce">
                        <FaPaperPlane />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-display mb-2">Message Sent!</h3>
                        <p className="text-white/60 max-w-xs mx-auto">
                            Thank you for reaching out, {formData.name}. I'll get back to you within 24 hours.
                        </p>
                    </div>
                    <button 
                        onClick={() => setStatus("")}
                        className="text-sm text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold ml-1">Name</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold ml-1">Email</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold ml-1">Message</label>
                        <textarea 
                            required
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                            placeholder="Project details..."
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={status === "sending"}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {status === "sending" ? "Sending..." : <><FaPaperPlane /> Send Message</>}
                    </button>
                </form>
            )}
        </div>
      </div>

      <FAQ />
    </div>
  );
};

export default Contact;
