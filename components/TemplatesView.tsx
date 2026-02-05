import React from 'react';
import { motion } from 'framer-motion';
import { Download, Monitor, FileText, Smartphone, ArrowRight, Star, ExternalLink } from 'lucide-react';

interface TemplateItem {
    id: string;
    title: string;
    description: string;
    format: string;
    size: string;
    image: string;
    webUrl?: string; // URL for Cloud Editing
    downloadUrl?: string; // Local file path for download
}

interface CollectionProps {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    items: TemplateItem[];
    gradient: string;
    delay: number;
}

const TemplateCard: React.FC<TemplateItem> = ({ title, description, format, image, webUrl, downloadUrl }) => (
    <motion.div
        whileHover={{ y: -8 }}
        className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 flex items-center justify-center">
            {/* Soft Blurred Background */}
            <div
                className="absolute inset-0 opacity-20 blur-2xl scale-125"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <img
                src={image}
                alt={title}
                className="relative z-10 max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-md"
            />
            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-20">

                {/* Cloud Edit Button */}
                {webUrl && (
                    <a
                        href={webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${webUrl.includes('pitch.com') ? 'bg-[#0078D4] hover:bg-[#106EBE]' : 'bg-[#EB1000] hover:bg-[#C40D00]'
                            } text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg`}
                    >
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shrink-0">
                            <span className={`${webUrl.includes('pitch.com') ? 'text-[#0078D4]' : 'text-[#EB1000]'
                                } font-black text-[10px] leading-none`} style={{ fontFamily: 'Inter, sans-serif' }}>
                                {webUrl.includes('pitch.com') ? 'P' : 'A'}
                            </span>
                        </div>
                        {webUrl.includes('pitch.com') ? 'Editar en Pitch' : 'Editar en Adobe Express'}
                    </a>
                )}

                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        download
                        className="bg-white text-tertiary px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100 cursor-pointer"
                    >
                        <Download size={16} />
                        Descargar
                    </a>
                )}
            </div>
            <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-tertiary uppercase tracking-wider shadow-sm border border-white/50">
                    {format}
                </span>
            </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
            <h4 className="font-bold text-lg text-tertiary mb-2 group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-sm text-gray-500 mb-4 flex-1">{description}</p>
            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-secondary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Vista Previa <ArrowRight size={12} />
                </span>
            </div>
        </div>
    </motion.div>
);

const CollectionSection: React.FC<CollectionProps> = ({ title, subtitle, description, icon, items, gradient, delay }) => (
    <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: delay }}
        className="mb-12 md:mb-20 last:mb-0 px-2 md:px-0"
    >
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-8 bg-secondary/50"></span>
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">{subtitle}</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                        {icon}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-tertiary">{title}</h3>
                </div>

                <p className="text-gray-500 max-w-2xl text-lg font-light leading-relaxed pl-1">
                    {description}
                </p>
            </div>

            <button className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-tertiary font-bold text-sm hover:bg-tertiary hover:text-white transition-all group whitespace-nowrap mt-4 md:mt-0">
                Ver Colección Completa
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide scroll-touch -mx-4 px-4 md:mx-0 md:px-0">
            {items.map((item) => (
                <div key={item.id} className="min-w-[280px] md:min-w-0 snap-center h-full">
                    <TemplateCard {...item} />
                </div>
            ))}
        </div>
    </motion.section>
);

const TemplatesView: React.FC = () => {
    // DATA MOCKUP - COLLECTIONS
    const pptCollection = [
        {
            id: 'ppt-new',
            title: 'Nueva Presentación: Innovación Shift',
            description: 'Nuestra propuesta más reciente para liderar la conversación en el mercado. Enfoque estratégico en IA y transformación digital.',
            format: 'Pitch',
            size: '14.2 MB',
            image: '/templates/thumb_new_presentation.png',
            webUrl: 'https://app.pitch.com/app/dashboard/6195b1fc-277e-4ef2-83b1-9315cdd23cd5/library/templates/ff00d0e3-0ef2-451e-a4aa-57a7caa11dae',
            downloadUrl: '/templates/presentation_master.pptx'
        },
        {
            id: 'ppt-master',
            title: 'Presentación Maestra: Impacto Total',
            description: 'La herramienta definitiva para comunicar nuestra visión. Diseñada para cautivar audiencias corporativas y transmitir autoridad.',
            format: 'PPTX',
            size: '12.5 MB',
            image: '/templates/thumb_master_v2.png',
            webUrl: 'https://app.pitch.com/app/dashboard/6195b1fc-277e-4ef2-83b1-9315cdd23cd5/library/templates/ff00d0e3-0ef2-451e-a4aa-57a7caa11dae',
            downloadUrl: '/templates/presentation_master.pptx'
        },
        {
            id: 'ppt-pitch',
            title: 'Propuesta Comercial: Cierra el Trato',
            description: 'Estructura persuasiva probada para ganar clientes. Convierte prospectos en aliados con una narrativa visual irresistible.',
            format: 'PPTX',
            size: '8.2 MB',
            image: '/templates/thumb_pitch_v2.png',
            webUrl: 'https://app.pitch.com/app/dashboard/6195b1fc-277e-4ef2-83b1-9315cdd23cd5/library/templates/ff004676-1200-41b4-a263-deddabd44ad8',
            downloadUrl: '/templates/presentation_pitch.pptx'
        }
    ];

    const docsCollection = [
        {
            id: 'doc-birthday',
            title: 'Tarjeta de Cumpleaños: Celebra con Estilo',
            description: 'Diseño festivo para celebrar el cumpleaños de tu equipo. Personalizable y listo para compartir.',
            format: 'Adobe Express',
            size: '—',
            image: '/templates/thumb_birthday.png', // User mentioned newsletter thumb specifically, let's update first in ordered list or wherever newsletter is
            webUrl: 'https://new.express.adobe.com/design/userTemplate/urn:aaid:sc:US:8551ca1a-8f92-53a2-b5cb-1af815f531c8'
        },
        {
            id: 'doc-invoice',
            title: 'Factura Profesional: Claridad Total',
            description: 'Plantilla de facturación limpia y profesional para transacciones comerciales.',
            format: 'Adobe Express',
            size: '—',
            image: '/templates/thumb_invoice.png',
            webUrl: 'https://new.express.adobe.com/design/userTemplate/urn:aaid:sc:US:118b1c8e-1625-5929-a868-d5143dfee28c'
        },
        {
            id: 'doc-newsletter',
            title: 'Newsletter Corporativo: Comunica con Impacto',
            description: 'Boletín informativo diseñado para mantener a tu audiencia conectada y comprometida.',
            format: 'Adobe Express',
            size: '—',
            image: '/templates/thumb_newsletter_v2.png',
            webUrl: 'https://new.express.adobe.com/design/userTemplate/urn:aaid:sc:US:90d4ea9b-2734-5c2c-a5d9-1a52239f654f'
        }
    ];

    const socialCollection = [
        {
            id: 'soc-1',
            title: 'Instagram Stories Kit',
            description: 'Set de 15 layouts para stories: encuestas, lanzamientos, frases y behind-the-scenes.',
            format: 'Adobe Express',
            size: '—',
            image: '/templates/thumb_newsletter.png',
            webUrl: 'https://new.express.adobe.com/design/userTemplate/urn:aaid:sc:US:90d4ea9b-2734-5c2c-a5d9-1a52239f654f'
        },
        {
            id: 'soc-2',
            title: 'LinkedIn Thought Leader',
            description: 'Plantillas para carruseles educativos y artículos de opinión. Optimizadas para lectura en feed.',
            format: 'Pitch',
            size: '—',
            image: '/templates/thumb_pitch.png',
            webUrl: 'https://app.pitch.com/app/dashboard/6195b1fc-277e-4ef2-83b1-9315cdd23cd5/library/templates/ff004676-1200-41b4-a263-deddabd44ad8'
        },
        {
            id: 'soc-3',
            title: 'Quote Card Generator',
            description: 'Generador de citas para portavoces con el tratamiento tipográfico correcto.',
            format: 'Adobe Express',
            size: '—',
            image: '/templates/thumb_invoice.png',
            webUrl: 'https://new.express.adobe.com/design/userTemplate/urn:aaid:sc:US:118b1c8e-1625-5929-a868-d5143dfee28c'
        }
    ];

    return (
        <div className="pb-24 lg:pb-20">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 md:mb-20 text-center max-w-3xl mx-auto px-4 pt-safe"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                    <Star size={14} className="text-secondary fill-secondary" />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Shift Brand Collections 2024</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-tertiary mb-4 md:mb-6 leading-tight">
                    Diseño listo para<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">generar impacto.</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto">
                    Hemos curado tres colecciones esenciales para cubrir todas las necesidades de comunicación de la agencia.
                    Desde la sala de juntas hasta el feed de Instagram.
                </p>
            </motion.div>

            {/* Collection 1: Presentations */}
            <CollectionSection
                title="Strategic Narrative"
                subtitle="Presentaciones"
                description="Frameworks visuales diseñados para persuadir. Utilizá estas plantillas para pitches de alto riesgo, reportes trimestrales y keynotes."
                icon={<Monitor size={24} className="md:w-8 md:h-8" />}
                items={pptCollection}
                gradient="from-[#0047AB] to-[#00235E]"
                delay={0.2}
            />

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8 md:my-12" />

            {/* Collection 2: Documents */}
            <CollectionSection
                title="Documentos Esenciales"
                subtitle="Documentos"
                description="Plantillas profesionales para comunicación corporativa. Desde facturas hasta newsletters, todo lo que necesitás para mantener la consistencia de marca en cada documento."
                icon={<FileText size={24} className="md:w-8 md:h-8" />}
                items={docsCollection}
                gradient="from-[#1534dc] to-[#f540ff]"
                delay={0.4}
            />

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8 md:my-12" />

            {/* Collection 3: Social */}
            <CollectionSection
                title="Digital Resonance"
                subtitle="Redes Sociales"
                description="Activos nativos digitales optimizados para detener el scroll. Layouts flexibles que mantienen la integridad de la marca en cualquier plataforma."
                icon={<Smartphone size={24} className="md:w-8 md:h-8" />}
                items={socialCollection}
                gradient="from-[#FF00FF] to-[#9244d8]"
                delay={0.6}
            />

        </div>
    );
};

export default TemplatesView;
