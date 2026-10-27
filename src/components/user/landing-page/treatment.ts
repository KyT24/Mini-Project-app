const categories = [
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
  image?: string;
  action?: 'detail' | 'reserve';
  href?: string;
};

type Category = (typeof categories)[number];

export const treatments: Treatment[] = [
  {
    title: 'Acne Dermapeel',
    description:
      'Menggunakan larutan kimia untuk mengangkat lapisan kulit terluar. Kulit baru yang muncul lebih halus dan cerah.',
    category: 'Acne & Scar',
  },
  {
    title: 'IPL Acne',
    description:
      'Memanfaatkan energi cahaya untuk membuat wajah lebih halus, cerah, dan membasmi jerawat.',
    category: 'Acne & Scar',
    action: 'reserve',
  },
  {
    title: 'Acne Laser Co2',
    description:
      'Menggunakan energi cahaya berintensitas tinggi untuk mengangkat sel kulit mati dan mempercepat regenerasi kulit.',
    category: 'Acne & Scar',
  },
  {
    title: 'Acne Facial',
    description:
      'Pengelupasan sel kulit mati, pemberian nutrisi, serta pelembapan untuk membuat kulit wajah lebih sehat.',
    category: 'Acne & Scar',
  },
  {
    title: 'Brightening Facial',
    description:
      'Perawatan wajah untuk membantu mencerahkan kulit yang tampak kusam dan tidak merata.',
    category: 'Brightening',
  },
  {
    title: 'Glow Peeling',
    description:
      'Peeling ringan untuk mengangkat sel kulit mati sehingga kulit tampak lebih cerah dan segar.',
    category: 'Brightening',
  },
  {
    title: 'Vitamin C Infusion',
    description:
      'Pemberian nutrisi vitamin C ke kulit untuk membantu tampilan wajah lebih bercahaya.',
    category: 'Brightening',
    action: 'reserve',
  },
  {
    title: 'Anti-Aging Facial',
    description:
      'Perawatan wajah untuk membantu menjaga kekenyalan dan tampilan kulit agar tetap awet muda.',
    category: 'Anti-Aging',
  },
  {
    title: 'Skin Booster',
    description:
      'Membantu melembapkan kulit dari dalam agar tampak lebih kenyal dan sehat.',
    category: 'Anti-Aging',
    action: 'reserve',
  },
  {
    title: 'RF Lifting',
    description:
      'Menggunakan energi radiofrekuensi untuk membantu kulit tampak lebih kencang.',
    category: 'Anti-Aging',
  },
  {
    title: 'Hair Treatment',
    description:
      'Perawatan kulit kepala dan rambut untuk membantu rambut tampak lebih sehat dan kuat.',
    category: 'Hair',
  },
  {
    title: 'Laser Hair Removal',
    description:
      'Membantu mengurangi pertumbuhan rambut yang tidak diinginkan dengan energi laser.',
    category: 'Hair',
    action: 'reserve',
  },
  {
    title: 'Body Slimming',
    description:
      'Perawatan tubuh untuk membantu membentuk kontur tubuh dengan teknologi non-invasif.',
    category: 'Slimming',
  },
  {
    title: 'Body Contouring',
    description:
      'Membantu menyamarkan tampilan lemak membandel pada area tertentu.',
    category: 'Slimming',
    action: 'reserve',
  },
];
