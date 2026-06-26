import React, { FC, useState, useEffect } from 'react';
import { Property, Language, Review } from '../types';
import { getTranslation } from '../lib/translations';
import { isFavorite, toggleFavorite, getReviews, addReview } from '../lib/db';
import { safeSessionStorage as sessionStorage } from '../lib/storage';
import { 
  X, Heart, BedDouble, Bath, Square, MapPin, 
  Share2, KeyRound, Wifi, Shield, Car, Wind, Sofa, CheckCircle, 
  Star, Send, Smartphone, MessageSquare, Copy, CopyCheck,
  Maximize2, ChevronLeft, ChevronRight, ExternalLink, Volume2,
  Minimize2, Settings
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property;
  lang: Language;
  onClose: () => void;
  onFavoriteToggle: () => void;
  isFav: boolean;
}

export const PropertyDetailsModal: FC<PropertyDetailsModalProps> = ({
  property,
  lang,
  onClose,
  onFavoriteToggle,
  isFav
}) => {
  const isRtl = lang === 'ar';
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImgIndex, setLightboxImgIndex] = useState(0);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [shareFeedback, setShareFeedback] = useState(false);
  const [notification, setNotification] = useState('');
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>(
    property.videoUrl && (!property.imageUrls || property.imageUrls.length === 0) ? 'video' : 'photos'
  );
  const [isPlayingDriveVideo, setIsPlayingDriveVideo] = useState(false);

  const getDriveVideoEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view(\?.*)?$/, '/preview');
    }
    return url;
  };

  // Fetch reviews associated with this property ID
  useEffect(() => {
    const all = getReviews();
    const filtered = all.filter(r => r.propertyId === property.id || !r.propertyId); // fallback simple reviews
    setReviewsList(filtered.slice(-4)); // show the latest 4 reviews
  }, [property.id]);

  // Format Price helper
  const formatPrice = (value: number) => {
    return value.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US');
  };

  // Submit dynamic review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    const newRev = addReview({
      fullName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewText.trim(),
      propertyId: property.id
    });

    setReviewsList([newRev, ...reviewsList]);
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
    
    // Trigger standard notification toast
    setNotification(getTranslation(lang, 'successBooking'));
    setTimeout(() => setNotification(''), 4000);
  };

  // Copy listing shareable URL
  const handleCopyLink = () => {
    try {
      const origin = typeof window !== 'undefined' && window.location && window.location.origin ? window.location.origin : '';
      const shareUrl = `${origin}/?property=${property.id}`;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            setShareFeedback(true);
            setTimeout(() => setShareFeedback(false), 2000);
          })
          .catch((err) => {
            console.warn("Failed to copy link via navigator.clipboard:", err);
          });
      } else {
        console.warn("navigator.clipboard layout not supported in this context");
      }
    } catch (e) {
      console.warn("Failed to access clipboard or location origin:", e);
    }
  };

  // Dispatch WhatsApp booking or purchase link
  const triggerWhatsAppAction = () => {
    const companyPhone = "+201124151496";
    
    // Attempt to load customer credentials from state
    let customerName = "عميل مهتم";
    let customerPhone = "غير متوفر";
    try {
      const stored = sessionStorage.getItem('dark_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.fullName) customerName = parsed.fullName;
        if (parsed.phoneNumber) customerPhone = parsed.phoneNumber;
      }
    } catch (_) {}

    const isSale = property.category === 'property_sales';
    const propNameStr = lang === 'ar' ? property.title_ar : property.title_en;

    const messageTemplate = isSale
      ? `مرحباً دارك العقارية،\n\nأرغب في شراء العقار التالي:\n\n*اسم العقار:* ${propNameStr}\n*سعر العقار:* ${formatPrice(property.price)} ${getTranslation(lang, 'currency')}\n\n*الاسم للعميل:* ${customerName}\n*رقم الهاتف:* ${customerPhone}\n\nيرجى التواصل معي لإكمال الإجراءات والتفاصيل.`
      : `مرحباً دارك العقارية،\n\nأرغب في حجز العقار التالي:\n\n*اسم العقار:* ${propNameStr}\n*قيمة الإيجار:* ${formatPrice(property.price)} ${getTranslation(lang, 'currency')}\n\n*الاسم للعميل:* ${customerName}\n*رقم الهاتف:* ${customerPhone}\n\nيرجى تأكيد الحجز والتواصل معي في أقرب وقت.`;

    const encoded = encodeURIComponent(messageTemplate);
    const waUrl = `https://wa.me/${companyPhone.replace('+', '')}?text=${encoded}`;
    
    // Open action deep link
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Notify the user on the screen too
    setNotification(getTranslation(lang, 'successBooking'));
    setTimeout(() => setNotification(''), 4500);
  };

  // Resolve Icon helper based on keyword
  const getAmenityIcon = (name: string) => {
    const nm = name.toLowerCase();
    if (nm.includes('wifi') || nm.includes('واي')) return <Wifi className="w-4 h-4 text-[#C9A14A]" />;
    if (nm.includes('security') || nm.includes('حراسة')) return <Shield className="w-4 h-4 text-[#C9A14A]" />;
    if (nm.includes('parking') || nm.includes('موقف')) return <Car className="w-4 h-4 text-[#C9A14A]" />;
    if (nm.includes('ac') || nm.includes('تكييف')) return <Wind className="w-4 h-4 text-[#C9A14A]" />;
    if (nm.includes('furnished') || nm.includes('مفروش') || nm.includes('أثاث')) return <Sofa className="w-4 h-4 text-[#C9A14A]" />;
    return <CheckCircle className="w-4 h-4 text-[#C9A14A]" />;
  };

  // Prevent parent body scroll when details modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const images = property.imageUrls && property.imageUrls.length > 0
    ? property.imageUrls
    : ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden cursor-pointer"
      dir={isRtl ? 'rtl' : 'ltr'}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-max bg-[#163B63] border-2 border-[#C9A14A] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce font-medium text-sm text-center">
          <CheckCircle className="w-5 h-5 text-[#C9A14A]" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Glassmorphic Container Box */}
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-gray-800 rounded-3xl h-[92vh] max-h-[850px] flex flex-col justify-between overflow-hidden shadow-2xl animate-scaleUp cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal bar header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#163B63] dark:bg-slate-800 text-[#C9A14A] text-[10px] font-bold px-2.5 py-1 rounded-md">
              {property.id.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 font-mono hidden sm:inline">
              SECURE PROPERTY CARD
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share shortcut */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 font-medium text-xs transition-all flex items-center gap-1 cursor-pointer select-none"
              title="Copy Real estate platform link"
            >
              {shareFeedback ? (
                <>
                  <CopyCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-bold hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            {/* Favorite switch */}
            <button
              onClick={onFavoriteToggle}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 transition-all select-none cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-rose-500/20 hover:text-rose-600 rounded-lg text-gray-400 dark:text-gray-500 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable details wrapper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Gallery / Video Walkthrough Section */}
          <div className="space-y-4">
            {/* Elegant Selector Pills when both Photos and Video exist */}
            {property.videoUrl && images && images.length > 0 && (
              <div className="flex bg-gray-100 dark:bg-slate-800/80 p-1 rounded-2xl w-full sm:w-fit gap-1 text-xs select-none shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMediaTab('photos');
                    setIsPlayingDriveVideo(false);
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-extrabold transition-all duration-300 cursor-pointer font-arabic flex items-center justify-center gap-1.5 ${
                    activeMediaTab === 'photos'
                      ? 'bg-white dark:bg-slate-700 text-[#163B63] dark:text-white shadow-md scale-102'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <span>📷</span>
                  <span>{isRtl ? 'الصور الفوتوغرافية' : 'Photos'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMediaTab('video');
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-extrabold transition-all duration-300 cursor-pointer font-arabic flex items-center justify-center gap-1.5 ${
                    activeMediaTab === 'video'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-102'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <span>🎥</span>
                  <span>{isRtl ? 'جولة الفيديو' : 'Video Tour'}</span>
                </button>
              </div>
            )}

            {activeMediaTab === 'video' && property.videoUrl ? (
              // Extremely simple, direct responsive 100% full-touch native player (perfect for phone viewport!)
              <div className="space-y-3">
                {!isPlayingDriveVideo ? (
                  // Custom visual poster so iframe does not hijack scrolls or swipes on mobile!
                  <div className="relative pt-[56.25%] h-0 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 shadow-xl border border-gray-200 dark:border-gray-800 animate-fadeIn select-none">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 p-4">
                      {/* Cozy room preview image behind glass */}
                      <img
                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                        alt="Walkthrough Video Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px]"
                      />
                      
                      {/* Pulsing play icon */}
                      <button
                        type="button"
                        onClick={() => setIsPlayingDriveVideo(true)}
                        className="relative z-10 w-16 h-16 rounded-full bg-[#C9A14A] hover:bg-[#b08b3e] text-[#163B63] flex items-center justify-center shadow-2xl scale-100 hover:scale-[1.08] active:scale-95 transition-all duration-300 cursor-pointer group"
                      >
                        <svg className="w-8 h-8 fill-current translate-x-0.5 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>

                      <div className="relative z-10 mt-4 text-center px-2">
                        <p className="text-sm font-black text-white font-arabic tracking-wide">
                          {isRtl ? "🎥 جولة معاينة الفيديو الحية والمباشرة للشقة" : "🎥 Direct Live Video Walkthrough Tour"}
                        </p>
                        <p className="text-[10px] text-gray-300 mt-1 font-arabic font-light leading-relaxed max-w-sm">
                          {isRtl 
                            ? "اضغط للتشغيل الفوري داخل الصفحة، أو شاهد ملء الشاشة بتطبيق الفيديو" 
                            : "Click to stream inside the app, or play fullscreen directly for full quality."}
                        </p>
                      </div>

                      <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlayingDriveVideo(true)}
                          className="px-4 py-2 bg-[#C9A14A] text-[#163B63] font-bold rounded-xl text-[11px] transition-all hover:bg-amber-500 cursor-pointer font-arabic shadow-md"
                        >
                          {isRtl ? "تشغيل الجولة المباشرة 🍿" : "Play Walkthrough 🍿"}
                        </button>
                        <a
                          href={property.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer font-arabic border border-white/10 shadow-md"
                        >
                          {isRtl ? "شاشه كاملة ↗" : "Fullscreen View ↗"}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative pt-[56.25%] h-0 rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-gray-250 dark:border-gray-800">
                      <iframe
                        src={getDriveVideoEmbedUrl(property.videoUrl)}
                        className="w-full h-full border-0 absolute inset-0 z-10"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={isRtl ? property.title_ar : property.title_en}
                      />
                    </div>
                    {/* Return button to revert to cover so touch gesture capturing is stopped */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsPlayingDriveVideo(false)}
                        className="px-4.5 py-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400 rounded-xl transition-all font-arabic font-extrabold text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>✕ {isRtl ? "إغلاق مشغل الفيديو والرجوع للغلاف لسهولة التصفح" : "Close player & show poster cover"}</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Clean, helpful controller bar underneath the video player so it has ZERO overlaps on the touch player area */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#163B63]/5 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-150/45 dark:border-gray-800/60">
                  <div className="flex items-start gap-2 max-w-[80%] text-[11px] leading-relaxed text-gray-600 dark:text-slate-300">
                    <span className="text-amber-500 font-bold text-sm shrink-0">💡</span>
                    <p className="font-arabic font-medium">
                      {isRtl 
                        ? "تحكم كامل ومباشر: اضغط على زر الصوت 🔊 وعلامة الترس ⚙️ في زاوية مشغل الفيديو لتعديل الدقة والصوت."
                        : "Complete direct control: Tap speaker 🔊 and gear ⚙️ icons on the corner of player bar to unlock HD quality sound."}
                    </p>
                  </div>
                  
                  <a
                    href={property.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center shrink-0 text-xs font-black text-amber-600 dark:text-amber-400 hover:text-[#b08b3e] transition-colors bg-amber-550/10 dark:bg-amber-400/5 hover:bg-amber-500/20 px-3.5 py-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer font-arabic"
                  >
                    <span>{isRtl ? "شاهد ملء الشاشة أو تطبيق Drive ↗" : "Watch Fullscreen or Drive App ↗"}</span>
                  </a>
                </div>
              </div>
            ) : (
              // Standard photo gallery block
              <div className="space-y-3">
                <div className="relative pt-[52%] h-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-md group">
                  <img
                    src={images[activeImgIndex]}
                    alt={isRtl ? property.title_ar : property.title_en}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-102"
                    onClick={() => {
                      setLightboxImgIndex(activeImgIndex);
                      setIsLightboxOpen(true);
                    }}
                  />

                  {/* Enlarge floating button */}
                  <button
                    type="button"
                    id={`btn-enlarge-img-${property.id}`}
                    onClick={() => {
                      setLightboxImgIndex(activeImgIndex);
                      setIsLightboxOpen(true);
                    }}
                    className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-[#163B63] hover:text-white text-white backdrop-blur-md transition-all shadow-lg cursor-pointer flex items-center gap-1.5 text-xs select-none border border-white/20 font-bold"
                    title={isRtl ? "تكبير الصورة" : "Enlarge Image"}
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#C9A14A]" />
                    <span className="font-arabic">{isRtl ? "تكبير الصورة" : "Enlarge Image"}</span>
                  </button>
                  
                  {/* Image indicators overlays */}
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                    <span className="bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {activeImgIndex + 1} / {images.length}
                    </span>

                    {property.status === 'sold' && (
                      <span className="bg-rose-600 text-white text-[10px] z-20 font-bold px-3 py-1 rounded-lg shadow-lg">
                        {getTranslation(lang, 'soldBadge')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Micro sliders preview items if multiple assets present */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5" dir="ltr">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImgIndex(index)}
                        className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${
                          activeImgIndex === index ? 'border-[#C9A14A] scale-98 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pricing & title text banner header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug font-arabic">
                {isRtl ? property.title_ar : property.title_en}
              </h2>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-[#C9A14A] shrink-0" />
                <span>{isRtl ? property.location_ar : property.location_en}</span>
              </div>
            </div>

            <div className="bg-[#163B63]/5 dark:bg-slate-800/65 border border-[#C9A14A]/20 p-3 sm:p-4 rounded-2xl flex flex-col items-end min-w-[150px]">
              <span className="text-gray-400 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                {getTranslation(lang, 'price')}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5" dir={isRtl ? 'rtl' : 'ltr'}>
                <span className="text-xl sm:text-2xl font-black text-[#C9A14A]">{formatPrice(property.price)}</span>
                <span className="text-xs text-[#163B63] dark:text-gray-300 font-bold whitespace-nowrap">
                  {property.priceLabel_ar && isRtl ? (
                    property.priceLabel_ar
                  ) : property.priceLabel_en && !isRtl ? (
                    property.priceLabel_en
                  ) : property.category === 'student_housing' ? (
                    isRtl ? 'جنيه للفرد شهرياً' : 'EGP / person'
                  ) : (
                    <>
                      {getTranslation(lang, 'currency')}
                      {property.category !== 'property_sales' ? ' ' + getTranslation(lang, 'perMonth') : ''}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Tech specs block */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {property.category === 'student_housing' ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-gray-800/40">
                <div className="p-2.5 rounded-lg bg-[#C9A14A]/10 text-[#C9A14A]">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">{getTranslation(lang, 'beds')}</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{property.beds} / {property.rooms}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-gray-800/40">
                <div className="p-2.5 rounded-lg bg-[#C9A14A]/10 text-[#C9A14A]">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">{getTranslation(lang, 'rooms')}</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{property.rooms || 1}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-gray-800/40">
              <div className="p-2.5 rounded-lg bg-[#C9A14A]/10 text-[#C9A14A]">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">{getTranslation(lang, 'bathrooms')}</p>
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{property.bathrooms || 1}</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-850 rounded-xl border border-gray-100 dark:border-gray-800/40">
              <div className="p-2.5 rounded-lg bg-[#C9A14A]/10 text-[#C9A14A]">
                <Square className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">{getTranslation(lang, 'area')}</p>
                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{property.area} {getTranslation(lang, 'sqm')}</p>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-[#C9A14A] rounded-full inline-block" />
              <span>{lang === 'ar' ? 'التفاصيل والوصف' : 'Property Description'}</span>
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light text-justify">
              {isRtl ? property.description_ar : property.description_en}
            </p>
          </div>

          {/* Amenities details lists */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-[#C9A14A] rounded-full inline-block" />
              <span>{getTranslation(lang, 'amenities')}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(isRtl ? property.amenities_ar : property.amenities_en).map((am, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 p-2.5 bg-gray-50/50 dark:bg-slate-800/40 border border-gray-100 dark:border-gray-800 rounded-xl"
                >
                  <div className="shrink-0">{getAmenityIcon(am)}</div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Location Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-[#C9A14A] rounded-full inline-block" />
              <span>{getTranslation(lang, 'location')}</span>
            </h4>
            <div className="w-full h-56 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner bg-slate-100">
              {property.mapIframe ? (
                <iframe
                  src={property.mapIframe}
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Embedded"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center">
                  <MapPin className="w-8 h-8 text-[#C9A14A] animate-bounce mb-2" />
                  <p className="text-xs font-bold">{isRtl ? property.location_ar : property.location_en}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews system feedback */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-850">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-[#C9A14A] rounded-full inline-block" />
              <span>{getTranslation(lang, 'reviews')}</span>
            </h4>

            {/* List existing ones */}
            <div className="space-y-3">
              {reviewsList.length === 0 ? (
                <p className="text-xs text-gray-500 italic">{lang === 'ar' ? 'لا توجد تقييمات لهذا العقار بعد. كن أول من يضيف تقييماً!' : 'No reviews captured yet. Be the first to evaluate!'}</p>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-gray-50 dark:bg-slate-850 border border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#163B63] dark:text-gray-200">{rev.fullName}</span>
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, r) => (
                          <Star key={r} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-light italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Submit New comment */}
            <form onSubmit={handleReviewSubmit} className="pt-3.5 border-t border-slate-100 dark:border-slate-800/40 space-y-3">
              <h5 className="text-xs font-bold text-[#C9A14A] uppercase">{getTranslation(lang, 'addReview')}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={getTranslation(lang, 'yourName')}
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-slate-850 border border-gray-150 dark:border-gray-850 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#C9A14A]"
                />
                
                {/* Custom rating switcher */}
                <div className="flex items-center gap-2 px-3 justify-between bg-gray-50 dark:bg-slate-850 border border-gray-150 dark:border-gray-855 rounded-xl">
                  <span className="text-[10px] text-gray-400 font-bold">{getTranslation(lang, 'rating')}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setReviewRating(val)}
                        className="p-0.5"
                      >
                        <Star className={`w-4 h-4 ${val <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <textarea
                  required
                  rows={2}
                  maxLength={180}
                  placeholder={getTranslation(lang, 'yourComment')}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-slate-850 border border-gray-150 dark:border-gray-855 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-[#C9A14A]"
                />
                <button
                  type="submit"
                  className="absolute bottom-2.5 left-2.5 bg-[#C9A14A] text-[#163B63] p-1.5 rounded-lg active:scale-90 hover:opacity-90 transition-all cursor-pointer"
                >
                  <Send className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sticky bottom CTA and checkout details bar */}
        <div className="sticky bottom-0 z-10 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{getTranslation(lang, 'propertyStatus')}</p>
            <div className="mt-0.5 font-bold text-sm">
              {property.status === 'available' && <span className="text-emerald-500">{getTranslation(lang, 'available')}</span>}
              {property.status === 'reserved' && <span className="text-[#C9A14A]">{getTranslation(lang, 'reserved')}</span>}
              {property.status === 'sold' && <span className="text-rose-500">{getTranslation(lang, 'soldBadge')}</span>}
              {property.status === 'unavailable' && <span className="text-gray-500">{getTranslation(lang, 'unavailable')}</span>}
            </div>
          </div>

          {/* Call to action action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 active:scale-98 dark:bg-slate-800 dark:hover:bg-slate-750 text-[#163B63] dark:text-gray-200 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer select-none font-arabic border border-gray-200/50 dark:border-slate-800"
            >
              {isRtl ? 'إغلاق نافذة التفاصيل ✕' : 'Close Details ✕'}
            </button>

            {property.status === 'sold' ? (
              <span className="px-5 py-3 bg-rose-500/10 text-rose-500 font-bold text-xs sm:text-sm rounded-xl border border-rose-500/20 select-none">
                {getTranslation(lang, 'soldBadge')}
              </span>
            ) : property.status === 'unavailable' ? (
              <button
                disabled
                className="px-5 py-3 bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm rounded-xl cursor-not-allowed"
              >
                {getTranslation(lang, 'unavailable')}
              </button>
            ) : (
              <button
                onClick={triggerWhatsAppAction}
                className="px-5 sm:px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <Smartphone className="w-4 h-4 text-[#163B63] animate-bounce" />
                <span>
                  {property.category === 'property_sales'
                    ? getTranslation(lang, 'confirmPurchase')
                    : getTranslation(lang, 'confirmBooking')
                  }
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-lg animate-fadeIn p-4">
          {/* Lightbox Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-[110]">
            <span className="text-white/85 text-xs sm:text-sm font-semibold font-mono bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm select-none">
              {lightboxImgIndex + 1} / {images.length}
            </span>
            
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-rose-600 transition-colors rounded-xl text-white backdrop-blur-sm shadow-md cursor-pointer border border-white/10"
              title={isRtl ? "إغلاق" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Lightbox Image Viewbox */}
          <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center" onClick={(e) => {
            if (e.target === e.currentTarget) setIsLightboxOpen(false);
          }}>
            {/* Previous arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImgIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-2 sm:left-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-[#C9A14A] hover:text-[#163B63] hover:scale-105 text-white backdrop-blur-sm transition-all cursor-pointer shadow-lg border border-white/15"
                title={isRtl ? "السابق" : "Previous"}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Large Image */}
            <div className="relative max-h-full max-w-full flex items-center justify-center p-2">
              <img
                src={images[lightboxImgIndex]}
                alt="Enlarged view"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[66vh] object-contain rounded-2xl shadow-2xl border border-white/10 animate-scaleUp select-none"
              />
            </div>

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImgIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-2 sm:right-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-[#C9A14A] hover:text-[#163B63] hover:scale-105 text-white backdrop-blur-sm transition-all cursor-pointer shadow-lg border border-white/15"
                title={isRtl ? "التالي" : "Next"}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Thumbnails list inside lightbox for quick swap */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-4 mt-4 px-4 select-none z-[110]" dir="ltr">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImgIndex(idx);
                  }}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${
                    lightboxImgIndex === idx ? 'border-[#C9A14A] scale-100 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Large Highly reachable Back / Close button at the bottom of the Lightbox */}
          <div className="mt-2 mb-4 z-[110]">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="px-6 py-3 bg-[#C9A14A] hover:bg-[#b08b3e] active:scale-98 text-[#163B63] font-black rounded-xl transition-all shadow-lg text-xs font-arabic cursor-pointer flex items-center justify-center gap-1.5 border border-[#C9A14A]/20"
            >
              <span>✕</span>
              <span>{isRtl ? "رجوع للمعرض وإغلاق الصورة" : "Back to Gallery & Close"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
