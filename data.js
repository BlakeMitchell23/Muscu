// ============================================================
// DATA.JS — All application data (sessions, muscles, planning, science)
// ============================================================

const INITIAL_SESSIONS = [
  {"id":"S1","date":"2026-02-07","energy":3,"exercises":[
    {"name":"Leg Curl ELT+","group":"Ischio","charge":35,"series":3,"reps":12,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":20,"series":3,"reps":10,"ressenti":3},
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":90,"series":3,"reps":10,"ressenti":3},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":30,"series":3,"reps":10,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":10,"series":3,"reps":10,"ressenti":4},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":20,"series":3,"reps":10,"ressenti":3}
  ]},
  {"id":"S2","date":"2026-02-10","energy":3,"exercises":[
    {"name":"Shoulder Press","group":"Épaules","charge":10,"series":3,"reps":10,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":10,"series":3,"reps":10,"ressenti":3},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":3,"reps":10,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":10,"series":2,"reps":10,"ressenti":5},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":25,"series":4,"reps":11,"ressenti":2},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":35,"series":2,"reps":10,"ressenti":2},
    {"name":"Chest Press (autre machine)","group":"Pectoraux","charge":20,"series":3,"reps":10,"ressenti":3}
  ]},
  {"id":"S3","date":"2026-02-14","energy":3,"exercises":[
    {"name":"Chest Press","group":"Pectoraux","charge":10,"series":3,"reps":10,"ressenti":4},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":3,"reps":10,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":4},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":30,"series":3,"reps":10,"ressenti":2}
  ]},
  {"id":"S4","date":"2026-02-17","energy":3,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":120,"series":5,"reps":10,"ressenti":4},
    {"name":"Chest Press","group":"Pectoraux","charge":25,"series":4,"reps":10,"ressenti":4},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":40,"series":4,"reps":10,"ressenti":4},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":4},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":3,"reps":11,"ressenti":3},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":30,"series":3,"reps":12,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":10,"series":2,"reps":12,"ressenti":3}
  ]},
  {"id":"S5","date":"2026-02-21","energy":2,"exercises":[
    {"name":"Chest Press","group":"Pectoraux","charge":20,"series":3,"reps":10,"ressenti":2},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":2,"reps":10,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":10,"series":2,"reps":12,"ressenti":2},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":4},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":25,"series":3,"reps":11,"ressenti":4},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":35,"series":3,"reps":10,"ressenti":3}
  ]},
  {"id":"S6","date":"2026-03-01","energy":4,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":120,"series":5,"reps":12,"ressenti":3},
    {"name":"Leg Curl ELT+","group":"Ischio","charge":35,"series":3,"reps":12,"ressenti":3},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":25,"series":3,"reps":12,"ressenti":3},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":40,"series":3,"reps":12,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":4},
    {"name":"Chest Press","group":"Pectoraux","charge":25,"series":3,"reps":12,"ressenti":3},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":2,"reps":10,"ressenti":4},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":10,"series":2,"reps":12,"ressenti":3}
  ]},
  {"id":"S7","date":"2026-03-04","energy":4,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":120,"series":2,"reps":12,"ressenti":2},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":40,"series":3,"reps":12,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":2,"reps":12,"ressenti":3},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":30,"series":3,"reps":12,"ressenti":2},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":10,"series":2,"reps":12,"ressenti":1},
    {"name":"Chest Press","group":"Pectoraux","charge":25,"series":3,"reps":10,"ressenti":2},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":25,"series":3,"reps":12,"ressenti":3}
  ]},
  {"id":"S8","date":"2026-03-08","energy":2,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":100,"series":3,"reps":10,"ressenti":3},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":35,"series":3,"reps":10,"ressenti":2},
    {"name":"Chest Press","group":"Pectoraux","charge":20,"series":3,"reps":10,"ressenti":3},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":25,"series":3,"reps":10,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":2,"reps":10,"ressenti":4},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":25,"series":2,"reps":12,"ressenti":1}
  ]},
  {"id":"S9","date":"2026-03-11","energy":4,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":130,"series":3,"reps":12,"ressenti":2},
    {"name":"Leg Curl ELT+","group":"Ischio","charge":40,"series":3,"reps":12,"ressenti":2},
    {"name":"Chest Press","group":"Pectoraux","charge":30,"series":3,"reps":10,"ressenti":3},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":45,"series":3,"reps":12,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":15,"series":3,"reps":12,"ressenti":3},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":35,"series":3,"reps":12,"ressenti":2}
  ]},
  {"id":"S10","date":"2026-03-15","energy":4,"exercises":[
    {"name":"Vertical Traction","group":"Dos_largeur","charge":45,"series":3,"reps":12,"ressenti":3},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":40,"series":3,"reps":15,"ressenti":3},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":3,"reps":10,"ressenti":4},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":15,"series":3,"reps":12,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":30,"series":4,"reps":10,"ressenti":4},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":25,"series":4,"reps":12,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":4}
  ]},
  {"id":"S11","date":"2026-03-18","energy":3,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":140,"series":3,"reps":12,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":20,"series":3,"reps":8,"ressenti":3},
    {"name":"Arm Curl","group":"Biceps","charge":20,"series":3,"reps":8,"ressenti":5},
    {"name":"Arm Curl inversé","group":"Avant-bras","charge":2.5,"series":1,"reps":10,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":20,"series":3,"reps":10,"ressenti":4},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":30,"series":3,"reps":12,"ressenti":4},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":45,"series":3,"reps":12,"ressenti":4},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":50,"series":3,"reps":10,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":35,"series":3,"reps":10,"ressenti":3}
  ]},
  {"id":"S12","date":"2026-03-21","energy":4,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":140,"series":3,"reps":12,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":35,"series":3,"reps":12,"ressenti":3},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":30,"series":3,"reps":12,"ressenti":3},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":50,"series":3,"reps":12,"ressenti":4},
    {"name":"Shoulder Press","group":"Épaules","charge":20,"series":3,"reps":10,"ressenti":4},
    {"name":"Arm Curl","group":"Biceps","charge":15,"series":3,"reps":12,"ressenti":4.5},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":20,"series":3,"reps":10,"ressenti":4},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":45,"series":3,"reps":12,"ressenti":4},
    {"name":"Arm Curl inversé","group":"Avant-bras","charge":5,"series":3,"reps":15,"ressenti":5}
  ]},
  {"id":"S13","date":"2026-03-27","energy":3,"exercises":[
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":30,"series":2,"reps":12,"ressenti":1},
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":110,"series":3,"reps":10,"ressenti":1},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":45,"series":3,"reps":10,"ressenti":3},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":25,"series":3,"reps":12,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":15,"series":3,"reps":10,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":30,"series":3,"reps":10,"ressenti":3},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":15,"series":2,"reps":10,"ressenti":1},
    {"name":"Arm Curl (haltères)","group":"Biceps","charge":10,"series":2,"reps":5,"ressenti":4},
    {"name":"Arm Curl inversé (haltères)","group":"Avant-bras","charge":5,"series":2,"reps":10,"ressenti":3}
  ]},
  {"id":"S14","date":"2026-03-29","energy":4,"exercises":[
    {"name":"Chest Press","group":"Pectoraux","charge":35,"series":4,"reps":10,"ressenti":3},
    {"name":"Shoulder Press","group":"Épaules","charge":20,"series":4,"reps":10,"ressenti":4},
    {"name":"Dips (poids de corps)","group":"Pectoraux","charge":0,"series":3,"reps":4,"ressenti":4.5},
    {"name":"Élévations latérales câble","group":"Delt_latéral","charge":2.5,"series":4,"reps":8,"ressenti":5},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":20,"series":3,"reps":12,"ressenti":4},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":40,"series":3,"reps":12,"ressenti":3}
  ]},
  {"id":"S15","date":"2026-04-01","energy":3.5,"exercises":[
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":30,"series":4,"reps":12,"ressenti":3},
    {"name":"Shrugs haltères","group":"Trapèzes","charge":12,"series":3,"reps":15,"ressenti":4},
    {"name":"Arm Curl (haltères)","group":"Biceps","charge":10,"series":3,"reps":8,"ressenti":3.5},
    {"name":"Face Pull câble","group":"Delt_postérieur","charge":10,"series":3,"reps":15,"ressenti":4},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":50,"series":4,"reps":10,"ressenti":3},
    {"name":"Arm Curl inversé (haltères)","group":"Avant-bras","charge":5,"series":3,"reps":10,"ressenti":4}
  ]},
  {"id":"S16","date":"2026-04-04","energy":4,"exercises":[
    {"name":"Shoulder Press","group":"Épaules","charge":20,"series":4,"reps":10,"ressenti":2.5},
    {"name":"Chest Press","group":"Pectoraux","charge":35,"series":4,"reps":10,"ressenti":3},
    {"name":"Élévations latérales câble","group":"Delt_latéral","charge":2.5,"series":3,"reps":12,"ressenti":4},
    {"name":"Dips (poids de corps)","group":"Pectoraux","charge":0,"series":3,"reps":5,"ressenti":5},
    {"name":"Abdominal Crunch ELT+","group":"Abdos","charge":45,"series":3,"reps":12,"ressenti":4},
    {"name":"Arm Extension (triceps)","group":"Triceps","charge":20,"series":3,"reps":12,"ressenti":4}
  ]},
  {"id":"S17","date":"2026-04-07","energy":4,"exercises":[
    {"name":"Leg Press ELT+","group":"Quadriceps","charge":140,"series":3,"reps":12,"ressenti":3},
    {"name":"Leg Curl ELT+","group":"Ischio","charge":40,"series":3,"reps":12,"ressenti":3},
    {"name":"Chest Press","group":"Pectoraux","charge":35,"series":3,"reps":10,"ressenti":3},
    {"name":"Vertical Traction","group":"Dos_largeur","charge":50,"series":3,"reps":10,"ressenti":3},
    {"name":"Rowing assis","group":"Dos_épaisseur","charge":30,"series":3,"reps":12,"ressenti":3},
    {"name":"Élévations latérales câble","group":"Delt_latéral","charge":5,"series":3,"reps":12,"ressenti":4},
    {"name":"Face Pull câble","group":"Delt_postérieur","charge":10,"series":3,"reps":15,"ressenti":4}
  ]}
];

// Mapping: exercise group → anatomical muscles
const GROUP_TO_MUSCLES = {
  'Pectoraux': ['chest'],
  'Dos_largeur': ['upper-back'],
  'Dos_épaisseur': ['upper-back', 'trapezius'],
  'Épaules': ['front-deltoids'],
  'Delt_latéral': ['front-deltoids'],
  'Delt_postérieur': ['back-deltoids'],
  'Triceps': ['triceps'],
  'Biceps': ['biceps'],
  'Quadriceps': ['quadriceps'],
  'Ischio': ['hamstring'],
  'Abdos': ['abs', 'obliques'],
  'Trapèzes': ['trapezius'],
  'Avant-bras': ['forearm']
};

// Muscle display names (French)
const MUSCLE_NAMES = {
  'chest': 'Pectoraux',
  'upper-back': 'Dos (largeur)',
  'lower-back': 'Lombaires',
  'trapezius': 'Trapèzes',
  'front-deltoids': 'Épaules (ant. + lat.)',
  'back-deltoids': 'Deltoïdes postérieurs',
  'biceps': 'Biceps',
  'triceps': 'Triceps',
  'forearm': 'Avant-bras',
  'abs': 'Abdominaux',
  'obliques': 'Obliques',
  'quadriceps': 'Quadriceps',
  'hamstring': 'Ischio-jambiers',
  'calves': 'Mollets',
  'gluteal': 'Fessiers'
};

// Target weekly sets per muscle group
const VOLUME_TARGETS = {
  'Pectoraux': 14,
  'Dos_largeur': 10,
  'Dos_épaisseur': 10,
  'Épaules': 10,
  'Delt_latéral': 11,
  'Delt_postérieur': 9,
  'Triceps': 7,
  'Biceps': 7,
  'Quadriceps': 6,
  'Ischio': 6,
  'Abdos': 6,
  'Trapèzes': 3,
  'Avant-bras': 3
};

// Muscle guides (scientific content for each muscle)
const MUSCLE_GUIDES = {
  'chest': {
    title: 'Pectoraux (Grand pectoral)',
    priority: 'high',
    anatomy: '3 portions fonctionnelles — claviculaire (haut, activée par l\'incliné), sternocostale (milieu, activée par le plat), abdominale (bas, activée par les dips/décliné). Adducteur et rotateur interne de l\'humérus.',
    why: 'Les pecs créent la carrure de face. Sur un ectomorphe, un haut des pecs développé comble le creux sous-claviculaire et donne immédiatement un aspect plus massif. Progression actuelle : 20→35 kg au Chest Press (+75%).',
    volumeTarget: '12-16 séries/semaine sur 2-3 séances',
    exercises: [
      {
        name: 'Chest Press / Développé couché plat',
        rating: 5,
        sets: '3-4×8-10',
        why: 'Activation maximale de la portion sternocostale (SMD=1.80, p=0.017, méta-analyse 2023). Surcharge progressive prioritaire.',
        how: 'Omoplates serrées, pieds au sol. Descente contrôlée 2s jusqu\'au contact poitrine. Poussée explosive sans verrouiller les coudes en haut. Coudes à 45° du corps.',
        objective: '35→45-50 kg',
        searchTerm: 'chest press'
      },
      {
        name: 'Développé incliné 30° haltères',
        rating: 4,
        sets: '3×10-12',
        why: '30° = pic EMG portion claviculaire (Rodríguez-Ridao 2020, 30 sujets, 5 angles testés). À 45° le deltoïde antérieur prend le relais. Haltères = ROM supérieur + correction asymétries.',
        how: 'Banc incliné à 30° (2 crans). Haltères en prise neutre puis supination en montant. Descendre profond pour sentir l\'étirement. Coudes à 45°.',
        objective: '14→20 kg/main',
        searchTerm: 'incline dumbbell press'
      },
      {
        name: 'Dips (poids de corps → lesté)',
        rating: 4,
        sets: '2-3×max',
        why: 'Seul composé ciblant la portion abdominale (basse) avec stretch-mediated hypertrophy. Quand 3×10 → ajouter du lest.',
        how: 'Pencher le buste 30° vers l\'avant pour cibler les pecs vs les triceps. Descendre jusqu\'à ce que les épaules soient sous les coudes. Pousser en contractant les pecs.',
        objective: 'Actuellement 3×5 PDC → 3×10 puis +5 kg lesté',
        searchTerm: 'chest dip'
      },
      {
        name: 'Cable Flyes / Pec-Deck',
        rating: 3,
        sets: '3×12-15',
        why: 'Isolation pure sans implication tricipitale. Tension constante via câble. Utile pour le volume additionnel sans fatiguer les triceps.',
        how: 'Câbles à hauteur d\'épaules. Arc de cercle, mains qui se rejoignent devant la poitrine. Squeeze 1-2s. ROM complet.',
        objective: '10→15 kg',
        searchTerm: 'cable fly'
      }
    ],
    avoid: 'Développé décliné = redondant avec les dips. Pompes = insuffisant pour la surcharge progressive. Pullover = cible davantage le grand dorsal (EMG < 40% MVIC pec).'
  },
  'upper-back': {
    title: 'Dos — Largeur (Grand dorsal, Teres major)',
    priority: 'high',
    anatomy: 'Le grand dorsal est le muscle le plus large du corps humain. Insertions de T7 à L5 + crête iliaque. Fonctions : adduction, extension et rotation interne de l\'épaule. Crée le V-taper.',
    why: 'La largeur du dos compense visuellement les clavicules étroites de l\'ectomorphe. Un grand dorsal développé rétrécit la taille par illusion d\'optique. Progression : 30→50 kg (+67%).',
    volumeTarget: '9-12 séries/semaine (tirages verticaux)',
    exercises: [
      {
        name: 'Vertical Traction / Lat Pulldown',
        rating: 5,
        sets: '3-4×8-10',
        why: 'EMG #1 pour le grand dorsal (étude U. Wisconsin, Edelburg). La prise (large, moyenne, supination) n\'altère PAS significativement le recrutement (étude MDPI 2025, 40 sujets, p>0.05).',
        how: 'Prise légèrement plus large que les épaules. Initier le mouvement avec les COUDES (pas les mains). Tirer les coudes vers les hanches. Extension complète en haut pour étirer le grand dorsal. Max 15-20° d\'inclinaison arrière.',
        objective: '50→60 kg, puis transition vers tractions',
        searchTerm: 'lat pulldown'
      }
    ]
  },
  'trapezius': {
    title: 'Dos — Épaisseur (Trapèzes, Rhomboïdes, Érecteurs)',
    priority: 'high',
    anatomy: 'Trapèze moyen (rétraction scapulaire), rhomboïdes (sous le trapèze), érecteurs du rachis. L\'épaisseur du dos est visible de profil et de 3/4.',
    why: 'Complément indispensable de la largeur pour un dos 3D. Sous-entraîné actuellement.',
    volumeTarget: '9-12 séries/semaine (tirages horizontaux)',
    exercises: [
      {
        name: 'Rowing assis câble',
        rating: 5,
        sets: '3-4×10-12',
        why: 'EMG #1 trapèze moyen et rhomboïdes (U. Wisconsin). Position assise isole le dos sans fatigue lombaire.',
        how: 'Assis, genoux légèrement fléchis, pieds calés. Tirer vers le NOMBRIL (pas le sternum). Squeeze scapulaire 1s en fin de mouvement. Ne PAS utiliser l\'élan du buste.',
        objective: '30→40 kg',
        searchTerm: 'seated cable row'
      },
      {
        name: 'Rowing un bras haltère/câble',
        rating: 4,
        sets: '3×12-15',
        why: 'ROM supérieur en unilatéral (rétraction scapulaire complète). Corrige les asymétries droite/gauche (Fenwick 2009).',
        how: 'Un genou et une main sur le banc. Dos parallèle au sol. Tirer le coude vers le plafond. Squeeze scapula en haut. Descente lente et contrôlée.',
        objective: '12→20 kg',
        searchTerm: 'one arm dumbbell row'
      },
      {
        name: 'Shrugs haltères',
        rating: 3,
        sets: '2-3×12-15',
        why: 'Isole le trapèze supérieur — épaisseur cou/épaules. Reps hautes car fibres type I.',
        how: 'Debout, haltères le long du corps. Monter les épaules vers les oreilles SANS plier les coudes. Squeeze 2s en haut. Descente contrôlée.',
        objective: '12→20 kg',
        searchTerm: 'dumbbell shrug'
      }
    ]
  },
  'front-deltoids': {
    title: 'Deltoïdes Latéraux — PRIORITÉ #1',
    priority: 'critical',
    anatomy: 'Petit muscle sur l\'acromion. Fonction unique : abduction de l\'épaule. AUCUN exercice composé ne le cible adéquatement (bench = 5% MVIC seulement, Botton 2013).',
    why: 'Avec une ossature fine (clavicules étroites), chaque cm de muscle ajouté de chaque côté = +2 cm de largeur d\'épaules perçue. C\'est le muscle avec le meilleur retour sur investissement esthétique pour un profil ectomorphe. Actuellement TRÈS sous-entraîné.',
    volumeTarget: '10-12 séries/semaine sur 2-3 séances + composés',
    exercises: [
      {
        name: 'Élévations latérales câble',
        rating: 5,
        sets: '3-4×12-15',
        why: 'Tension constante sur tout le ROM (haltères = tension nulle en bas). Étude Frontiers in Physiology 2025 : hypertrophie identique câble vs haltère (3.3-4.6%).',
        how: 'Câble bas, prise du côté opposé (cross-body). Lever le bras jusqu\'à l\'HORIZONTALE (PAS au-dessus → impingement). Légère rotation interne (auriculaire vers le haut). Épaules BASSES. Descente contrôlée 2s.',
        objective: '2.5→5-7 kg (normal que ce soit léger)',
        searchTerm: 'cable lateral raise'
      },
      {
        name: 'Élévations latérales haltères',
        rating: 4,
        sets: '3×12-15',
        why: 'Profil de résistance complémentaire (pic à 90° vs constant au câble). La combinaison couvre toute la courbe force-longueur.',
        how: 'Debout, légèrement penché en avant. Lever les bras sur les côtés. PAS de balancement du corps. Poids LÉGER.',
        objective: '5→8 kg',
        searchTerm: 'dumbbell lateral raise'
      },
      {
        name: 'Développé épaules haltères',
        rating: 5,
        sets: '3-4×10-12',
        why: 'EMG #1 deltoïde antérieur (U. Wisconsin, 10 exercices comparés). Haltères > barre pour la stabilisation.',
        how: 'Assis, dos calé contre le dossier. Haltères à hauteur d\'oreilles, paumes vers l\'avant. Pousser en arc. Descendre jusqu\'aux oreilles (ROM complet). Ne pas arquer le dos.',
        objective: '20→25-28 kg',
        searchTerm: 'dumbbell shoulder press'
      }
    ],
    avoid: 'Upright row = risque impingement sous-acromial. Front raises = totalement redondant avec le bench/shoulder press.'
  },
  'back-deltoids': {
    title: 'Deltoïdes Postérieurs',
    priority: 'high',
    anatomy: 'Extension horizontale de l\'épaule + rotation externe. Sous-développé chez 90% des débutants.',
    why: '1) Profondeur 3D des épaules de côté/dos. 2) Équilibre rotateurs internes/externes → prévention blessures. 3) Actuellement quasi inexistant.',
    volumeTarget: '8-10 séries/semaine',
    exercises: [
      {
        name: 'Face Pull câble',
        rating: 5,
        sets: '3×15-20',
        why: '2-en-1 : deltoïde postérieur (78% MVIC, étude ACE) + rotation externe (infraspinatus). Exercice correctif ET hypertrophique.',
        how: 'Câble haut avec corde. Tirer vers le FRONT (pas la poitrine). Coudes hauts, au-dessus des épaules. Finir en position "double biceps" avec rotation externe maximale. Poids LÉGER.',
        objective: '10→15 kg',
        searchTerm: 'face pull'
      },
      {
        name: 'Reverse Flyes (machine/câble)',
        rating: 4,
        sets: '3×15-20',
        why: 'Isolation pure. 82% MVC (ACE study, #1 activation isolée).',
        how: 'Assis sur la machine pec-deck inversée. Ouvrir les bras en ligne droite. Squeeze 1s en position contractée. Ne PAS utiliser les trapèzes.',
        objective: '5→10 kg',
        searchTerm: 'reverse fly'
      }
    ]
  },
  'triceps': {
    title: 'Triceps (Chef long, latéral, médial)',
    priority: 'medium',
    anatomy: '3 chefs. Le chef long est bi-articulaire (s\'insère sur la scapula) et le plus volumineux. Le latéral forme le "fer à cheval" visible. Les triceps = 2/3 du volume du bras (~67% fibres type II).',
    why: 'Plus d\'impact sur le tour de bras que les biceps. Volume indirect significatif via bench/dips/shoulder press. Progression : 10→20 kg (+100%).',
    volumeTarget: '6-8 séries/semaine en isolation directe',
    exercises: [
      {
        name: 'Extensions overhead câble',
        rating: 5,
        sets: '2-3×12-15',
        why: 'Le chef long est étiré en position overhead → croissance 1.4× SUPÉRIEURE vs pushdowns (Maeo et al.). Stretch-mediated hypertrophy.',
        how: 'Dos au câble haut, corde derrière la tête. Coudes FIXES pointés vers le plafond. Extension complète du coude. Excentrique lent 2-3s.',
        objective: '20→25-30 kg',
        searchTerm: 'overhead cable tricep extension'
      },
      {
        name: 'Pushdowns câble',
        rating: 3,
        sets: '2×12-15',
        why: 'Complément pour le chef latéral. Prise pronation ou corde.',
        how: 'Face au câble haut. Coudes collés au corps, immobiles. Pousser vers le bas jusqu\'à extension complète. Contraction 1s en bas.',
        objective: '15→25 kg',
        searchTerm: 'tricep pushdown'
      }
    ]
  },
  'biceps': {
    title: 'Biceps (Chef long, chef court, brachial)',
    priority: 'medium',
    anatomy: 'Chef long (pic, portion externe), chef court (masse, portion interne), brachial (sous le biceps), brachio-radial (avant-bras). ~67% fibres type II.',
    why: 'Volume direct limité car TOUS les tirages recrutent déjà les fléchisseurs du coude. Attention : échec à 20 kg en S11 (ressenti 5) → revenir à 15 kg.',
    volumeTarget: '6-8 séries/semaine en isolation directe',
    exercises: [
      {
        name: 'Curls inclinés haltères',
        rating: 5,
        sets: '2-3×10-12',
        why: 'MEILLEUR exercice biceps. Épaule en extension = chef long étiré = stretch-mediated hypertrophy. EMG chef long significativement supérieur aux curls debout.',
        how: 'Banc incliné 45-60°. Bras pendants derrière le corps. Curl STRICT — seul l\'avant-bras bouge. Descente COMPLÈTE. Mouvement LENT et contrôlé.',
        objective: '8→14 kg/main',
        searchTerm: 'incline dumbbell curl'
      },
      {
        name: 'Hammer Curls',
        rating: 3,
        sets: '2×12-15',
        why: 'Brachial + brachio-radial. Épaissit l\'avant-bras, corrige l\'aspect "poignets fins" de l\'ectomorphe.',
        how: 'Prise neutre (paumes face à face). Coudes collés au corps. Pas de balancement. Contraction lente, descente contrôlée.',
        objective: '10→14 kg',
        searchTerm: 'hammer curl'
      }
    ]
  },
  'quadriceps': {
    title: 'Quadriceps (maintenance)',
    priority: 'maintenance',
    anatomy: 'Groupe de 4 muscles (vaste latéral, vaste médial, vaste intermédiaire, droit fémoral). Extenseurs du genou.',
    why: 'Déjà plus développés que le haut du corps. Le football + la marche (10 000 pas/jour) fournissent un stimulus additionnel. Volume minimal pour ne pas déséquilibrer.',
    volumeTarget: '3 séries/semaine (maintenance)',
    exercises: [
      {
        name: 'Leg Press ELT+',
        rating: 4,
        sets: '3×10-12',
        why: 'Mouvement composé sûr sans charge axiale. Idéal pour la maintenance.',
        how: 'Pieds milieu de plateforme, largeur d\'épaules. Descendre jusqu\'à 90° de flexion du genou. Pousser sans verrouiller les genoux.',
        objective: '130-140 kg STABLE (pas de progression)',
        searchTerm: 'leg press'
      }
    ]
  },
  'hamstring': {
    title: 'Ischio-jambiers (maintenance)',
    priority: 'maintenance',
    anatomy: 'Biceps fémoral, semi-tendineux, semi-membraneux. Flexion du genou + extension de la hanche.',
    why: 'Maintenance pour la prévention des blessures, surtout avec le football.',
    volumeTarget: '3 séries/semaine (maintenance)',
    exercises: [
      {
        name: 'Leg Curl ELT+',
        rating: 4,
        sets: '3×10-12',
        why: 'Isolation des ischio-jambiers. Prévention blessures football (ratio quad/ischio).',
        how: 'Allongé, coussin sur les chevilles. Flexion complète du genou. Descente contrôlée.',
        objective: '40-45 kg (stable)',
        searchTerm: 'leg curl'
      }
    ]
  },
  'abs': {
    title: 'Abdominaux',
    priority: 'low',
    anatomy: 'Grand droit (6-pack), obliques internes/externes, transverse. Les abdos deviennent visibles par la perte de gras, pas par l\'hypertrophie.',
    why: 'Renforcement du core pour la stabilité. Pas de priorité esthétique — ils seront visibles naturellement avec un taux de gras bas.',
    volumeTarget: '4-6 séries/semaine',
    exercises: [
      {
        name: 'Abdominal Crunch ELT+',
        rating: 3,
        sets: '2-3×12-15',
        why: 'Surcharge progressive possible sur machine. Simple et efficace.',
        how: 'Ajuster le siège pour que le pivot soit au niveau du nombril. Contraction lente et contrôlée. Ne pas utiliser les bras pour tirer.',
        objective: '45→55 kg',
        searchTerm: 'crunch machine'
      }
    ]
  },
  'forearm': {
    title: 'Avant-bras',
    priority: 'low',
    anatomy: 'Fléchisseurs et extenseurs du poignet, brachio-radial. Visuellement importants car toujours exposés.',
    why: 'Corrige l\'aspect "poignets fins" de l\'ectomorphe. Travail indirect via curls et tirages.',
    volumeTarget: '3-6 séries/semaine',
    exercises: [
      {
        name: 'Curls inversés haltères',
        rating: 4,
        sets: '2-3×10-15',
        why: 'Cible les extenseurs du poignet et le brachio-radial.',
        how: 'Prise pronée (paumes vers le bas). Curl strict, poids léger. Descente contrôlée.',
        objective: '5→10 kg',
        searchTerm: 'reverse curl'
      },
      {
        name: 'Hammer Curls',
        rating: 3,
        sets: '2×12-15',
        why: 'Double fonction : biceps + brachio-radial.',
        how: 'Prise neutre. Mouvement lent et contrôlé.',
        objective: '10→14 kg',
        searchTerm: 'hammer curl'
      }
    ]
  }
};

// Add aliases for shared muscle views
MUSCLE_GUIDES['obliques'] = MUSCLE_GUIDES['abs'];
MUSCLE_GUIDES['lower-back'] = {
  title: 'Lombaires (Érecteurs du rachis)',
  priority: 'low',
  anatomy: 'Muscles paravertébraux qui stabilisent la colonne. Travaillés indirectement par les rowing et deadlifts.',
  why: 'Pas de travail direct nécessaire — suffisamment stimulés par les rowing assis et le gainage.',
  volumeTarget: 'Travail indirect suffisant',
  exercises: []
};
MUSCLE_GUIDES['gluteal'] = {
  title: 'Fessiers',
  priority: 'maintenance',
  anatomy: 'Grand glutéal, moyen glutéal. Extenseur et abducteur de la hanche.',
  why: 'Travaillés indirectement par le leg press et le football. Pas de priorité.',
  volumeTarget: 'Travail indirect suffisant',
  exercises: []
};
MUSCLE_GUIDES['calves'] = {
  title: 'Mollets',
  priority: 'maintenance',
  anatomy: 'Gastrocnémien et soléaire. Flexion plantaire.',
  why: 'Travaillés par la marche (10 000 pas/jour) et le football.',
  volumeTarget: 'Travail indirect suffisant',
  exercises: []
};

// 12-week planning
const PLANNING = (() => {
  const weeks = [];
  // Week 1 starts Monday April 6, sessions on Tue 7, Thu 9, Sat 11
  const weekOneMonday = new Date(2026, 3, 6);

  const SESSION_A = {
    name: 'Session A — Full Body Intense',
    type: 'session-a',
    exercises: [
      { name: 'Chest Press', group: 'Pectoraux', sets: '4×8-10', focus: 'Composé lourd #1. Surcharge progressive prioritaire — portion sternocostale' },
      { name: 'Vertical Traction', group: 'Dos_largeur', sets: '4×8-10', focus: 'Composé lourd #2. Surcharge progressive — grand dorsal (V-taper)' },
      { name: 'Rowing assis', group: 'Dos_épaisseur', sets: '4×10-12', focus: 'Composé lourd #3. Surcharge progressive — trapèze moyen + rhomboïdes' },
      { name: 'Shoulder Press', group: 'Épaules', sets: '3×10-12', focus: 'Composé — deltoïde antérieur + triceps indirect' },
      { name: 'Élévations latérales câble', group: 'Delt_latéral', sets: '4×12-15', focus: '⚡ PRIORITÉ #1 — tension constante, deltoïde latéral isolé' },
      { name: 'Extensions overhead câble', group: 'Triceps', sets: '3×12-15', focus: 'Chef long en stretch — hypertrophie 1.4× vs pushdowns (Maeo)' },
      { name: 'Face Pull câble', group: 'Delt_postérieur', sets: '3×15-20', focus: 'Correctif + hypertrophique — rotation externe + deltoïde postérieur' },
      { name: 'Shrugs haltères', group: 'Trapèzes', sets: '2×12-15', focus: 'Trapèze supérieur — épaisseur cou/épaules' },
      { name: 'Hammer Curls', group: 'Biceps', sets: '2×12-15', focus: 'Brachial + brachio-radial — épaisseur avant-bras' }
    ]
  };

  const SESSION_B = {
    name: 'Session B — Full Body Moyen',
    type: 'session-b',
    exercises: [
      { name: 'Développé incliné 30° haltères', group: 'Pectoraux', sets: '3×10-12', focus: 'Portion claviculaire (haut des pecs) — angle 30° optimal (Rodríguez-Ridao 2020)' },
      { name: 'Vertical Traction prise serrée', group: 'Dos_largeur', sets: '3×10-12', focus: '2e stimulus grand dorsal — variation de prise pour angle différent' },
      { name: 'Rowing un bras haltère', group: 'Dos_épaisseur', sets: '3×12-15', focus: 'ROM supérieur en unilatéral — correction asymétries (Fenwick 2009)' },
      { name: 'Dips (poids de corps)', group: 'Pectoraux', sets: '3×max', focus: 'Portion basse pecs + stretch-mediated hypertrophy — progresser vers lesté à 3×10' },
      { name: 'Élévations latérales haltères', group: 'Delt_latéral', sets: '3×12-15', focus: '⚡ 2e stimulus delt latéral — pic de tension à 90° (complémentaire au câble)' },
      { name: 'Face Pull câble', group: 'Delt_postérieur', sets: '3×15-20', focus: '2e stimulus delt postérieur — rotation externe + santé épaule' },
      { name: 'Curls inclinés haltères', group: 'Biceps', sets: '3×10-12', focus: 'MEILLEUR exercice biceps — chef long en stretch (banc 45-60°)' }
    ]
  };

  const SESSION_C = {
    name: 'Session C — Full Body Léger + Jambes',
    type: 'session-c',
    exercises: [
      { name: 'Leg Press ELT+', group: 'Quadriceps', sets: '3×10-12', focus: 'Maintenance — charges stables 130-140 kg, pas de progression' },
      { name: 'Leg Curl ELT+', group: 'Ischio', sets: '3×10-12', focus: 'Maintenance — prévention blessures football' },
      { name: 'Chest Press', group: 'Pectoraux', sets: '3×10-12', focus: '3e stimulus pecs — charges plus légères, focus connexion muscle-esprit' },
      { name: 'Vertical Traction', group: 'Dos_largeur', sets: '3×10-12', focus: '3e stimulus grand dorsal — volume additionnel' },
      { name: 'Rowing assis', group: 'Dos_épaisseur', sets: '3×10-12', focus: '3e stimulus dos épaisseur — squeeze scapulaire 1s' },
      { name: 'Élévations latérales câble', group: 'Delt_latéral', sets: '3×12-15', focus: '⚡ 3e stimulus delt latéral — ce muscle récupère vite, fréquence élevée possible' },
      { name: 'Face Pull câble', group: 'Delt_postérieur', sets: '3×15-20', focus: '3e stimulus delt postérieur — rotation externe + santé épaule, fréquence 3x/sem OK' }
    ]
  };

  const sessionTypes = [SESSION_A, SESSION_B, SESSION_C];
  const dayOffsets = [1, 3, 5]; // Tue=+1, Thu=+3, Sat=+5 from Monday

  for (let w = 0; w < 12; w++) {
    const weekStart = new Date(weekOneMonday);
    weekStart.setDate(weekStart.getDate() + w * 7);
    const isDeload = w === 6; // Week 7 (0-indexed: 6)
    let phase;
    if (w < 4) phase = 'Accumulation';
    else if (w < 8) phase = 'Intensification';
    else phase = 'Pic';

    const sessions = [];
    for (let d = 0; d < 3; d++) {
      const sessionDate = new Date(weekStart);
      sessionDate.setDate(sessionDate.getDate() + dayOffsets[d]);
      const template = sessionTypes[d];

      const exercises = template.exercises.map(ex => ({
        ...ex,
        sets: isDeload ? ex.sets.replace(/^\d+-?\d*/, '2') : ex.sets,
        deloadNote: isDeload ? 'Charges -40%, focus technique' : null
      }));

      sessions.push({
        date: sessionDate.getFullYear() + '-' + String(sessionDate.getMonth()+1).padStart(2,'0') + '-' + String(sessionDate.getDate()).padStart(2,'0'),
        dayName: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][sessionDate.getDay()],
        name: template.name,
        type: template.type,
        exercises,
        isDeload
      });
    }

    weeks.push({
      number: w + 1,
      phase,
      isDeload,
      sessions,
      dateRange: `${sessions[0].date} → ${sessions[2].date}`
    });
  }
  return weeks;
})();

// Science content
const SCIENCE_CONTENT = {
  hypertrophy: {
    title: 'Hypertrophie musculaire',
    points: [
      { title: 'Tension mécanique', text: 'Stimulus principal de l\'hypertrophie. Active la cascade Akt/mTOR/p70S6K. Bloquer mTOR supprime complètement l\'hypertrophie (Bodine 2001).', source: 'Bodine et al., 2001' },
      { title: 'Volume optimal', text: '10-20 séries/groupe/semaine. Relation dose-réponse linéaire jusqu\'à ~20 séries.', source: 'Schoenfeld & Krieger 2017, méta-analyse, 15 études, p=0.002' },
      { title: 'Fréquence', text: '≥2x/semaine par muscle supérieur à 1x/semaine. À volume égal, la fréquence n\'a pas d\'effet indépendant.', source: 'Schoenfeld 2016, méta-analyse' },
      { title: 'Proximité de l\'échec', text: '1-3 RIR (Reps In Reserve) est optimal. Échec total = fatigue excessive pour un bénéfice marginal.', source: 'Grgic 2022, revue systématique' },
      { title: 'ROM complet', text: 'L\'amplitude complète est supérieure aux partiels. L\'entraînement en position étirée produit plus d\'hypertrophie (stretch-mediated hypertrophy).', source: 'Wolf et al. 2023' },
      { title: 'Courbatures ≠ croissance', text: 'Les courbatures NE SONT PAS un indicateur fiable de croissance musculaire. La MPS en semaine 1 n\'est PAS corrélée à l\'hypertrophie à long terme.', source: 'Damas et al. 2016' },
      { title: 'Stretch-mediated hypertrophy', text: 'Un muscle étiré sous charge active davantage les mécanorécepteurs membranaires et les cellules satellites, produisant plus d\'hypertrophie. C\'est pourquoi les extensions overhead sont 40% plus efficaces que les pushdowns pour le chef long du triceps (Maeo et al.), et pourquoi les curls inclinés sont supérieurs aux curls debout pour le chef long du biceps. Concrètement : privilégier les exercices qui placent le muscle en position étirée sous charge.', source: 'Maeo et al. 2021, Pedrosa et al. 2023' }
    ]
  },
  nutrition: {
    title: 'Nutrition',
    points: [
      { title: 'Protéines', text: '1.6-2.2 g/kg/jour. Point d\'inflexion à 1.62 g/kg. Cible : 155-170g/jour sur 4 repas de 38-43g.', source: 'Morton 2018, méta-analyse, 49 ECR' },
      { title: 'Seuil leucine', text: '2.5-3.0g par repas pour activer mTORC1. 30g whey = ~3g leucine.', source: 'Littérature consensus' },
      { title: 'Surplus calorique', text: '300-500 kcal au-dessus du TDEE. Cible : 3200-3500 kcal/jour. Si stagnation 2 semaines → +200 kcal.', source: 'Iraki 2019, revue' },
      { title: 'Créatine', text: '5g/jour monohydrate. +1.4 kg masse maigre, +4.4 kg au 1RM haut du corps en moyenne.', source: 'Méta-analyses multiples' },
      { title: 'Caséine nocturne', text: '30-40g avant le coucher augmente la synthèse protéique nocturne de 22-30%.', source: 'Snijders 2015' },
      { title: 'Ciblage impossible', text: 'On NE PEUT PAS orienter les nutriments vers une zone du corps. Le seul levier est le volume d\'entraînement.', source: 'Consensus physiologique' },
      { title: 'Distribution protéique', text: '4 repas de 38-43g de protéines espacés de 3-5h est supérieur à 2 gros repas ou 8 mini-doses. Le muscle devient réfractaire 2-3h après un bolus de protéines (phénomène du "muscle plein" — Atherton 2010). Il faut attendre avant qu\'il soit de nouveau réceptif.', source: 'Areta et al. 2013' },
      { title: 'Glucides = carburant, pas signal anabolique', text: 'Les glucides ne stimulent pas directement la synthèse protéique. Mais le glycogène est le carburant principal de la contraction anaérobie. Une séance réduit le glycogène des fibres type II de 24-40%. Cible : 4-5 g/kg/jour (310-390g).', source: 'Revue systématique 2022' }
    ]
  },
  recovery: {
    title: 'Récupération',
    points: [
      { title: 'Sommeil', text: '7.5-9h/nuit. 70% de la GH est sécrétée en sommeil profond. 5h/nuit pendant 1 semaine = -15% testostérone.', source: 'Leproult 2011' },
      { title: 'Stress', text: 'Le cortisol chronique inhibe mTOR et active la protéolyse. Ajuster le volume d\'entraînement si stress élevé.', source: 'Littérature endocrinologie' },
      { title: 'Deload', text: 'Toutes les 6-8 semaines. Volume -40-60%, intensité -10%. Permet la dissipation de la fatigue accumulée.', source: 'Recommandations NSCA' }
    ]
  },
  doubleProgression: {
    title: 'Double progression (méthode de surcharge)',
    steps: [
      'Travailler dans la fourchette prescrite (ex: 8-12 reps)',
      'Progresser en reps jusqu\'à atteindre la borne haute sur TOUTES les séries',
      'Augmenter la charge de +2.5 kg (haut du corps) ou +5 kg (bas du corps)',
      'Revenir à la borne basse avec la nouvelle charge',
      'Recommencer le cycle'
    ]
  },
  scales: {
    ressenti: [
      { value: 1, label: 'Trop facile', action: 'Augmenter la charge' },
      { value: 2, label: 'Facile', action: '3+ reps de marge' },
      { value: 3, label: 'Dur mais OK', action: '1-2 RIR — zone idéale' },
      { value: 4, label: 'Très dur', action: '0-1 RIR' },
      { value: 5, label: 'Échec', action: 'Réduire la charge' }
    ],
    energy: [
      { value: 1, label: 'Très fatigué', color: '#ef4444' },
      { value: 2, label: 'Fatigué / post-foot', color: '#f97316' },
      { value: 3, label: 'Normal', color: '#eab308' },
      { value: 4, label: 'Bonne énergie', color: '#22c55e' },
      { value: 5, label: 'Forme exceptionnelle', color: '#06b6d4' }
    ]
  }
};

// User profile
const USER_PROFILE = {
  age: 26,
  height: 187,
  weight: 77.5,
  startWeight: 73,
  morphology: 'Ectomorphe — ossature fine, longiligne, très peu de masse grasse',
  particularity: 'Jambes proportionnellement plus développées que le haut du corps',
  history: 'Sous-alimentation chronique (~1500 kcal/jour), reprise depuis 2 mois',
  sessions: 17,
  objective: 'Transformer le haut du corps (pecs, épaules, dos, bras) tout en maintenant les jambes',
  nutrition: {
    calories: '3200-3500 kcal/jour',
    protein: '155-170g protéines/jour',
    supplements: 'Optionnel : créatine 3-5g/jour'
  }
};

// Available gym machines
const GYM_MACHINES = [
  'Abdominal Crunch ELT+', 'Abductor ELT', 'Adductor ELT', 'Arm Curl',
  'Arm Extension (triceps)', 'Cable Stations 4', 'Chest Press',
  'Chin Up / Dip / Leg Raise', 'DAP ELT+', 'Glute', 'Glute ELT+',
  'Hack Squat Pure', 'Hip Thrust Pure', 'Leg Curl ELT+', 'Leg Extension ELT+',
  'Leg Press ELT+', 'Leg Press Pure', 'Leg Raise / Dip', 'Multipla',
  'Multipower', 'Multipower ELT', 'Rowing assis', 'Shoulder Press',
  'Squat', 'Standing Gluteus', 'Vertical Traction'
];

// Exercise name suggestions for the form
const EXERCISE_SUGGESTIONS = [
  'Chest Press', 'Développé incliné 30° haltères', 'Dips (poids de corps)',
  'Cable Flyes', 'Vertical Traction', 'Vertical Traction prise serrée',
  'Rowing assis', 'Rowing un bras haltère', 'Shoulder Press',
  'Développé épaules haltères', 'Élévations latérales câble',
  'Élévations latérales haltères', 'Face Pull câble', 'Reverse Flyes',
  'Arm Extension (triceps)', 'Extensions overhead câble', 'Pushdowns câble',
  'Arm Curl', 'Arm Curl (haltères)', 'Curls inclinés haltères',
  'Hammer Curls', 'Arm Curl inversé', 'Arm Curl inversé (haltères)',
  'Shrugs haltères', 'Leg Press ELT+', 'Leg Curl ELT+',
  'Abdominal Crunch ELT+', 'Gainage'
];

// Auto-fill mapping: exercise name → default muscle group
const EXERCISE_TO_GROUP = {
  'Chest Press': 'Pectoraux',
  'Chest Press (autre machine)': 'Pectoraux',
  'Développé incliné 30° haltères': 'Pectoraux',
  'Développé incliné haltères': 'Pectoraux',
  'Dips (poids de corps)': 'Pectoraux',
  'Cable Flyes': 'Pectoraux',
  'Vertical Traction': 'Dos_largeur',
  'Vertical Traction prise serrée': 'Dos_largeur',
  'Rowing assis': 'Dos_épaisseur',
  'Rowing un bras haltère': 'Dos_épaisseur',
  'Shoulder Press': 'Épaules',
  'Développé épaules haltères': 'Épaules',
  'Élévations latérales câble': 'Delt_latéral',
  'Élévations latérales haltères': 'Delt_latéral',
  'Face Pull câble': 'Delt_postérieur',
  'Reverse Flyes': 'Delt_postérieur',
  'Arm Extension (triceps)': 'Triceps',
  'Extensions overhead câble': 'Triceps',
  'Pushdowns câble': 'Triceps',
  'Arm Curl': 'Biceps',
  'Arm Curl (haltères)': 'Biceps',
  'Curls inclinés haltères': 'Biceps',
  'Hammer Curls': 'Biceps',
  'Arm Curl inversé': 'Avant-bras',
  'Arm Curl inversé (haltères)': 'Avant-bras',
  'Shrugs haltères': 'Trapèzes',
  'Leg Press ELT+': 'Quadriceps',
  'Leg Curl ELT+': 'Ischio',
  'Abdominal Crunch ELT+': 'Abdos',
  'Gainage': 'Abdos',
};

const MUSCLE_GROUPS = [
  'Pectoraux', 'Dos_largeur', 'Dos_épaisseur', 'Épaules', 'Delt_latéral', 'Delt_postérieur',
  'Triceps', 'Biceps', 'Quadriceps', 'Ischio', 'Abdos',
  'Trapèzes', 'Avant-bras'
];

// ============================================================
// Exercise image mapping → free-exercise-db (GitHub)
// Each exercise → [folder_name] → 2 images (start/end position)
// ============================================================
const EXERCISE_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const EXERCISE_IMAGES = {
  'chest press':            'Barbell_Bench_Press_-_Medium_Grip',
  'bench press':            'Barbell_Bench_Press_-_Medium_Grip',
  'incline dumbbell press': 'Incline_Dumbbell_Press',
  'chest dip':              'Dips_-_Chest_Version',
  'cable fly':              'Flat_Bench_Cable_Flyes',
  'lat pulldown':           'Close-Grip_Front_Lat_Pulldown',
  'seated cable row':       'Seated_Cable_Rows',
  'one arm dumbbell row':   'One-Arm_Dumbbell_Row',
  'dumbbell shrug':         'Dumbbell_Shrug',
  'cable lateral raise':    'Cable_Seated_Lateral_Raise',
  'dumbbell lateral raise': 'Side_Lateral_Raise',
  'dumbbell shoulder press':'Dumbbell_Shoulder_Press',
  'face pull':              'Face_Pull',
  'reverse fly':            'Reverse_Flyes',
  'overhead cable tricep extension': 'Cable_Rope_Overhead_Triceps_Extension',
  'tricep pushdown':        'Triceps_Pushdown',
  'incline dumbbell curl':  'Alternate_Incline_Dumbbell_Curl',
  'hammer curl':            'Alternate_Hammer_Curl',
  'reverse curl':           'Standing_Dumbbell_Reverse_Curl',
  'barbell curl':           'Barbell_Curl',
  'leg press':              'Leg_Press',
  'leg curl':               'Lying_Leg_Curls',
  'crunch machine':         'Ab_Crunch_Machine',
};

// ============================================================
// Muscle subdivisions — detailed portions for each muscle group
// ============================================================
const MUSCLE_SUBDIVISIONS = {
  'chest': {
    name: 'Pectoraux',
    portions: [
      { id: 'upper-chest', name: 'Portion claviculaire (haut)', exercises: ['Développé incliné 30° haltères', 'Développé incliné haltères'] },
      { id: 'mid-chest',   name: 'Portion sternocostale (milieu)', exercises: ['Chest Press', 'Chest Press (autre machine)', 'Cable Flyes'] },
      { id: 'lower-chest', name: 'Portion abdominale (bas)', exercises: ['Dips (poids de corps)'] }
    ]
  },
  'front-deltoids': {
    name: 'Deltoïdes',
    portions: [
      { id: 'front-delt',  name: 'Chef antérieur', exercises: ['Shoulder Press', 'Développé épaules haltères'] },
      { id: 'side-delt',   name: 'Chef latéral', exercises: ['Élévations latérales câble', 'Élévations latérales haltères'] },
      { id: 'rear-delt',   name: 'Chef postérieur', exercises: ['Face Pull câble', 'Reverse Flyes'] }
    ]
  },
  'upper-back': {
    name: 'Dos',
    portions: [
      { id: 'lats',       name: 'Grand dorsal — Largeur (V-taper)', exercises: ['Vertical Traction'] },
      { id: 'mid-back',   name: 'Trapèze moyen + Rhomboïdes — Épaisseur', exercises: ['Rowing assis', 'Rowing un bras haltère'] },
      { id: 'upper-traps', name: 'Trapèze supérieur', exercises: ['Shrugs haltères'] }
    ]
  },
  'triceps': {
    name: 'Triceps',
    portions: [
      { id: 'tri-long',    name: 'Chef long (le plus gros)', exercises: ['Extensions overhead câble', 'Arm Extension (triceps)'] },
      { id: 'tri-lateral', name: 'Chef latéral (fer à cheval)', exercises: ['Pushdowns câble'] },
      { id: 'tri-medial',  name: 'Chef médial (stabilisateur)', exercises: [] }
    ]
  },
  'biceps': {
    name: 'Biceps',
    portions: [
      { id: 'bi-long',     name: 'Chef long (pic)', exercises: ['Curls inclinés haltères', 'Arm Curl', 'Arm Curl (haltères)'] },
      { id: 'bi-short',    name: 'Chef court (masse)', exercises: ['Arm Curl', 'Arm Curl (haltères)'] },
      { id: 'brachial',    name: 'Brachial + brachio-radial', exercises: ['Hammer Curls', 'Arm Curl inversé', 'Arm Curl inversé (haltères)'] }
    ]
  }
};

// Map exercise names to the muscle groups they belong to (for history lookups)
const MUSCLE_TO_GROUPS = {
  'chest':          ['Pectoraux'],
  'upper-back':     ['Dos_largeur', 'Dos_épaisseur'],
  'lower-back':     ['Dos_épaisseur'],
  'trapezius':      ['Dos_épaisseur', 'Trapèzes'],
  'front-deltoids': ['Épaules', 'Delt_latéral'],
  'back-deltoids':  ['Delt_postérieur'],
  'biceps':         ['Biceps'],
  'triceps':        ['Triceps'],
  'forearm':        ['Avant-bras'],
  'abs':            ['Abdos'],
  'obliques':       ['Abdos'],
  'quadriceps':     ['Quadriceps'],
  'hamstring':      ['Ischio'],
  'calves':         [],
  'gluteal':        [],
  'adductors':      [],
  'abductors':      [],
};

// ============================================================
// Exercise execution guides + MuscleWiki links
// ============================================================
const EXERCISE_VIDEOS = {
  'chest press':                   'https://musclewiki.com/exercise/machine-chest-press',
  'vertical traction':             'https://musclewiki.com/exercise/machine-pulldown',
  'vertical traction prise serrée':'https://musclewiki.com/exercise/machine-pulldown',
  'rowing assis':                  'https://musclewiki.com/exercise/machine-seated-cable-row',
  'shoulder press':                'https://musclewiki.com/exercise/dumbbell-seated-overhead-press',
  'développé épaules haltères':    'https://musclewiki.com/exercise/dumbbell-seated-overhead-press',
  'élévations latérales câble':    'https://musclewiki.com/exercise/cable-low-single-arm-lateral-raise',
  'élévations latérales haltères': 'https://musclewiki.com/exercise/dumbbell-lateral-raise',
  'extensions overhead câble':     'https://musclewiki.com/exercise/cable-rope-overhead-tricep-extension',
  'arm extension (triceps)':       'https://musclewiki.com/exercise/cable-rope-overhead-tricep-extension',
  'face pull câble':               'https://musclewiki.com/exercise/machine-face-pulls',
  'face pull':                     'https://musclewiki.com/exercise/machine-face-pulls',
  'dips (poids de corps)':         'https://musclewiki.com/exercise/box-dips',
  'dips':                          'https://musclewiki.com/exercise/box-dips',
  'développé incliné 30° haltères':'https://musclewiki.com/exercise/dumbbell-incline-bench-press',
  'développé incliné haltères':    'https://musclewiki.com/exercise/dumbbell-incline-bench-press',
  'rowing un bras haltère':        'https://musclewiki.com/exercise/dumbbell-incline-row',
  'rowing un bras':                'https://musclewiki.com/exercise/dumbbell-incline-row',
  'curls inclinés haltères':       'https://musclewiki.com/exercise/dumbbell-incline-curl',
  'curls inclinés':                'https://musclewiki.com/exercise/dumbbell-incline-curl',
  'hammer curls':                  'https://musclewiki.com/exercise/dumbbell-hammer-curl',
  'shrugs haltères':               'https://musclewiki.com/exercise/dumbbell-shrug',
  'shrugs':                        'https://musclewiki.com/exercise/dumbbell-shrug',
  'reverse flyes':                 'https://musclewiki.com/exercise/machine-reverse-fly',
  'pushdowns câble':               'https://musclewiki.com/exercise/cable-rope-pushdown',
  'pushdowns':                     'https://musclewiki.com/exercise/cable-rope-pushdown',
  'leg press elt+':                'https://musclewiki.com/exercise/machine-leg-press',
  'leg press':                     'https://musclewiki.com/exercise/machine-leg-press',
  'leg curl elt+':                 'https://musclewiki.com/exercise/machine-seated-leg-curl',
  'leg curl':                      'https://musclewiki.com/exercise/machine-seated-leg-curl',
  'arm curl':                      'https://musclewiki.com/exercise/dumbbell-curl',
  'arm curl (haltères)':           'https://musclewiki.com/exercise/dumbbell-curl',
  'curls ez-bar':                  'https://musclewiki.com/exercise/dumbbell-curl',
  'arm curl inversé':              'https://musclewiki.com/exercise/dumbbell-incline-reverse-curl',
  'arm curl inversé (haltères)':   'https://musclewiki.com/exercise/dumbbell-incline-reverse-curl',
  'abdominal crunch elt+':         'https://musclewiki.com/exercise/machine-crunch',
  'cable flyes':                   'https://musclewiki.com/exercise/cable-chest-press',
  'gainage':                       'https://musclewiki.com/exercise/front-plank',
};

const EXERCISE_EXECUTION = {
  'Chest Press': "S'asseoir dos plaqué contre le dossier. Régler la hauteur pour que les poignées soient au niveau du milieu de la poitrine. Saisir les poignées, coudes à 45° du corps (PAS à 90°). Inspirer, pousser en expirant jusqu'à extension quasi-complète sans verrouiller les coudes. Revenir en 2-3 secondes jusqu'à sentir un léger étirement des pecs. Ne pas relâcher la tension en bas. Omoplates serrées pendant tout le mouvement.",
  'Vertical Traction': "S'asseoir, cuisses calées sous les coussins. Prise légèrement plus large que les épaules. Se pencher en arrière de 10-15° maximum. Initier le mouvement avec les COUDES — imaginer tirer les coudes vers les poches arrière du pantalon. Tirer jusqu'au niveau du haut de la poitrine. Squeeze 1 seconde en bas en serrant les omoplates. Remonter en contrôlant sur 2-3 secondes jusqu'à extension COMPLÈTE des bras pour étirer le grand dorsal.",
  'Vertical Traction prise serrée': "S'asseoir, cuisses calées sous les coussins. Prise serrée (largeur d'épaules ou moins), paumes vers soi. Se pencher en arrière de 10-15° maximum. Initier le mouvement avec les COUDES — imaginer tirer les coudes vers les poches arrière. Tirer jusqu'au haut de la poitrine. Squeeze 1s. Remonter en contrôlant jusqu'à extension COMPLÈTE pour étirer le grand dorsal.",
  'Rowing assis': "S'asseoir, pieds calés sur la plateforme, genoux légèrement fléchis. Dos droit, poitrine sortie, épaules basses. Tirer vers le NOMBRIL (pas le sternum — tirer trop haut recrute les bras au lieu du dos). Squeeze scapulaire 1 seconde en fin de mouvement : serrer les omoplates l'une vers l'autre. Revenir lentement en tendant les bras, en laissant les épaules s'avancer légèrement pour étirer les rhomboïdes. Le buste ne bouge PAS d'avant en arrière.",
  'Shoulder Press': "S'asseoir sur un banc avec dossier à 80-90°. Haltères à hauteur d'oreilles, paumes vers l'avant, coudes à ~90°. Dos bien plaqué contre le dossier, pieds à plat au sol. Pousser les haltères en arc au-dessus de la tête — les mains se rapprochent légèrement en haut sans se toucher. Ne PAS verrouiller les coudes en haut. Descendre de manière contrôlée jusqu'à ce que les coudes soient à 90° ou que les haltères soient au niveau des oreilles. Garder les abdos gainés pour protéger le bas du dos.",
  'Élévations latérales câble': "Câble réglé en position basse. Se tenir du côté opposé au bras qui travaille, saisir la poignée avec la main opposée (cross-body, le câble passe devant le corps). Se pencher légèrement du côté opposé au câble (5-10°) pour augmenter le ROM. Lever le bras sur le côté jusqu'à l'HORIZONTALE — PAS au-dessus (risque d'impingement). Légère rotation interne en haut : l'auriculaire pointe vers le haut, comme si on versait un verre d'eau. Garder les épaules BASSES. Descente contrôlée sur 2 secondes. Coude très légèrement fléchi tout le mouvement.",
  'Élévations latérales haltères': "Debout, pieds largeur d'épaules, haltères le long du corps. Se pencher très légèrement en avant (5°) au niveau des hanches. Lever les deux bras simultanément sur les côtés, coudes légèrement fléchis. Monter jusqu'à l'horizontale (bras parallèles au sol), pas au-dessus. En haut, les coudes sont légèrement plus hauts que les poignets. Redescendre lentement en 2-3 secondes. Ne PAS utiliser d'élan — si tu dois balancer le corps, la charge est trop lourde.",
  'Extensions overhead câble': "Câble en position basse, attacher la corde. Saisir la corde, se retourner dos au câble. Faire un pas en avant, se pencher légèrement en avant (30°), un pied devant l'autre pour la stabilité. Bras au-dessus de la tête, coudes pointés vers le plafond, FIXES — ils ne bougent pas du tout. La corde est derrière la tête, avant-bras fléchis. Étendre les avant-bras en poussant vers le plafond/avant jusqu'à extension complète. Squeeze 1 seconde en haut. Revenir en 2-3 secondes. Seuls les avant-bras pivotent, les coudes restent immobiles.",
  'Face Pull câble': "Câble en position haute (au-dessus de la tête), attacher la corde. Saisir chaque extrémité en prise neutre. Reculer de 2 pas, bras tendus devant soi à hauteur d'épaules. Tirer la corde vers le FRONT (entre les yeux et le front) — PAS vers la poitrine. Les coudes montent et s'écartent, AU-DESSUS du niveau des épaules. En fin de mouvement : position \"double biceps\" — rotation externe maximale des épaules. Squeeze 1-2 secondes. Revenir lentement. Poids LÉGER — c'est un exercice de qualité, pas de force.",
  'Dips (poids de corps)': "Se hisser sur les barres parallèles, bras tendus, corps gainé. PENCHER LE BUSTE 30° VERS L'AVANT — c'est ce qui cible les pecs au lieu des triceps. Croiser les pieds derrière soi, genoux légèrement fléchis. Descendre en fléchissant les coudes jusqu'à ce que les épaules soient au niveau ou en dessous des coudes (ROM complet). Coudes à 45° du corps. Pousser pour remonter en contractant les pecs. Ne pas verrouiller les coudes en haut.",
  'Développé incliné 30° haltères': "Régler le banc à 30° (2 crans) — PAS 45°. S'allonger, pieds à plat au sol, omoplates serrées et enfoncées dans le banc. Haltères au niveau de la poitrine haute / clavicules, coudes à 45°. Pousser en arc — les haltères se rapprochent légèrement en haut sans se toucher. En haut : bras quasi tendus (pas verrouillés), haltères au-dessus de la clavicule. Descendre en 2-3 secondes en ouvrant les coudes jusqu'à sentir un bon étirement du haut des pecs.",
  'Rowing un bras haltère': "Un genou et la main du même côté sur le banc, l'autre pied au sol. Dos parallèle au sol (vérifier dans le miroir). Haltère dans la main libre, bras pendant verticalement. Tirer le COUDE vers le plafond — imaginer démarrer une tondeuse. En haut : le coude dépasse la ligne du dos, squeeze scapulaire 1 seconde. Descendre lentement en tendant complètement le bras (stretch du grand dorsal). Le buste ne tourne PAS — pas de rotation du tronc pour tricher.",
  'Curls inclinés haltères': "Banc incliné à 45-60°, s'asseoir et s'allonger dos contre le dossier. Haltères dans chaque main, bras pendants DERRIÈRE le corps (c'est la clé — l'épaule est en extension). Paumes vers l'avant (supination). Curl en montant l'haltère vers l'épaule — SEUL l'avant-bras bouge. Le coude ne se déplace PAS vers l'avant — il reste fixe le long du corps. Contraction 1 seconde en haut. Descendre COMPLÈTEMENT jusqu'à extension totale du coude, lentement (3 secondes).",
  'Hammer Curls': "Debout, pieds largeur d'épaules, haltères le long du corps. Prise NEUTRE : paumes face à face (haltères verticaux). Coudes collés au corps, immobiles. Curl en montant l'haltère vers l'épaule en gardant la prise neutre tout le long. Contraction 1 seconde en haut. Descendre en contrôlant sur 2-3 secondes. Pas de balancement du corps.",
  'Shrugs haltères': "Debout, haltères le long du corps, bras tendus. Monter les épaules vers les oreilles — mouvement VERTICAL pur. NE PAS rouler les épaules (avant-arrière) — c'est un mythe qui stresse l'articulation sans bénéfice. NE PAS plier les coudes — les bras restent tendus. Squeeze 2 secondes en haut — contracter fort les trapèzes. Descendre lentement.",
  'Reverse Flyes': "Sur la machine pec-deck inversée, s'asseoir face au dossier, poitrine contre le coussin. Régler les poignées pour qu'elles soient devant soi, bras tendus. Ouvrir les bras en tirant vers l'arrière en arc de cercle, coudes légèrement fléchis. Aller jusqu'à ce que les bras soient en ligne avec les épaules (pas au-delà). Squeeze 1 seconde — serrer les omoplates. Revenir lentement en contrôlant. Les épaules restent BASSES.",
  'Pushdowns câble': "Câble en position haute, barre droite ou corde. Debout face au câble, pieds largeur d'épaules, buste très légèrement penché en avant. Coudes collés au corps, fléchis à 90°. Pousser vers le bas en étendant les avant-bras jusqu'à extension complète. Squeeze 1 seconde en bas. Remonter en contrôlant jusqu'à 90° — les coudes NE BOUGENT PAS. Si corde : écarter les deux extrémités en bas pour un pic de contraction.",
  'Leg Press ELT+': "S'asseoir, dos bien plaqué contre le dossier. Pieds au MILIEU de la plateforme, largeur d'épaules, orteils légèrement vers l'extérieur. Pousser pour déverrouiller la sécurité. Descendre en pliant les genoux jusqu'à ~90° de flexion — le bas du dos ne doit PAS se décoller du dossier. Pousser en poussant avec les TALONS. Ne PAS verrouiller les genoux en haut. Mouvement fluide, pas de rebond en bas.",
  'Leg Curl ELT+': "S'asseoir, coussin sur les chevilles (juste au-dessus du talon). Saisir les poignées pour se stabiliser. Plier les genoux en amenant les talons vers les fesses. Monter jusqu'à ~90° de flexion minimum, idéalement un peu plus. Squeeze 1 seconde en haut — contracter fort les ischio-jambiers. Descendre lentement en 2-3 secondes. Ne pas soulever le bassin du banc.",
};
