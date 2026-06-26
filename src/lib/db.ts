import { Property, CustomerRegistration, Review, MaintenanceService, ServiceRequest } from '../types';
import { safeLocalStorage as localStorage } from './storage';

// Raw high-quality cinematic property photography
const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "prop-student-3",
    title_ar: "شقة طلاب مجهزة للشباب بالكنوز (بجوار مسجد أبو القاسم)",
    title_en: "Equipped Male Student Apartment (Near Abu Al-Qasim Mosque)",
    description_ar: "شقة سكنية ممتازة وهادئة للشباب والطلاب المغتربين بالكنوز. متوفرة بالأدوار الثالث والرابع والخامس. سعر السرير 900 جنيه شهرياً يشمل خدمات الإنترنت السريع Wi-Fi (الكهرباء غير شاملة السعر).",
    description_en: "Premium peaceful student housing for boys in Al-Kunuz district, adjacent to Abu Al-Qasim Mosque. Available on floors: 3rd, 4th, and 5th. Monthly bed rent of 900 EGP includes high-speed Wi-Fi (electricity fee is separate).",
    location_ar: "قنا - الكنوز، بجوار مسجد أبو القاسم",
    location_en: "Qena - Al-Kunuz, near Abu Al-Qasim Mosque",
    price: 900,
    type: "student_male",
    category: "student_housing",
    status: "available",
    imageUrls: [
      "https://drive.google.com/file/d/1PQDQp64t5p3MrNd_X02O4oaCmF6jurvZ/view",
      "https://drive.google.com/file/d/1KrsX2Z7X6vBk3GGkLUy0Fd70EZ6uKFOX/view",
      "https://drive.google.com/file/d/1vgUQ5FdVTDZoTO5XT9m2WvmvHwZJ1QH8/view",
      "https://drive.google.com/file/d/1mDWs7FkJC7BfVs03gOIXHfYA4Hi7MOk9/view"
    ],
    rooms: 3,
    bathrooms: 1,
    area: 120,
    beds: 7,
    amenities_ar: ["واي فاي", "الأدوار: 3، 4، 5", "سعة 7 أفراد", "الكهرباء غير شاملة"],
    amenities_en: ["Free high-speed WiFi", "Floors: 3rd, 4th & 5th", "Capacity 7 boys", "Electricity excluded"]
  },
  {
    id: "prop-student-4",
    title_ar: "شقة مميزة للدكاترة والمهندسين (الشباب)",
    title_en: "Equipped Flats for Doctors & Engineers (Male)",
    description_ar: "شقة سكنية ممتازة ومجهزة بالكامل ومكيفة للدكاترة والمهندسين من الشباب المغتربين ومناسبة للسكن والتركيز المالي أو الفني المتميز. تقع في منطقة وادعة بموقع دردشة خلف عمائر البنك مباشرةً. متوفر إنترنت Wi-Fi فائق السرعة، والكهرباء غير شاملة السعر لضمان العدالة.",
    description_en: "Premium, fully furnished and air-conditioned apartment tailored specifically for young male doctors and engineers looking for deep focus in Qena. Situated behind the bank buildings in Dardashah district. High-speed Wi-Fi is available; electricity is separate.",
    location_ar: "قنا - دردشة، خلف عمائر البنك",
    location_en: "Qena - Dardashah, behind Bank Buildings",
    price: 10000,
    type: "student_male",
    category: "student_housing",
    status: "available",
    imageUrls: [
      "https://drive.google.com/file/d/1PPFPHypLK5tlWDW05U3b0fh7uQ7KdBj7/view",
      "https://drive.google.com/file/d/16a1CW2IWhI92g067ISLdgB5XocORgC3b/view",
      "https://drive.google.com/file/d/15pJQoiiQJ2LGDisPTw1TMV1bdWoXjJTX/view"
    ],
    rooms: 3,
    bathrooms: 1,
    area: 130,
    beds: 6,
    amenities_ar: ["مكيفة بالكامل", "واي فاي", "مخصصة للدكاترة والمهندسين", "سعة 6 أسرة", "الكهرباء غير شاملة"],
    amenities_en: ["Fully Air-conditioned", "Free WiFi", "Tailor-made for Doctors & Engineers", "6 beds capacity", "Electricity bills excluded"],
    priceLabel_ar: "جنيه شهرياً للشقة كاملة",
    priceLabel_en: "EGP / Month (Whole Flat)"
  },
  {
    id: "prop-student-5",
    title_ar: "شقة طلاب مكيفة – شارع البنك الأهلي",
    title_en: "Air-conditioned Student Apartment - Al Ahli Bank Street",
    description_ar: "شقة طلاب فخمة ومجهزة بالكامل للشباب، مكيفة بالأثاث، تقع في شارع البنك الأهلي بالدور الخامس. السكن بنظام السرير بسعر ممتاز، متوافق ومخصص لتوفير الخصوصية والراحة وجودة الإقامة.",
    description_en: "Fully furnished & air-conditioned apartment for young male students located on Al Ahli Bank Street (5th floor). Beds available under monthly rental system.",
    location_ar: "قنا - شارع البنك الأهلي، الدور الخامس",
    location_en: "Qena - Al Ahli Bank Street, 5th Floor",
    price: 1250,
    type: "student_male",
    category: "student_housing",
    status: "available",
    imageUrls: [
      "https://drive.google.com/file/d/1nMLj-fRft7JeO97ED_J90UX2QgecVMBR/view",
      "https://drive.google.com/file/d/1oQh-Ri1EXyhwzkVe8hyexhp27LUDFZjD/view",
      "https://drive.google.com/file/d/15kHW_svvpKW1SFKeCy01Mg2vHcXx2GvO/view",
      "https://drive.google.com/file/d/1_3NZIhblYw6tluqu4VB8m1SWKU1pN7pT/view"
    ],
    rooms: 3,
    bathrooms: 1,
    area: 120,
    beds: 7,
    amenities_ar: ["شقة مكيفة", "الدور الخامس", "سعة 7 أسرة", "الكهرباء والغاز على الطالب", "واي فاي"],
    amenities_en: ["Air-conditioned", "5th Floor", "7 beds capacity", "Electricity & Gas separate", "Free WiFi"],
    priceLabel_ar: "جنيه شهرياً للفرد",
    priceLabel_en: "EGP / bed monthly"
  },
  {
    id: "prop-student-6",
    title_ar: "شقة طلاب مكيفة بالبوابة الأولى – 3 غرف و6 أسرة – موقع مميز",
    title_en: "A/C Student Apartment near Gate 1 - 3 Rooms & 6 Beds",
    description_ar: "شقة طلاب فخمة ومجهزة بالكامل للشباب، مكيفة بالكامل بالدور الثالث بالقرب من البوابة الأولى. توفر غرفاً مريحة مفروشة ومجهزة بالكامل بجميع الخدمات والأجهزة الكهربائية لراحة تامة وأجواء دراسية مثالية ومستقرة.",
    description_en: "Premium fully air-conditioned student apartment located near the First Gate (3rd Floor), offering 3 comfortable rooms and 6 beds with excellent community features.",
    location_ar: "قنا - البوابة الأولى، الدور الثالث",
    location_en: "Qena - First Gate, 3rd Floor",
    price: 1300,
    type: "student_male",
    category: "student_housing",
    status: "available",
    imageUrls: [
      "https://drive.google.com/file/d/1Gd0Xip5x6nFirckcQSQquS1bJwJW4_E6/view",
      "https://drive.google.com/file/d/1BAJFuk8Auh9065ApCsNysODFBHjYRVZE/view",
      "https://drive.google.com/file/d/1_aW128ADsIWJcOCFsl3pv1sMKiD7S_1H/view",
      "https://drive.google.com/file/d/14kkY7JgfmNPR5nhdjvVmiWBQRlH8OpeQ/view"
    ],
    rooms: 3,
    bathrooms: 1,
    area: 125,
    beds: 6,
    amenities_ar: ["شقة مكيفة بالكامل", "الدور الثالث", "سعة 6 أسرة", "الكهرباء والغاز على الطالب", "واي فاي", "3 غرف"],
    amenities_en: ["Fully Air-conditioned", "3rd Floor", "6 beds capacity", "Electricity & Gas separate", "Free WiFi", "3 Rooms"],
    priceLabel_ar: "جنيه شهرياً للفرد",
    priceLabel_en: "EGP / bed monthly"
  },
  {
    id: "prop-student-7",
    title_ar: "شقة طلاب مكيفة – الشئون",
    title_en: "A/C student apartment - El-She'on",
    description_ar: "شقة طلاب فخمة وهادئة ومكيفة بالكامل بحي الشئون بقنا (آخر شارع المراسي). متوفرة بالأدوار الثالث والرابع مع تصميم داخلي مريح للدراسة والاسترخاء والتركيز. سعر السرير 1,200 جنيه شهريًا للفرد، متضمنةً أفضل الخدمات والمرافق الأساسية (الكهرباء على الطلاب المقيمين للضمان والعدالة).",
    description_en: "Premium peaceful and fully air-conditioned student lodging in El-She'on district, Qena (end of El-Marasi street). Available on the 3rd and 4th floors. Bed rent is 1,200 EGP per person monthly; electricity shared between students.",
    location_ar: "قنا - الشئون، آخر شارع المراسي",
    location_en: "Qena - El-She'on, end of El-Marasi Street",
    price: 1200,
    type: "student_male",
    category: "student_housing",
    status: "available",
    imageUrls: [],
    videoUrl: "https://drive.google.com/file/d/1dFZfZDt7TuSLPAEY286k9r4Xf37f41dB/view",
    rooms: 3,
    bathrooms: 1,
    area: 120,
    beds: 6,
    amenities_ar: ["شقة مكيفة", "الأدوار: الثالث والرابع", "سعر السرير: 1,200 جنيه للفرد", "الكهرباء على الطلاب", "واي فاي", "3 غرف"],
    amenities_en: ["Air-conditioned", "Floors: 3rd & 4th", "Bed: 1,200 EGP", "Electricity shared", "WiFi", "3 Rooms"],
    priceLabel_ar: "جنيه شهرياً للفرد",
    priceLabel_en: "EGP / bed monthly"
  }
];

const SAMPLE_MAINTENANCE: MaintenanceService[] = [
  {
    id: "maint-1",
    category: "plumbing",
    title_ar: "خدمات السباكة المتكاملة والذكية",
    title_en: "Complete Smart Plumbing Repairs",
    desc_ar: "تركيب وصيانة شبكات المياه والصرف الصحي، كشف وتحديد تسريبات المياه بأحدث الأجهزة الإلكترونية دون أي تكسير لجدران.",
    desc_en: "Installation and troubleshooting of water pipes, smart acoustic leakage detection, modern fixture upgrades with zero structural impact.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "maint-2",
    category: "electricity",
    title_ar: "أعمال الكهرباء المنزلية وحلول الأتمتة",
    title_en: "Home Electrical Setup & Automations",
    desc_ar: "تأسيس شبكات الكهرباء، معالجة الأعطال المفاجئة والشورت، وتركيب منظمات الجهد وشواحن المركبات الكهربائية وتجهيز السمارت هوم.",
    desc_en: "Full rewiring, troubleshooting short-circuits, voltage stabilizer configs, and smart residential automation integrations.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "maint-3",
    category: "carpenter",
    title_ar: "نجارة الأبواب وبناء المطابخ والمفروشات",
    title_en: "Exquisite Woodworking & Carpentry",
    desc_ar: "صناعة وتركيب وصيانة الأبواب والشبابيك، تجميع وتثبيت غرف النوم الفاخرة، ومطابخ الأكريليك والخشب بتفصيل فني مميز.",
    desc_en: "Custom door building, restoration, modular acrylic dynamic kitchen assembly, and fine luxury furniture crafting.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "maint-4",
    category: "ac",
    title_ar: "صيانة، تنظيف وتركيب التكييفات",
    title_en: "Certified Air Conditioning Services",
    desc_ar: "شحن وتعبئة غاز الفريون، غسيل شامل للوحدات الداخلية والخارجية بمضخات الضغط، صيانة وتمديد مواسير النحاس بأعلى أمان.",
    desc_en: "Eco-friendly freon gas recharging, deep hydro-cleaning of split grids, and secure copper line extensions.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "maint-5",
    category: "painting",
    title_ar: "الدهانات الفاخرة والديكور الحديث",
    title_en: "Premium Painting & Interior Decor",
    desc_ar: "تنفيذ أحدث الديكورات وأوراق الحائط، دهانات القطيفة والكبوتنيه، معالجة وتقشير الرطوبة بالخرسانة بأساليب كيميائية عازلة.",
    desc_en: "Ultra-luxury modern velvet finishes, wallpapers, and advanced moisture barrier chemical treatments.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "maint-6",
    category: "ceramic",
    title_ar: "تركيب السيراميك والبورسلين والرخام",
    title_en: "Elite Tiling, Porcelain & Marble Placement",
    desc_ar: "لصق الأرضيات بأحدث الميزانات الليزر، تركيب البورسلين كبير الحجم بأرقى الغراء والوزرات الرخامية الفاخرة للقصور والشقق.",
    desc_en: "Precise laser-guided tiling, monumental porcelain assembly, and custom marble installation.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
  }
];

const SAMPLE_REVIEWS: Review[] = [
  {
    id: "rev-1",
    fullName: "أحمد بن محمد القرني",
    rating: 5,
    comment: "تجربة راقية جداً في مسكن الطلاب بالنخبة. النظافة مستمرة، والواي فاي فائق السرعة أسعفني طوال الفصل الدراسي. أشكر القائمين على دارك على طيب المعاملة والاهتمام بالتفاصيل.",
    createdAt: "2026-05-12T14:30:00Z"
  },
  {
    id: "rev-2",
    fullName: "سارة عبد الفتاح شاهين",
    rating: 5,
    comment: "كان أكبر هم لي كأم هو سكن ابنتي الصغير المغترب بقنا، ولكن مع دارك للطالبات ارتاح قلبي تماماً. حراسة وأمان عالي ودعم صيانة فوري للأعطال. جزاكم الله خيراً.",
    createdAt: "2026-06-03T09:12:00Z"
  },
  {
    id: "rev-3",
    fullName: "م. محمد على الحوراني",
    rating: 5,
    comment: "استأجرت عن طريقهم الشقة الملكية المطلة على النيل لقضاء العطلة الصيفية. التشطيب في منتهى الفخامة والموقع مبهر والمصداقية كليا كاملة. أنصح بالتعامل معهم بلا تردد.",
    createdAt: "2026-06-18T20:15:00Z"
  }
];

// Initialize DB in LocalStorage if not exists
export const initDB = () => {
  const isInitialized = localStorage.getItem('dark_properties_initialized_v2') === 'true';
  const hasProps = localStorage.getItem('dark_properties') && localStorage.getItem('dark_properties') !== '[]';

  if (!isInitialized && !hasProps) {
    localStorage.setItem('dark_properties', JSON.stringify(SAMPLE_PROPERTIES));
    localStorage.setItem('dark_properties_initialized_v2', 'true');
  } else {
    // Already initialized or possesses listings.
    // Ensure newly introduced sample properties are merged into existing local storage state,
    // as long as the user did not explicitly delete them.
    try {
      let existing: Property[] = JSON.parse(localStorage.getItem('dark_properties') || '[]');
      let deleted: string[] = JSON.parse(localStorage.getItem('dark_deleted_properties') || '[]');
      
      // Auto-recover student properties from 'deleted' list to ensure student housing never shows empty
      const initialDeletedLen = deleted.length;
      deleted = deleted.filter(id => !id.startsWith('prop-student-'));
      if (deleted.length !== initialDeletedLen) {
        localStorage.setItem('dark_deleted_properties', JSON.stringify(deleted));
      }

      let updated = false;
      
      // Filter out any user-flagged fake/fictional mock properties from LocalStorage state
      const initialCount = existing.length;
      existing = existing.filter(p => {
        const title = p.title_ar || '';
        const isFake = 
          title.includes("سكن النخبة") ||
          title.includes("دار السلام الفاخرة") ||
          title.includes("شقة دوبلكس عائلية") ||
          title.includes("شقة ملكية") ||
          title.includes("مجمع تجاري إداري") ||
          title.includes("فيلا رويال") ||
          title.includes("شقة فاخرة للإيجار") ||
          title.includes("كورنيش النيل مباشرة") ||
          title.includes("شقة عائلية واسعة للإيجار") ||
          title.includes("مصنع الغزل") ||
          title.includes("شقة دوبلكس راقية") ||
          title.includes("قنا الجديدة") ||
          title.includes("شقة تمليك ممتازة") ||
          title.includes("مصطفى كامل") ||
          title.includes("فيلا مستقلة راقية") ||
          p.id === "prop-family-1" ||
          p.id === "prop-family-2" ||
          p.id === "prop-family-3";
        return !isFake;
      });
      if (existing.length !== initialCount) {
        updated = true;
      }
      
      // Clean up any stale "واي فاي مجاني" strings in the existing LocalStorage state
      existing = existing.map(p => {
        if (p.amenities_ar && p.amenities_ar.includes("واي فاي مجاني")) {
          p.amenities_ar = p.amenities_ar.map(amenity => amenity === "واي فاي مجاني" ? "واي فاي" : amenity);
          updated = true;
        }
        return p;
      });
      
      SAMPLE_PROPERTIES.forEach(sample => {
        // If it was explicitly deleted by the user, we do NOT re-add it.
        if (deleted.includes(sample.id)) {
          return;
        }
        
        const found = existing.find(p => p.id === sample.id);
        if (!found) {
          existing.push(sample);
          updated = true;
        } else {
          // Sync any fields that might have changed in code updates
          let fieldChanged = false;
          if (found.bathrooms !== sample.bathrooms) {
            found.bathrooms = sample.bathrooms;
            fieldChanged = true;
          }
          if (JSON.stringify(found.amenities_ar) !== JSON.stringify(sample.amenities_ar)) {
            found.amenities_ar = sample.amenities_ar;
            fieldChanged = true;
          }
          if (JSON.stringify(found.amenities_en) !== JSON.stringify(sample.amenities_en)) {
            found.amenities_en = sample.amenities_en;
            fieldChanged = true;
          }
          if (found.title_ar !== sample.title_ar) {
            found.title_ar = sample.title_ar;
            fieldChanged = true;
          }
          if (JSON.stringify(found.imageUrls) !== JSON.stringify(sample.imageUrls)) {
            found.imageUrls = sample.imageUrls;
            fieldChanged = true;
          }
          if (found.videoUrl !== sample.videoUrl) {
            found.videoUrl = sample.videoUrl;
            fieldChanged = true;
          }
          if (fieldChanged) {
            updated = true;
          }
        }
      });
      if (updated) {
        localStorage.setItem('dark_properties', JSON.stringify(existing));
      }
      localStorage.setItem('dark_properties_initialized_v2', 'true');
    } catch (e) {
      console.error("Error updating local properties", e);
    }
  }
  if (!localStorage.getItem('dark_maintenance')) {
    localStorage.setItem('dark_maintenance', JSON.stringify(SAMPLE_MAINTENANCE));
  } else {
    try {
      // Sync maintenance service images from SAMPLE_MAINTENANCE to local storage (force updates)
      const cached = JSON.parse(localStorage.getItem('dark_maintenance') || '[]');
      let revised = false;
      const synced = cached.map((item: any) => {
        const ref = SAMPLE_MAINTENANCE.find(s => s.id === item.id);
        if (ref && item.image !== ref.image) {
          item.image = ref.image;
          revised = true;
        }
        return item;
      });
      if (revised) {
        localStorage.setItem('dark_maintenance', JSON.stringify(synced));
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (!localStorage.getItem('dark_reviews')) {
    localStorage.setItem('dark_reviews', JSON.stringify(SAMPLE_REVIEWS));
  }
  if (!localStorage.getItem('dark_customers')) {
    localStorage.setItem('dark_customers', JSON.stringify([]));
  }
  if (!localStorage.getItem('dark_service_requests')) {
    localStorage.setItem('dark_service_requests', JSON.stringify([]));
  }
  if (!localStorage.getItem('dark_favorites')) {
    localStorage.setItem('dark_favorites', JSON.stringify([]));
  }
};

// Helper to convert Google Drive Sharing links into direct loading image URLs
export const getDirectImageUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('drive.google.com') || trimmed.includes('google.com/file')) {
    // Extract file ID from "/file/d/{id}/view" or "?id={id}"
    const matchD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const id = (matchD && matchD[1]) || (matchId && matchId[1]);
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
  }
  return trimmed;
};

// Properties Endpoints
export const getProperties = (): Property[] => {
  initDB();
  const rawProps: Property[] = JSON.parse(localStorage.getItem('dark_properties') || '[]');
  
  // Filter out any user-flagged fake/fictional mock properties from rendering
  const cleanProps = rawProps.filter(p => {
    const title = p.title_ar || '';
    const isFake = 
      title.includes("سكن النخبة") ||
      title.includes("دار السلام الفاخرة") ||
      title.includes("شقة دوبلكس عائلية") ||
      title.includes("شقة ملكية") ||
      title.includes("مجمع تجاري إداري") ||
      title.includes("فيلا رويال") ||
      title.includes("شقة فاخرة للإيجار") ||
      title.includes("كورنيش النيل مباشرة") ||
      title.includes("شقة عائلية واسعة للإيجار") ||
      title.includes("مصنع الغزل") ||
      title.includes("شقة دوبلكس راقية") ||
      title.includes("قنا الجديدة") ||
      title.includes("شقة تمليك ممتازة") ||
      title.includes("مصطفى كامل") ||
      title.includes("فيلا مستقلة راقية") ||
      p.id === "prop-family-1" ||
      p.id === "prop-family-2" ||
      p.id === "prop-family-3";
    return !isFake;
  });

  return cleanProps.map(prop => {
    if (prop.imageUrls && prop.imageUrls.length > 0) {
      return {
        ...prop,
        imageUrls: prop.imageUrls.map(url => getDirectImageUrl(url))
      };
    }
    return prop;
  });
};

export const getPropertyById = (id: string): Property | undefined => {
  const props = getProperties();
  return props.find(p => p.id === id);
};

// Customers Endpoints
export const getCustomers = (): CustomerRegistration[] => {
  initDB();
  return JSON.parse(localStorage.getItem('dark_customers') || '[]');
};

export const registerCustomer = (customer: Omit<CustomerRegistration, 'id' | 'createdAt'>): CustomerRegistration => {
  initDB();
  const customers = getCustomers();
  const newCustomer: CustomerRegistration = {
    ...customer,
    id: `cust-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  localStorage.setItem('dark_customers', JSON.stringify(customers));
  
  // Consumed also inside simulated firestore log
  console.log("Firestore Log -> SAVED customer:", newCustomer);
  return newCustomer;
};

// Service Requests / Maintenance Tickets Endpoints
export const getServiceRequests = (): ServiceRequest[] => {
  initDB();
  return JSON.parse(localStorage.getItem('dark_service_requests') || '[]');
};

export const createServiceRequest = (req: Omit<ServiceRequest, 'id' | 'createdAt'>): ServiceRequest => {
  initDB();
  const requests = getServiceRequests();
  const newRequest: ServiceRequest = {
    ...req,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  requests.push(newRequest);
  localStorage.setItem('dark_service_requests', JSON.stringify(requests));
  console.log("Firestore Log -> SAVED maintenance ticket:", newRequest);
  return newRequest;
};

// Reviews Endpoints
export const getReviews = (): Review[] => {
  initDB();
  return JSON.parse(localStorage.getItem('dark_reviews') || '[]');
};

export const addReview = (review: Omit<Review, 'id' | 'createdAt'>): Review => {
  initDB();
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  localStorage.setItem('dark_reviews', JSON.stringify(reviews));
  console.log("Firestore Log -> SAVED customer review:", newReview);
  return newReview;
};

// Maintenance Service List
export const getMaintenanceServices = (): MaintenanceService[] => {
  initDB();
  return JSON.parse(localStorage.getItem('dark_maintenance') || '[]');
};

// Favorites Endpoints
export const getFavorites = (): string[] => {
  initDB();
  return JSON.parse(localStorage.getItem('dark_favorites') || '[]');
};

export const toggleFavorite = (propertyId: string): boolean => {
  initDB();
  const favs = getFavorites();
  const index = favs.indexOf(propertyId);
  let added = false;
  
  if (index === -1) {
    favs.push(propertyId);
    added = true;
  } else {
    favs.splice(index, 1);
  }
  
  localStorage.setItem('dark_favorites', JSON.stringify(favs));
  return added;
};

export const isFavorite = (propertyId: string): boolean => {
  const favs = getFavorites();
  return favs.includes(propertyId);
};

// Admin Mutations for adding/deleting properties dynamically
export const addProperty = (newProp: Omit<Property, 'id'>): Property => {
  initDB();
  const props = getProperties();
  const added: Property = {
    ...newProp,
    id: `prop-${Date.now()}`
  };
  props.push(added);
  localStorage.setItem('dark_properties', JSON.stringify(props));
  return added;
};

export const deleteProperty = (id: string): void => {
  initDB();
  const props = getProperties();
  const filtered = props.filter(p => p.id !== id);
  localStorage.setItem('dark_properties', JSON.stringify(filtered));

  // Explicitly track this ID as deleted by the user so initDB does not auto-restore it
  try {
    const deleted: string[] = JSON.parse(localStorage.getItem('dark_deleted_properties') || '[]');
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('dark_deleted_properties', JSON.stringify(deleted));
    }
  } catch (e) {
    console.error("Error setting deleted property ID", e);
  }
};

export const clearAllProperties = (): void => {
  localStorage.setItem('dark_properties', JSON.stringify([]));
  // Add all default/sample properties to deleted tracker so they are not restored on getProperties()
  try {
    const deleted = SAMPLE_PROPERTIES.map(p => p.id);
    localStorage.setItem('dark_deleted_properties', JSON.stringify(deleted));
  } catch (e) {
    console.error("Error setting deleted list on clear", e);
  }
};

export const resetPropertiesToDefault = (): void => {
  // Overwrite local storage state with the complete, curated default SAMPLE_PROPERTIES set
  localStorage.setItem('dark_properties', JSON.stringify(SAMPLE_PROPERTIES));
  // Reset deleted tracker list to empty so all defaults can be read perfectly
  localStorage.removeItem('dark_deleted_properties');
  localStorage.setItem('dark_properties_initialized_v2', 'true');
};

