export const categories = [
  'Acne & Scar',
  'Brightening',
  'Anti-Aging',
  'Hair',
  'Slimming',
] as const;

export type Treatment = {
  title: string;
  description: string;
  category: Category;
  slug: string; // dipakai di URL /treatment/[treatmentSlug]
  image?: string;
  featured?: boolean; // tampil di carousel treatment unggulan
};

export type Category = (typeof categories)[number];

export const treatments: Treatment[] = [
  {
    slug: 'acne-dermapeel',
    title: 'Acne Dermapeel',
    description:
      'Menggunakan larutan kimia untuk mengangkat lapisan kulit terluar. Kulit baru yang muncul lebih halus dan cerah.',
    category: 'Acne & Scar',
  },
  {
    slug: 'ipl-acne',
    title: 'IPL Acne',
    description:
      'Memanfaatkan energi cahaya untuk membuat wajah lebih halus, cerah, dan membasmi jerawat.',
    category: 'Acne & Scar',
  },
  {
    slug: 'acne-laser-co2',
    featured: true,
    title: 'Acne Laser Co2',
    description:
      'Menggunakan energi cahaya berintensitas tinggi untuk mengangkat sel kulit mati dan mempercepat regenerasi kulit.',
    category: 'Acne & Scar',
  },
  {
    slug: 'acne-facial',
    featured: true,
    title: 'Acne Facial',
    description:
      'Pengelupasan sel kulit mati, pemberian nutrisi, serta pelembapan untuk membuat kulit wajah lebih sehat.',
    category: 'Acne & Scar',
  },
  {
    slug: 'brightening-facial',
    featured: true,
    title: 'Brightening Facial',
    description:
      'Perawatan wajah untuk membantu mencerahkan kulit yang tampak kusam dan tidak merata.',
    category: 'Brightening',
  },
  {
    slug: 'glow-peeling',
    title: 'Glow Peeling',
    description:
      'Peeling ringan untuk mengangkat sel kulit mati sehingga kulit tampak lebih cerah dan segar.',
    category: 'Brightening',
  },
  {
    slug: 'vitamin-c-infusion',
    title: 'Vitamin C Infusion',
    description:
      'Pemberian nutrisi vitamin C ke kulit untuk membantu tampilan wajah lebih bercahaya.',
    category: 'Brightening',
  },
  {
    slug: 'anti-aging-facial',
    title: 'Anti-Aging Facial',
    description:
      'Perawatan wajah untuk membantu menjaga kekenyalan dan tampilan kulit agar tetap awet muda.',
    category: 'Anti-Aging',
  },
  {
    slug: 'skin-booster',
    featured: true,
    title: 'Skin Booster',
    description:
      'Membantu melembapkan kulit dari dalam agar tampak lebih kenyal dan sehat.',
    category: 'Anti-Aging',
  },
  {
    slug: 'rf-lifting',
    title: 'RF Lifting',
    description:
      'Menggunakan energi radiofrekuensi untuk membantu kulit tampak lebih kencang.',
    category: 'Anti-Aging',
  },
  {
    slug: 'hair-treatment',
    featured: true,
    title: 'Hair Treatment',
    description:
      'Perawatan kulit kepala dan rambut untuk membantu rambut tampak lebih sehat dan kuat.',
    category: 'Hair',
  },
  {
    slug: 'laser-hair-removal',
    title: 'Laser Hair Removal',
    description:
      'Membantu mengurangi pertumbuhan rambut yang tidak diinginkan dengan energi laser.',
    category: 'Hair',
  },
  {
    slug: 'body-slimming',
    featured: true,
    title: 'Body Slimming',
    description:
      'Perawatan tubuh untuk membantu membentuk kontur tubuh dengan teknologi non-invasif.',
    category: 'Slimming',
  },
  {
    slug: 'body-contouring',
    title: 'Body Contouring',
    description:
      'Membantu menyamarkan tampilan lemak membandel pada area tertentu.',
    category: 'Slimming',
  },
];

export const featuredTreatments = treatments.filter((treatment) => treatment.featured);

export function getTreatmentBySlug(slug: string) {
  return treatments.find((treatment) => treatment.slug === slug);
}
