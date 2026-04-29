/* ═══════════════════════════════════════════════════════════════════════
   CityMeet Kiosk — App Logic
   All application state, data, rendering, and navigation live here.

   PUBLIC API  (window.CityMeet):
     CityMeet.navigateTo(screenId)    — go to a screen by id
     CityMeet.openActivity(id, from)  — open activity detail
     CityMeet.closeDetail()           — return from detail to previous screen
     CityMeet.startQuiz()             — advance quiz from intro to selection
     CityMeet.toggleHobby(hobbyId)    — select/deselect a hobby
     CityMeet.submitQuiz()            — score quiz and show results
     CityMeet.resetQuiz()             — clear selections, show quiz intro
     CityMeet.filterCategory(cat)     — filter explore by category
     CityMeet.setAccent(hex)          — change the accent colour at runtime
     CityMeet.getState()              — read-only snapshot of current state
   ═══════════════════════════════════════════════════════════════════════ */


/* ─── DATA ──────────────────────────────────────────────────────────────
   Activities: 3 are "featured" (today's events shown in the hero grid).
   Tags must overlap with HOBBIES ids for the quiz scoring to work.
   ─────────────────────────────────────────────────────────────────────── */
let ACTIVITIES = [
    {
        id: 1,
        title: 'Fælles havebrug',
        category: 'Natur',
        location: 'Fælledparken',
        time: '10:00 – 12:00',
        date: '28 APR',
        distance: '0.4 km',
        tags: ['udendørs', 'socialt', 'natur', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 7,
        featured: true,
        desc: 'Deltag i fællesskabets havebrug og plant grøntsager, blomster og urter. Alle er velkomne – erfaring ikke påkrævet.',
    },
    {
        id: 2,
        title: 'Åben musikworkshop',
        category: 'Musik',
        location: 'Kulturhuset Islands Brygge',
        time: '14:00 – 17:00',
        date: '28 APR',
        distance: '1.1 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: true,
        imgStripe: '#d4b8e8',
        attending: 14,
        featured: true,
        desc: 'Spil med og lær af andre musikelskere. Medbring dit instrument eller brug husets. For alle niveauer.',
    },
    {
        id: 3,
        title: 'Guidet byvandring',
        category: 'Historie',
        location: 'Rådhuspladsen',
        time: '11:00 – 13:00',
        date: '28 APR',
        distance: '0.8 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 22,
        featured: true,
        desc: 'Tag på en guidet tur gennem Københavns historiske gader. Lær om arkitektur og byens fortid.',
    },
    {
        id: 4,
        title: 'Yoga i parken',
        category: 'Sport',
        location: 'Kongens Have',
        time: '07:30 – 08:30',
        date: '29 APR',
        distance: '1.4 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🧘',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 11,
        featured: false,
        desc: 'Start dagen med ro. Gratis morgenyoga for alle aldersgrupper. Medbring en måtte.',
    },
    {
        id: 5,
        title: 'Tegne & malekreds',
        category: 'Kunst',
        location: 'Biblioteket Østerbro',
        time: '17:00 – 19:00',
        date: '30 APR',
        distance: '2.0 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: false,
        attending: 6,
        featured: false,
        desc: 'Ugentlig kunstkreds med fokus på tegning og maleri. Materialer stilles til rådighed.',
    },
    {
        id: 6,
        title: 'Løbeklub – alle niveauer',
        category: 'Sport',
        location: 'Amager Strandpark',
        time: '18:00 – 19:30',
        date: '29 APR',
        distance: '2.8 km',
        tags: ['sport', 'udendørs', 'socialt', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4f0d4',
        emoji: '🏃',
        hasImage: false,
        attending: 19,
        featured: false,
        desc: 'Hyggeligt løbefællesskab med ruter for begyndere og øvede. Ingen tilmelding nødvendig.',
    },
    {
        id: 7,
        title: 'Filmvisning under åben himmel',
        category: 'Film',
        location: 'Superkilen',
        time: '21:00 – 23:30',
        date: '2 MAJ',
        distance: '1.6 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 34,
        featured: false,
        desc: 'Gratis udendørs filmvisning. Medbring tæppe og hygge. Denne uge vises en dansk klassiker.',
    },
    {
        id: 8,
        title: 'Madlavningskursus',
        category: 'Mad',
        location: 'Nørrebrohallen',
        time: '13:00 – 16:00',
        date: '3 MAJ',
        distance: '1.2 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: false,
        attending: 9,
        featured: false,
        desc: 'Lær at lave mad fra forskellige kulturer. Fællesspisning inkluderet. Max 12 deltagere.',
    },
    {
        id: 9,
        title: 'Fermenterings-workshop',
        category: 'Socialt',
        location: 'Søerne',
        time: '12:00 – 14:00',
        date: '2 MAJ',
        distance: '1.2 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: false,
        attending: 23,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 10,
        title: 'Litteraturquiz',
        category: 'Spil',
        location: 'Nordvest Kulturhus',
        time: '18:00 – 19:30',
        date: '29 APR',
        distance: '1.7 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 48,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 11,
        title: 'Skak-klub',
        category: 'Friluft',
        location: 'Frederiksberg Have',
        time: '12:00 – 14:00',
        date: '13 MAJ',
        distance: '3.2 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 27,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 12,
        title: 'Litteraturquiz',
        category: 'Spil',
        location: 'Bispebjerg Bakke',
        time: '18:00 – 19:30',
        date: '8 MAJ',
        distance: '2.8 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 28,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 13,
        title: 'Cykeltur',
        category: 'Film',
        location: 'Frederiksberg Have',
        time: '18:00 – 20:00',
        date: '5 MAJ',
        distance: '4.1 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 10,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 14,
        title: 'Socialt kaffemøde',
        category: 'Wellness',
        location: 'Rosenborg Slot',
        time: '20:00 – 22:00',
        date: '5 MAJ',
        distance: '3.1 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 54,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 15,
        title: 'Gadekunsttur',
        category: 'Historie',
        location: 'Kulturhuset Islands Brygge',
        time: '09:00 – 11:00',
        date: '30 APR',
        distance: '2.9 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 44,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 16,
        title: 'Rulleski-tur',
        category: 'Film',
        location: 'Rådhuspladsen',
        time: '13:00 – 15:00',
        date: '7 MAJ',
        distance: '0.4 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 53,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 17,
        title: 'App-introduktion',
        category: 'Dans',
        location: 'Botanisk Have',
        time: '17:00 – 19:00',
        date: '12 MAJ',
        distance: '3.9 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 46,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 18,
        title: 'Netværksaften',
        category: 'Wellness',
        location: 'Bispebjerg Bakke',
        time: '13:00 – 15:00',
        date: '6 MAJ',
        distance: '4.2 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'lille begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: true,
        imgStripe: '#b8e8e8',
        attending: 6,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 19,
        title: 'Animationsaften',
        category: 'Mad',
        location: 'Rådhuspladsen',
        time: '11:00 – 13:00',
        date: '29 APR',
        distance: '2.3 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 13,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 20,
        title: 'Sprogcafé',
        category: 'Wellness',
        location: 'Biblioteket Østerbro',
        time: '10:00 – 12:00',
        date: '29 APR',
        distance: '2.1 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'lille begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: true,
        imgStripe: '#b8e8e8',
        attending: 4,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 21,
        title: 'Kor for alle',
        category: 'Musik',
        location: 'Langelinie',
        time: '11:00 – 13:00',
        date: '15 MAJ',
        distance: '2.4 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 24,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 22,
        title: 'Escape room',
        category: 'Friluft',
        location: 'Torvehallerne',
        time: '17:00 – 19:00',
        date: '1 MAJ',
        distance: '1.4 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 58,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 23,
        title: 'Åben musikworkshop',
        category: 'Musik',
        location: 'Frederiksberg Have',
        time: '10:00 – 12:00',
        date: '1 MAJ',
        distance: '1.4 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 49,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 24,
        title: 'Løbeklub',
        category: 'Film',
        location: 'Valby Kulturhus',
        time: '18:00 – 20:00',
        date: '13 MAJ',
        distance: '3.1 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 30,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 25,
        title: 'Poesiaften',
        category: 'Spil',
        location: 'Idrætscenter Vanløse',
        time: '12:00 – 14:00',
        date: '12 MAJ',
        distance: '1.3 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 41,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 26,
        title: 'Tegne & malekreds',
        category: 'Kunst',
        location: 'Langelinie',
        time: '21:00 – 23:30',
        date: '5 MAJ',
        distance: '1.4 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 50,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 27,
        title: 'Rulleski-tur',
        category: 'Film',
        location: 'Botanisk Have',
        time: '20:00 – 22:00',
        date: '7 MAJ',
        distance: '1.9 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 13,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 28,
        title: 'Balfolk-aften',
        category: 'Teater',
        location: 'Frederiksberg Have',
        time: '13:00 – 15:00',
        date: '4 MAJ',
        distance: '1.7 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: true,
        imgStripe: '#d4b8b8',
        attending: 8,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 29,
        title: 'Sushiaften',
        category: 'Socialt',
        location: 'Rosenborg Slot',
        time: '07:30 – 09:00',
        date: '7 MAJ',
        distance: '1.9 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: false,
        attending: 15,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 30,
        title: 'Socialt kaffemøde',
        category: 'Wellness',
        location: 'Vesterbro Torv',
        time: '11:00 – 13:00',
        date: '1 MAJ',
        distance: '1.0 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 58,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 31,
        title: 'Musikbingo',
        category: 'Musik',
        location: 'Langelinie',
        time: '18:00 – 20:00',
        date: '15 MAJ',
        distance: '0.7 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 30,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 32,
        title: '3D-print workshop',
        category: 'Dans',
        location: 'Amager Fælled',
        time: '14:00 – 17:00',
        date: '11 MAJ',
        distance: '1.2 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: true,
        imgStripe: '#e8b8d4',
        attending: 26,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 33,
        title: 'Skriveværksted',
        category: 'Spil',
        location: 'Utterslev Mose',
        time: '11:00 – 13:00',
        date: '15 MAJ',
        distance: '0.5 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 24,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 34,
        title: 'Middelalderby-tur',
        category: 'Historie',
        location: 'Dyrehaven',
        time: '09:00 – 11:00',
        date: '10 MAJ',
        distance: '3.7 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: false,
        attending: 48,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 35,
        title: 'Mindfulness-walk',
        category: 'Tech',
        location: 'Amager Strandpark',
        time: '14:00 – 17:00',
        date: '14 MAJ',
        distance: '3.8 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: false,
        attending: 30,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 36,
        title: 'Intervaltræning',
        category: 'Film',
        location: 'Kulturhuset Islands Brygge',
        time: '15:00 – 17:00',
        date: '13 MAJ',
        distance: '1.4 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 11,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 37,
        title: 'Poesiaften',
        category: 'Spil',
        location: 'Refshaleøen',
        time: '21:00 – 23:30',
        date: '7 MAJ',
        distance: '0.6 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 18,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 38,
        title: 'Urbant landbrug',
        category: 'Natur',
        location: 'Kongens Have',
        time: '07:30 – 09:00',
        date: '28 APR',
        distance: '0.4 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 6,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 39,
        title: 'Rulleski-tur',
        category: 'Film',
        location: 'Langelinie',
        time: '21:00 – 23:30',
        date: '9 MAJ',
        distance: '2.0 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 28,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 40,
        title: 'Cykeltur',
        category: 'Film',
        location: 'Søerne',
        time: '17:00 – 19:00',
        date: '29 APR',
        distance: '2.4 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 24,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 41,
        title: 'Kortfilmaften',
        category: 'Mad',
        location: 'Rådhuspladsen',
        time: '14:00 – 17:00',
        date: '6 MAJ',
        distance: '2.1 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 11,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 42,
        title: 'Kor for alle',
        category: 'Musik',
        location: 'Utterslev Mose',
        time: '14:00 – 16:00',
        date: '14 MAJ',
        distance: '0.5 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 13,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 43,
        title: 'Tegne & malekreds',
        category: 'Kunst',
        location: 'Idrætscenter Vanløse',
        time: '14:00 – 16:00',
        date: '15 MAJ',
        distance: '1.8 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: false,
        attending: 38,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 44,
        title: 'Rollespil',
        category: 'Friluft',
        location: 'Rosenborg Slot',
        time: '21:00 – 23:30',
        date: '10 MAJ',
        distance: '3.5 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 48,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 45,
        title: 'Poesiaften',
        category: 'Spil',
        location: 'Assistens Kirkegård',
        time: '17:00 – 19:00',
        date: '5 MAJ',
        distance: '0.3 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 58,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 46,
        title: 'Skriveværksted',
        category: 'Spil',
        location: 'Langelinie',
        time: '13:00 – 15:00',
        date: '1 MAJ',
        distance: '2.0 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 59,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 47,
        title: 'Parkour intro',
        category: 'Film',
        location: 'Kongens Have',
        time: '14:00 – 17:00',
        date: '11 MAJ',
        distance: '0.3 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 46,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 48,
        title: 'Yoga i parken',
        category: 'Sport',
        location: 'Idrætscenter Vanløse',
        time: '07:30 – 09:00',
        date: '13 MAJ',
        distance: '2.5 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 58,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 49,
        title: 'Morgengymnastik',
        category: 'Sport',
        location: 'Refshaleøen',
        time: '20:00 – 22:00',
        date: '15 MAJ',
        distance: '3.6 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: false,
        attending: 14,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 50,
        title: 'Pilates udendørs',
        category: 'Sport',
        location: 'Botanisk Have',
        time: '18:00 – 20:00',
        date: '3 MAJ',
        distance: '2.0 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'lille begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 10,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 51,
        title: 'Pilates udendørs #9',
        category: 'Sport',
        location: 'Nordvest Kulturhus',
        time: '15:00 – 17:00',
        date: '8 MAJ',
        distance: '4.2 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: false,
        attending: 14,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 52,
        title: 'Kor for alle #9',
        category: 'Musik',
        location: 'Dronning Louises Bro',
        time: '11:00 – 13:00',
        date: '15 MAJ',
        distance: '4.0 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 53,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 53,
        title: 'Fermenterings-workshop #9',
        category: 'Socialt',
        location: 'Biblioteket Østerbro',
        time: '18:00 – 20:00',
        date: '14 MAJ',
        distance: '0.8 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: false,
        attending: 56,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 54,
        title: 'Kortfilmaften #10',
        category: 'Mad',
        location: 'Rosenborg Slot',
        time: '18:00 – 20:00',
        date: '30 APR',
        distance: '1.2 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 9,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 55,
        title: 'Tegne & malekreds #10',
        category: 'Kunst',
        location: 'Fælledparken',
        time: '19:00 – 21:00',
        date: '30 APR',
        distance: '3.3 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: false,
        attending: 16,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 56,
        title: 'Urbant landbrug #10',
        category: 'Natur',
        location: 'Rådhuspladsen',
        time: '07:30 – 09:00',
        date: '8 MAJ',
        distance: '1.0 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 5,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 57,
        title: 'Escape room #10',
        category: 'Friluft',
        location: 'Idrætscenter Vanløse',
        time: '11:00 – 13:00',
        date: '11 MAJ',
        distance: '2.2 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 52,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 58,
        title: 'Rollespil #10',
        category: 'Friluft',
        location: 'Blågårds Plads',
        time: '20:00 – 22:00',
        date: '2 MAJ',
        distance: '0.6 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 41,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 59,
        title: 'Stumfilmkoncert #11',
        category: 'Mad',
        location: 'Botanisk Have',
        time: '17:00 – 19:00',
        date: '30 APR',
        distance: '1.2 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 33,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 60,
        title: 'Linedance #11',
        category: 'Teater',
        location: 'Langelinie',
        time: '12:00 – 14:00',
        date: '11 MAJ',
        distance: '3.9 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: false,
        attending: 46,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 61,
        title: 'Litteraturquiz #11',
        category: 'Spil',
        location: 'Utterslev Mose',
        time: '12:00 – 14:00',
        date: '8 MAJ',
        distance: '2.5 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 9,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 62,
        title: 'Morgengymnastik #11',
        category: 'Sport',
        location: 'Dyrehaven',
        time: '21:00 – 23:30',
        date: '12 MAJ',
        distance: '0.8 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 41,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 63,
        title: 'Tegne & malekreds #11',
        category: 'Kunst',
        location: 'Blågårds Plads',
        time: '19:00 – 21:00',
        date: '12 MAJ',
        distance: '2.5 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 35,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 64,
        title: 'Mindfulness-walk #12',
        category: 'Tech',
        location: 'Torvehallerne',
        time: '17:00 – 19:00',
        date: '30 APR',
        distance: '0.6 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 53,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 65,
        title: 'Bogcirkel #12',
        category: 'Spil',
        location: 'Botanisk Have',
        time: '14:00 – 17:00',
        date: '5 MAJ',
        distance: '1.2 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 16,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 66,
        title: 'Brødbagning #12',
        category: 'Socialt',
        location: 'Christiania',
        time: '14:00 – 16:00',
        date: '30 APR',
        distance: '2.1 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 48,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 67,
        title: 'Socialt kaffemøde #12',
        category: 'Wellness',
        location: 'Vesterbro Torv',
        time: '11:00 – 13:00',
        date: '6 MAJ',
        distance: '3.2 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 34,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 68,
        title: 'Åndedrætsøvelser #12',
        category: 'Tech',
        location: 'Idrætscenter Vanløse',
        time: '07:30 – 09:00',
        date: '12 MAJ',
        distance: '1.5 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: false,
        attending: 44,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 69,
        title: 'Bogcirkel #13',
        category: 'Spil',
        location: 'Torvehallerne',
        time: '10:00 – 12:00',
        date: '7 MAJ',
        distance: '1.7 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 49,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 70,
        title: 'Akvarelmaling #13',
        category: 'Kunst',
        location: 'Kastellet',
        time: '14:00 – 16:00',
        date: '2 MAJ',
        distance: '0.3 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: false,
        attending: 36,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 71,
        title: 'Morgengymnastik #13',
        category: 'Sport',
        location: 'Assistens Kirkegård',
        time: '19:00 – 21:00',
        date: '8 MAJ',
        distance: '3.4 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'lille begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: false,
        attending: 7,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 72,
        title: 'Jam session #13',
        category: 'Musik',
        location: 'Rådhuspladsen',
        time: '10:00 – 12:00',
        date: '9 MAJ',
        distance: '1.4 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: true,
        imgStripe: '#d4b8e8',
        attending: 9,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 73,
        title: 'Fælles havebrug #13',
        category: 'Natur',
        location: 'Dyrehaven',
        time: '12:00 – 14:00',
        date: '12 MAJ',
        distance: '0.3 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 14,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 74,
        title: 'Swing-dans #14',
        category: 'Teater',
        location: 'Vesterbro Torv',
        time: '17:00 – 19:00',
        date: '28 APR',
        distance: '3.2 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: true,
        imgStripe: '#d4b8b8',
        attending: 26,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 75,
        title: 'Salsa for begyndere #14',
        category: 'Teater',
        location: 'Frederiksberg Have',
        time: '20:00 – 22:00',
        date: '8 MAJ',
        distance: '2.6 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: false,
        attending: 55,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 76,
        title: 'Salsa for begyndere #14',
        category: 'Teater',
        location: 'Christiania',
        time: '18:00 – 19:30',
        date: '15 MAJ',
        distance: '1.8 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: false,
        attending: 20,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 77,
        title: 'Brætspilsaften #14',
        category: 'Friluft',
        location: 'Biblioteket Østerbro',
        time: '12:00 – 14:00',
        date: '6 MAJ',
        distance: '1.9 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 39,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 78,
        title: 'Frøbyttedag #14',
        category: 'Natur',
        location: 'Nørreport Station',
        time: '14:00 – 16:00',
        date: '30 APR',
        distance: '0.6 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 47,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 79,
        title: 'Gadekunsttur #15',
        category: 'Historie',
        location: 'Dyrehaven',
        time: '12:00 – 14:00',
        date: '29 APR',
        distance: '1.5 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: false,
        attending: 26,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 80,
        title: 'Madlavningskursus #15',
        category: 'Socialt',
        location: 'Rosenborg Slot',
        time: '19:00 – 21:00',
        date: '11 MAJ',
        distance: '3.0 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 50,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 81,
        title: 'Robotics intro #15',
        category: 'Dans',
        location: 'Kulturhuset Islands Brygge',
        time: '07:30 – 09:00',
        date: '2 MAJ',
        distance: '0.5 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 53,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 82,
        title: 'Meditationssession #15',
        category: 'Tech',
        location: 'Kongens Have',
        time: '18:00 – 20:00',
        date: '12 MAJ',
        distance: '3.8 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 45,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 83,
        title: 'Linedance #15',
        category: 'Teater',
        location: 'Dronning Louises Bro',
        time: '07:30 – 09:00',
        date: '4 MAJ',
        distance: '2.1 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: true,
        imgStripe: '#d4b8b8',
        attending: 53,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 84,
        title: 'Kompost-workshop #16',
        category: 'Natur',
        location: 'Rosenborg Slot',
        time: '21:00 – 23:30',
        date: '14 MAJ',
        distance: '3.4 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 25,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 85,
        title: 'Cykeltur #16',
        category: 'Film',
        location: 'Kastellet',
        time: '21:00 – 23:30',
        date: '2 MAJ',
        distance: '1.6 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 48,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 86,
        title: 'Mindfulness-walk #16',
        category: 'Tech',
        location: 'Frederiksberg Have',
        time: '13:00 – 15:00',
        date: '28 APR',
        distance: '2.7 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: false,
        attending: 6,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 87,
        title: 'Rulleski-tur #16',
        category: 'Film',
        location: 'Nordvest Kulturhus',
        time: '17:00 – 19:00',
        date: '15 MAJ',
        distance: '0.8 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 38,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 88,
        title: 'Brødbagning #16',
        category: 'Socialt',
        location: 'Dronning Louises Bro',
        time: '18:00 – 20:00',
        date: '4 MAJ',
        distance: '3.5 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 17,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 89,
        title: 'Middelalderby-tur #17',
        category: 'Historie',
        location: 'Ørestad',
        time: '11:00 – 13:00',
        date: '11 MAJ',
        distance: '0.8 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 44,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 90,
        title: 'Kompost-workshop #17',
        category: 'Natur',
        location: 'Bispebjerg Bakke',
        time: '12:00 – 14:00',
        date: '2 MAJ',
        distance: '2.0 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 49,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 91,
        title: 'Kortfilmaften #17',
        category: 'Mad',
        location: 'Kongens Have',
        time: '18:00 – 19:30',
        date: '1 MAJ',
        distance: '1.7 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: false,
        attending: 11,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 92,
        title: 'Interkulturelt møde #17',
        category: 'Wellness',
        location: 'Fælledparken',
        time: '13:00 – 15:00',
        date: '11 MAJ',
        distance: '0.5 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 34,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 93,
        title: 'Brætspilsaften #17',
        category: 'Friluft',
        location: 'Assistens Kirkegård',
        time: '18:00 – 20:00',
        date: '14 MAJ',
        distance: '3.1 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 10,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 94,
        title: 'Teaterworkshop #18',
        category: 'Litteratur',
        location: 'Idrætscenter Vanløse',
        time: '12:00 – 14:00',
        date: '6 MAJ',
        distance: '3.7 km',
        tags: ['litteratur', 'læring', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4e8e8',
        emoji: '📚',
        hasImage: true,
        imgStripe: '#b8d4d4',
        attending: 49,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 95,
        title: 'Tai chi #18',
        category: 'Sport',
        location: 'Idrætscenter Vanløse',
        time: '15:00 – 17:00',
        date: '4 MAJ',
        distance: '2.8 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 20,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 96,
        title: 'Kodeklub for voksne #18',
        category: 'Dans',
        location: 'Superkilen',
        time: '14:00 – 17:00',
        date: '15 MAJ',
        distance: '0.7 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 54,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 97,
        title: 'Middelalderby-tur #18',
        category: 'Historie',
        location: 'Kongens Have',
        time: '18:00 – 19:30',
        date: '7 MAJ',
        distance: '0.3 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: false,
        attending: 28,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 98,
        title: 'Kodeklub for voksne #18',
        category: 'Dans',
        location: 'Nørrebrohallen',
        time: '21:00 – 23:30',
        date: '11 MAJ',
        distance: '0.4 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 20,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 99,
        title: 'Urbant landbrug #19',
        category: 'Natur',
        location: 'Nørreport Station',
        time: '10:00 – 12:00',
        date: '12 MAJ',
        distance: '0.3 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 54,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 100,
        title: 'Arkitekturtur #19',
        category: 'Historie',
        location: 'Søerne',
        time: '07:30 – 09:00',
        date: '13 MAJ',
        distance: '2.6 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 20,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 101,
        title: 'Fermenterings-workshop #19',
        category: 'Socialt',
        location: 'Bispebjerg Bakke',
        time: '09:00 – 11:00',
        date: '11 MAJ',
        distance: '2.5 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 52,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 102,
        title: 'Dramakreds #19',
        category: 'Litteratur',
        location: 'Valby Kulturhus',
        time: '13:00 – 15:00',
        date: '14 MAJ',
        distance: '1.0 km',
        tags: ['litteratur', 'læring', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4e8e8',
        emoji: '📚',
        hasImage: true,
        imgStripe: '#b8d4d4',
        attending: 35,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 103,
        title: 'Urbant landbrug #19',
        category: 'Natur',
        location: 'Amager Strandpark',
        time: '21:00 – 23:30',
        date: '29 APR',
        distance: '2.8 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 42,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 104,
        title: 'Streetart-workshop #20',
        category: 'Kunst',
        location: 'Assistens Kirkegård',
        time: '13:00 – 15:00',
        date: '30 APR',
        distance: '0.7 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: false,
        attending: 35,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 105,
        title: 'Open source-møde #20',
        category: 'Dans',
        location: 'Amager Strandpark',
        time: '21:00 – 23:30',
        date: '10 MAJ',
        distance: '3.3 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 11,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 106,
        title: 'Forfatteroplæsning #20',
        category: 'Spil',
        location: 'Nørrebrohallen',
        time: '11:00 – 13:00',
        date: '13 MAJ',
        distance: '1.2 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 14,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 107,
        title: 'Skriveværksted #20',
        category: 'Spil',
        location: 'Bispebjerg Bakke',
        time: '21:00 – 23:30',
        date: '6 MAJ',
        distance: '4.2 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 17,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 108,
        title: 'Lydhealing #20',
        category: 'Tech',
        location: 'Rådhuspladsen',
        time: '14:00 – 16:00',
        date: '12 MAJ',
        distance: '0.5 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 50,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 109,
        title: 'Skriveværksted #21',
        category: 'Spil',
        location: 'Amager Strandpark',
        time: '18:00 – 20:00',
        date: '3 MAJ',
        distance: '2.8 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 4,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 110,
        title: 'Lydhealing #21',
        category: 'Tech',
        location: 'Assistens Kirkegård',
        time: '18:00 – 19:30',
        date: '6 MAJ',
        distance: '0.9 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 52,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 111,
        title: 'Rulleski-tur #21',
        category: 'Film',
        location: 'Torvehallerne',
        time: '13:00 – 15:00',
        date: '30 APR',
        distance: '3.2 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: false,
        attending: 17,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 112,
        title: 'Dokumentarvisning #21',
        category: 'Mad',
        location: 'Kongens Have',
        time: '20:00 – 22:00',
        date: '13 MAJ',
        distance: '0.9 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 49,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 113,
        title: 'Keramik for begyndere #21',
        category: 'Kunst',
        location: 'Langelinie',
        time: '11:00 – 13:00',
        date: '14 MAJ',
        distance: '1.2 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 57,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 114,
        title: 'Naturvejledning #22',
        category: 'Natur',
        location: 'Dronning Louises Bro',
        time: '10:00 – 12:00',
        date: '2 MAJ',
        distance: '2.7 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 50,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 115,
        title: 'Parkour intro #22',
        category: 'Film',
        location: 'Rosenborg Slot',
        time: '21:00 – 23:30',
        date: '15 MAJ',
        distance: '0.9 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 13,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 116,
        title: 'Skriveværksted #22',
        category: 'Spil',
        location: 'Torvehallerne',
        time: '18:00 – 19:30',
        date: '13 MAJ',
        distance: '0.7 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 52,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 117,
        title: 'Bogcirkel #22',
        category: 'Spil',
        location: 'Nordvest Kulturhus',
        time: '18:00 – 20:00',
        date: '4 MAJ',
        distance: '1.4 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 29,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 118,
        title: 'Madlavningskursus #22',
        category: 'Socialt',
        location: 'Blågårds Plads',
        time: '14:00 – 17:00',
        date: '12 MAJ',
        distance: '2.2 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 6,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 119,
        title: 'Kompost-workshop #23',
        category: 'Natur',
        location: 'Botanisk Have',
        time: '20:00 – 22:00',
        date: '6 MAJ',
        distance: '1.5 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 12,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 120,
        title: 'Madlavningskursus #23',
        category: 'Socialt',
        location: 'Kulturhuset Islands Brygge',
        time: '18:00 – 19:30',
        date: '13 MAJ',
        distance: '3.4 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 53,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 121,
        title: 'Rulleski-tur #23',
        category: 'Film',
        location: 'Assistens Kirkegård',
        time: '21:00 – 23:30',
        date: '3 MAJ',
        distance: '2.4 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 27,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 122,
        title: 'Naturvejledning #23',
        category: 'Natur',
        location: 'Frederiksberg Have',
        time: '18:00 – 19:30',
        date: '5 MAJ',
        distance: '0.5 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 34,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 123,
        title: 'App-introduktion #23',
        category: 'Dans',
        location: 'Kastellet',
        time: '12:00 – 14:00',
        date: '11 MAJ',
        distance: '3.5 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 54,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 124,
        title: 'Litteraturquiz #24',
        category: 'Spil',
        location: 'Kongens Have',
        time: '18:00 – 19:30',
        date: '7 MAJ',
        distance: '3.7 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 8,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 125,
        title: 'Lydhealing #24',
        category: 'Tech',
        location: 'Torvehallerne',
        time: '09:00 – 11:00',
        date: '10 MAJ',
        distance: '4.1 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: false,
        attending: 60,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 126,
        title: 'Yoga i parken #24',
        category: 'Sport',
        location: 'Rosenborg Slot',
        time: '18:00 – 20:00',
        date: '1 MAJ',
        distance: '0.5 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 39,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 127,
        title: 'Tai chi #24',
        category: 'Sport',
        location: 'Bispebjerg Bakke',
        time: '18:00 – 19:30',
        date: '28 APR',
        distance: '0.8 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: false,
        attending: 53,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 128,
        title: 'Gadekunsttur #24',
        category: 'Historie',
        location: 'Nørreport Station',
        time: '15:00 – 17:00',
        date: '4 MAJ',
        distance: '3.6 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 40,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 129,
        title: 'Skak-klub #25',
        category: 'Friluft',
        location: 'Nørrebrohallen',
        time: '14:00 – 16:00',
        date: '1 MAJ',
        distance: '2.6 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 17,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 130,
        title: 'Middelalderby-tur #25',
        category: 'Historie',
        location: 'Amager Strandpark',
        time: '20:00 – 22:00',
        date: '2 MAJ',
        distance: '2.8 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 32,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 131,
        title: 'Meditationssession #25',
        category: 'Tech',
        location: 'Søerne',
        time: '10:00 – 12:00',
        date: '8 MAJ',
        distance: '1.6 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 44,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 132,
        title: 'Socialt kaffemøde #25',
        category: 'Wellness',
        location: 'Valby Kulturhus',
        time: '15:00 – 17:00',
        date: '2 MAJ',
        distance: '2.2 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 46,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 133,
        title: 'Salsa for begyndere #25',
        category: 'Teater',
        location: 'Fælledparken',
        time: '14:00 – 16:00',
        date: '15 MAJ',
        distance: '1.8 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: true,
        imgStripe: '#d4b8b8',
        attending: 30,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 134,
        title: 'Gadekunsttur #26',
        category: 'Historie',
        location: 'Superkilen',
        time: '18:00 – 20:00',
        date: '11 MAJ',
        distance: '0.3 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: false,
        attending: 46,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 135,
        title: 'Salsa for begyndere #26',
        category: 'Teater',
        location: 'Christiania',
        time: '15:00 – 17:00',
        date: '3 MAJ',
        distance: '3.6 km',
        tags: ['teater', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4d4',
        emoji: '🎭',
        hasImage: true,
        imgStripe: '#d4b8b8',
        attending: 44,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 136,
        title: 'Streetart-workshop #26',
        category: 'Kunst',
        location: 'Dronning Louises Bro',
        time: '20:00 – 22:00',
        date: '29 APR',
        distance: '0.7 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 22,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 137,
        title: 'Graffiti-historik #26',
        category: 'Historie',
        location: 'Amager Fælled',
        time: '12:00 – 14:00',
        date: '29 APR',
        distance: '1.8 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 17,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 138,
        title: 'Keramik for begyndere #26',
        category: 'Kunst',
        location: 'Ørestad',
        time: '18:00 – 19:30',
        date: '30 APR',
        distance: '0.3 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 13,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 139,
        title: 'Naturvejledning #27',
        category: 'Natur',
        location: 'Bispebjerg Bakke',
        time: '20:00 – 22:00',
        date: '14 MAJ',
        distance: '3.1 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 60,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 140,
        title: 'Forfatteroplæsning #27',
        category: 'Spil',
        location: 'Amager Fælled',
        time: '07:30 – 09:00',
        date: '29 APR',
        distance: '0.6 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: true,
        imgStripe: '#e8d4d4',
        attending: 14,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 141,
        title: 'Animationsaften #27',
        category: 'Mad',
        location: 'Valby Kulturhus',
        time: '18:00 – 20:00',
        date: '8 MAJ',
        distance: '0.3 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 24,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 142,
        title: 'Madlavningskursus #27',
        category: 'Socialt',
        location: 'Idrætscenter Vanløse',
        time: '18:00 – 19:30',
        date: '11 MAJ',
        distance: '2.1 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 26,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 143,
        title: 'Kortfilmaften #27',
        category: 'Mad',
        location: 'Langelinie',
        time: '12:00 – 14:00',
        date: '1 MAJ',
        distance: '1.5 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: false,
        attending: 34,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 144,
        title: 'Netværksaften #28',
        category: 'Wellness',
        location: 'Ørestad',
        time: '20:00 – 22:00',
        date: '6 MAJ',
        distance: '3.5 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 53,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 145,
        title: 'Keramik for begyndere #28',
        category: 'Kunst',
        location: 'Amager Strandpark',
        time: '07:30 – 09:00',
        date: '6 MAJ',
        distance: '2.2 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 28,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 146,
        title: 'Arkitekturtur #28',
        category: 'Historie',
        location: 'Kastellet',
        time: '09:00 – 11:00',
        date: '28 APR',
        distance: '0.4 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'lille begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 8,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 147,
        title: 'Dramakreds #28',
        category: 'Litteratur',
        location: 'Vesterbro Torv',
        time: '12:00 – 14:00',
        date: '1 MAJ',
        distance: '3.1 km',
        tags: ['litteratur', 'læring', 'indendørs', 'lav energi', 'lille begivenhed', 'introvert', 'med alkohol'],
        color: '#d4e8e8',
        emoji: '📚',
        hasImage: false,
        attending: 5,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 148,
        title: 'Fælles havebrug #28',
        category: 'Natur',
        location: 'Biblioteket Østerbro',
        time: '17:00 – 19:00',
        date: '15 MAJ',
        distance: '0.5 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 59,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 149,
        title: 'Morgengymnastik #29',
        category: 'Sport',
        location: 'Superkilen',
        time: '18:00 – 20:00',
        date: '2 MAJ',
        distance: '2.5 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 17,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 150,
        title: 'Kodeklub for voksne #29',
        category: 'Dans',
        location: 'Kulturhuset Islands Brygge',
        time: '17:00 – 19:00',
        date: '5 MAJ',
        distance: '3.6 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 16,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 151,
        title: 'Morgengymnastik #29',
        category: 'Sport',
        location: 'Torvehallerne',
        time: '14:00 – 16:00',
        date: '28 APR',
        distance: '4.0 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'lille begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: false,
        attending: 9,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 152,
        title: 'Forfatteroplæsning #29',
        category: 'Spil',
        location: 'Dyrehaven',
        time: '20:00 – 22:00',
        date: '10 MAJ',
        distance: '2.4 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 39,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 153,
        title: 'Musikbingo #29',
        category: 'Musik',
        location: 'Christiania',
        time: '10:00 – 12:00',
        date: '6 MAJ',
        distance: '2.6 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 3,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 154,
        title: '3D-print workshop #30',
        category: 'Dans',
        location: 'Fælledparken',
        time: '10:00 – 12:00',
        date: '2 MAJ',
        distance: '4.0 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: true,
        imgStripe: '#e8b8d4',
        attending: 18,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 155,
        title: 'Meditationssession #30',
        category: 'Tech',
        location: 'Dronning Louises Bro',
        time: '18:00 – 20:00',
        date: '10 MAJ',
        distance: '1.4 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 58,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 156,
        title: 'Naturvejledning #30',
        category: 'Natur',
        location: 'Fælledparken',
        time: '11:00 – 13:00',
        date: '28 APR',
        distance: '3.1 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 43,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 157,
        title: 'Rollespil #30',
        category: 'Friluft',
        location: 'Idrætscenter Vanløse',
        time: '10:00 – 12:00',
        date: '8 MAJ',
        distance: '4.0 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 56,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 158,
        title: 'Frøbyttedag #30',
        category: 'Natur',
        location: 'Vesterbro Torv',
        time: '12:00 – 14:00',
        date: '4 MAJ',
        distance: '3.3 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 53,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 159,
        title: 'Lydhealing #31',
        category: 'Tech',
        location: 'Nørrebrohallen',
        time: '20:00 – 22:00',
        date: '5 MAJ',
        distance: '1.4 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: false,
        attending: 44,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 160,
        title: 'Brætspilsaften #31',
        category: 'Friluft',
        location: 'Torvehallerne',
        time: '11:00 – 13:00',
        date: '13 MAJ',
        distance: '2.0 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 51,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 161,
        title: 'Dokumentarvisning #31',
        category: 'Mad',
        location: 'Refshaleøen',
        time: '07:30 – 09:00',
        date: '8 MAJ',
        distance: '2.5 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 50,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 162,
        title: 'Sansehave-besøg #31',
        category: 'Tech',
        location: 'Utterslev Mose',
        time: '15:00 – 17:00',
        date: '1 MAJ',
        distance: '2.7 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 35,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 163,
        title: 'Tegne & malekreds #31',
        category: 'Kunst',
        location: 'Rosenborg Slot',
        time: '07:30 – 09:00',
        date: '4 MAJ',
        distance: '0.2 km',
        tags: ['kunst', 'kreativt', 'indendørs', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0d4d4',
        emoji: '🎨',
        hasImage: true,
        imgStripe: '#e8b8b8',
        attending: 9,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 164,
        title: 'Skak-klub #32',
        category: 'Friluft',
        location: 'Dyrehaven',
        time: '10:00 – 12:00',
        date: '1 MAJ',
        distance: '4.1 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 41,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 165,
        title: 'Plantebaseret madlavning #32',
        category: 'Socialt',
        location: 'Utterslev Mose',
        time: '20:00 – 22:00',
        date: '1 MAJ',
        distance: '3.4 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'lille begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: false,
        attending: 8,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 166,
        title: 'Parkour intro #32',
        category: 'Film',
        location: 'Biblioteket Østerbro',
        time: '12:00 – 14:00',
        date: '12 MAJ',
        distance: '1.8 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 10,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 167,
        title: 'Sprogcafé #32',
        category: 'Wellness',
        location: 'Assistens Kirkegård',
        time: '12:00 – 14:00',
        date: '7 MAJ',
        distance: '0.4 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: true,
        imgStripe: '#b8e8e8',
        attending: 18,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 168,
        title: 'Gadekunsttur #32',
        category: 'Historie',
        location: 'Blågårds Plads',
        time: '12:00 – 14:00',
        date: '9 MAJ',
        distance: '3.7 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'lille begivenhed', 'introvert', 'med alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 6,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 169,
        title: '3D-print workshop #33',
        category: 'Dans',
        location: 'Nordvest Kulturhus',
        time: '12:00 – 14:00',
        date: '28 APR',
        distance: '0.5 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: true,
        imgStripe: '#e8b8d4',
        attending: 32,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 170,
        title: 'Løbeklub #33',
        category: 'Film',
        location: 'Utterslev Mose',
        time: '12:00 – 14:00',
        date: '1 MAJ',
        distance: '0.5 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 52,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 171,
        title: 'Meditationssession #33',
        category: 'Tech',
        location: 'Nørreport Station',
        time: '21:00 – 23:30',
        date: '30 APR',
        distance: '1.2 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 25,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 172,
        title: 'Sprogcafé #33',
        category: 'Wellness',
        location: 'Superkilen',
        time: '09:00 – 11:00',
        date: '30 APR',
        distance: '3.8 km',
        tags: ['wellness', 'ro', 'indendørs', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0f0',
        emoji: '🧘',
        hasImage: false,
        attending: 17,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 173,
        title: 'Dokumentarvisning #33',
        category: 'Mad',
        location: 'Nordvest Kulturhus',
        time: '13:00 – 15:00',
        date: '29 APR',
        distance: '1.7 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 43,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 174,
        title: 'Frøbyttedag #34',
        category: 'Natur',
        location: 'Dyrehaven',
        time: '09:00 – 11:00',
        date: '28 APR',
        distance: '2.9 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 32,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 175,
        title: 'Kortfilmaften #34',
        category: 'Mad',
        location: 'Refshaleøen',
        time: '14:00 – 17:00',
        date: '14 MAJ',
        distance: '1.6 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: true,
        imgStripe: '#e8cbb8',
        attending: 48,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 176,
        title: 'Åndedrætsøvelser #34',
        category: 'Tech',
        location: 'Langelinie',
        time: '20:00 – 22:00',
        date: '15 MAJ',
        distance: '3.2 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 7,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 177,
        title: 'Open source-møde #34',
        category: 'Dans',
        location: 'Blågårds Plads',
        time: '12:00 – 14:00',
        date: '3 MAJ',
        distance: '4.1 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: true,
        imgStripe: '#e8b8d4',
        attending: 45,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 178,
        title: 'Urbant landbrug #34',
        category: 'Natur',
        location: 'Valby Kulturhus',
        time: '20:00 – 22:00',
        date: '9 MAJ',
        distance: '0.7 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 15,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 179,
        title: 'Kor for alle #35',
        category: 'Musik',
        location: 'Ørestad',
        time: '19:00 – 21:00',
        date: '3 MAJ',
        distance: '1.1 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 34,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 180,
        title: 'Cykeltur #35',
        category: 'Film',
        location: 'Nordvest Kulturhus',
        time: '18:00 – 20:00',
        date: '13 MAJ',
        distance: '2.6 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 15,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 181,
        title: 'Lyrik og melodi #35',
        category: 'Musik',
        location: 'Bispebjerg Bakke',
        time: '14:00 – 17:00',
        date: '1 MAJ',
        distance: '1.4 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: true,
        imgStripe: '#d4b8e8',
        attending: 24,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 182,
        title: 'Trivia-nat #35',
        category: 'Friluft',
        location: 'Kulturhuset Islands Brygge',
        time: '12:00 – 14:00',
        date: '4 MAJ',
        distance: '1.0 km',
        tags: ['friluft', 'udendørs', 'natur', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '⛺',
        hasImage: false,
        attending: 36,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 183,
        title: 'Oplæsning #35',
        category: 'Litteratur',
        location: 'Ørestad',
        time: '13:00 – 15:00',
        date: '12 MAJ',
        distance: '4.1 km',
        tags: ['litteratur', 'læring', 'indendørs', 'lav energi', 'mellem begivenhed', 'introvert', 'med alkohol'],
        color: '#d4e8e8',
        emoji: '📚',
        hasImage: false,
        attending: 24,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    },
    {
        id: 184,
        title: 'Stretching-session #36',
        category: 'Sport',
        location: 'Biblioteket Østerbro',
        time: '17:00 – 19:00',
        date: '5 MAJ',
        distance: '3.2 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 57,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 185,
        title: 'Lydhealing #36',
        category: 'Tech',
        location: 'Bispebjerg Bakke',
        time: '14:00 – 16:00',
        date: '5 MAJ',
        distance: '2.2 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: true,
        imgStripe: '#b8b8e8',
        attending: 4,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 186,
        title: 'Sushiaften #36',
        category: 'Socialt',
        location: 'Vesterbro Torv',
        time: '09:00 – 11:00',
        date: '1 MAJ',
        distance: '3.2 km',
        tags: ['socialt', 'indendørs', 'fællesskab', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8f0d4',
        emoji: '🤝',
        hasImage: true,
        imgStripe: '#cce8b8',
        attending: 56,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 187,
        title: 'Pilates udendørs #36',
        category: 'Sport',
        location: 'Refshaleøen',
        time: '21:00 – 23:30',
        date: '12 MAJ',
        distance: '1.3 km',
        tags: ['sport', 'udendørs', 'wellness', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#d4e8f0',
        emoji: '🏃',
        hasImage: true,
        imgStripe: '#b8d4e8',
        attending: 19,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 188,
        title: 'Fælles havebrug #36',
        category: 'Natur',
        location: 'Nørreport Station',
        time: '12:00 – 14:00',
        date: '9 MAJ',
        distance: '1.7 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 42,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 189,
        title: 'Kortfilmaften #37',
        category: 'Mad',
        location: 'Dronning Louises Bro',
        time: '14:00 – 17:00',
        date: '8 MAJ',
        distance: '1.7 km',
        tags: ['mad', 'kreativt', 'indendørs', 'socialt', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#f0ddd4',
        emoji: '🍳',
        hasImage: false,
        attending: 29,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 190,
        title: 'Intervaltræning #37',
        category: 'Film',
        location: 'Amager Strandpark',
        time: '14:00 – 16:00',
        date: '9 MAJ',
        distance: '2.9 km',
        tags: ['film', 'udendørs', 'socialt', 'lav energi', 'stor begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0f0d4',
        emoji: '🎬',
        hasImage: true,
        imgStripe: '#e8e8b8',
        attending: 53,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 191,
        title: '3D-print workshop #37',
        category: 'Dans',
        location: 'Refshaleøen',
        time: '15:00 – 17:00',
        date: '8 MAJ',
        distance: '3.1 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'mellem begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: true,
        imgStripe: '#e8b8d4',
        attending: 22,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 192,
        title: 'Åben musikworkshop #37',
        category: 'Musik',
        location: 'Biblioteket Østerbro',
        time: '21:00 – 23:30',
        date: '2 MAJ',
        distance: '0.5 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: true,
        imgStripe: '#d4b8e8',
        attending: 13,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 193,
        title: 'Lydhealing #37',
        category: 'Tech',
        location: 'Rådhuspladsen',
        time: '11:00 – 13:00',
        date: '15 MAJ',
        distance: '3.7 km',
        tags: ['tech', 'kreativt', 'indendørs', 'læring', 'lav energi', 'stor begivenhed', 'introvert', 'med alkohol'],
        color: '#d4d4f0',
        emoji: '💻',
        hasImage: false,
        attending: 48,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 194,
        title: 'Skriveværksted #38',
        category: 'Spil',
        location: 'Christiania',
        time: '14:00 – 17:00',
        date: '13 MAJ',
        distance: '0.9 km',
        tags: ['spil', 'socialt', 'indendørs', 'mellem energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0e8e8',
        emoji: '🎲',
        hasImage: false,
        attending: 40,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 195,
        title: 'Urbant landbrug #38',
        category: 'Natur',
        location: 'Frederiksberg Have',
        time: '13:00 – 15:00',
        date: '6 MAJ',
        distance: '0.5 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: true,
        imgStripe: '#b8e8d4',
        attending: 15,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 196,
        title: 'Middelalderby-tur #38',
        category: 'Historie',
        location: 'Langelinie',
        time: '18:00 – 19:30',
        date: '30 APR',
        distance: '1.8 km',
        tags: ['historie', 'udendørs', 'læring', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#f0e8d4',
        emoji: '🏛️',
        hasImage: true,
        imgStripe: '#e8d4b8',
        attending: 12,
        featured: false,
        desc: 'Lær noget nyt og del erfaringer med andre. Materialer stilles til rådighed.',
    },
    {
        id: 197,
        title: 'Fælles havebrug #38',
        category: 'Natur',
        location: 'Bispebjerg Bakke',
        time: '21:00 – 23:30',
        date: '12 MAJ',
        distance: '2.8 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'lille begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 4,
        featured: false,
        desc: 'En hyggelig begivenhed for alle med interesse for emnet. Kom som du er.',
    },
    {
        id: 198,
        title: 'Urbant landbrug #38',
        category: 'Natur',
        location: 'Ørestad',
        time: '21:00 – 23:30',
        date: '14 MAJ',
        distance: '1.0 km',
        tags: ['udendørs', 'natur', 'socialt', 'lav energi', 'mellem begivenhed', 'introvert', 'uden alkohol'],
        color: '#d4f0e8',
        emoji: '🌱',
        hasImage: false,
        attending: 11,
        featured: false,
        desc: 'Et fællesskab der samles om en fælles passion. Begyndere og erfarne er velkomne.',
    },
    {
        id: 199,
        title: 'Musikbingo #39',
        category: 'Musik',
        location: 'Amager Fælled',
        time: '09:00 – 11:00',
        date: '3 MAJ',
        distance: '3.1 km',
        tags: ['musik', 'kreativt', 'indendørs', 'mellem energi', 'mellem begivenhed', 'ekstrovert', 'med alkohol'],
        color: '#e8d4f0',
        emoji: '🎸',
        hasImage: false,
        attending: 18,
        featured: false,
        desc: 'Deltag i fællesskabets aktiviteter og mød nye mennesker. Alle er velkomne – ingen erfaring kræves.',
    },
    {
        id: 200,
        title: 'Kodeklub for voksne #39',
        category: 'Dans',
        location: 'Rosenborg Slot',
        time: '21:00 – 23:30',
        date: '28 APR',
        distance: '0.7 km',
        tags: ['dans', 'musik', 'socialt', 'indendørs', 'høj energi', 'stor begivenhed', 'ekstrovert', 'uden alkohol'],
        color: '#f0d4e8',
        emoji: '💃',
        hasImage: false,
        attending: 53,
        featured: false,
        desc: 'Gratis arrangement åbent for alle. Tilmelding ikke nødvendig.',
    }
];

(() => {

const date = new Date();
const formattedDate = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`;
ACTIVITIES = ACTIVITIES.map(act => {
    if (act.date === formattedDate)
        return {...act, featured: true}
    return act
})
console.log('kprt')
console.log(ACTIVITIES.filter(a => a.featured))

})()


/* Hobby options for the quiz — id values match activity tags */
const HOBBIES = [
    { id: 'natur', label: 'Natur & Friluft', emoji: '🌿' },
    { id: 'musik', label: 'Musik', emoji: '🎵' },
    { id: 'sport', label: 'Sport & Bevægelse', emoji: '⚡' },
    { id: 'kunst', label: 'Kunst & Kreativitet', emoji: '🎨' },
    { id: 'historie', label: 'Historie & Kultur', emoji: '📚' },
    { id: 'mad', label: 'Mad & Drikke', emoji: '🍽️' },
    { id: 'tech', label: 'Tech & Innovation', emoji: '💡' },
    { id: 'socialt', label: 'Sociale Møder', emoji: '🤝' },
    { id: 'film', label: 'Film & Teater', emoji: '🎭' },
    { id: 'wellness', label: 'Wellness & Ro', emoji: '🧘' },
];

const STORRELSE = [
    { id: 'lille begivenhed', label: 'Ikke for mange mennesker', emoji: '🧍‍♂️' },
    { id: 'mellem begivenhed', label: 'En god sjat', emoji: '🧑‍🤝‍🧑' },
    { id: 'stor begivenhed', label: 'En crowd', emoji: '👨‍👩‍👧‍👦' },
];

const ENERGI = [
    { id: 'lav energi', label: 'Stille og chill', emoji: '😌' },
    { id: 'mellem energi', label: 'Noget midt i mellem', emoji: '😄' },
    { id: 'høj energi', label: 'Fest og farver', emoji: '🎉' },
];

const PERSONLIGHED = [
    { id: 'introvert', label: 'Passe dig selv', emoji: '🏠' },
    { id: 'ekstrovert', label: 'Snakke med nye mennesker', emoji: '📢' },
];

const ALKOHOL = [
    { id: 'uden alkohol', label: 'Passe dig selv', emoji: '🏠' },
    { id: 'med alkohol', label: 'Snakke med nye mennesker', emoji: '📢' },
];

/* ─── QUIZ STEP CONFIG ───────────────────────────────────────────────────
   Each entry drives one quiz selection screen.
   To add a new step:
     1. Add a data array above (like HOBBIES, STORRELSE, etc.)
     2. Add a new entry here
     3. Add the matching HTML sub-view (#quiz-{id}) in index.html
        with IDs: quiz-{id}-grid, quiz-{id}-count, quiz-{id}-btn
   ─────────────────────────────────────────────────────────────────────── */
const QUIZ_STEPS = [
    { id: 'select',      data: HOBBIES,      multiSelect: true, minRequired: 2 },
    { id: 'storrelse',   data: STORRELSE,    multiSelect: true, minRequired: 1 },
    { id: 'energi',      data: ENERGI,       multiSelect: true, minRequired: 1 },
    { id: 'personlighed', data: PERSONLIGHED, multiSelect: true, minRequired: 1 },
];

/* Category filter options for the Explore screen */
const CATEGORIES = ['Alle', 'Sport', 'Kunst', 'Musik', 'Natur', 'Historie', 'Film', 'Mad'];


/* ─── APPLICATION STATE ─────────────────────────────────────────────────
   One plain object holds all mutable state.  UI is always derived from it.
   Never mutate state directly outside this file — use the public API.
   ─────────────────────────────────────────────────────────────────────── */
const state = {
    currentScreen: 'home',
    detailReturnScreen: 'explore',   /* which screen the X-btn returns to from detail */
    selectedActivity: null,
    /* quizSelections: stepId → Set (multiSelect steps) or string|null (single-select steps) */
    quizSelections: new Map(),
    quizResults: [],
    activeCategory: 'Alle',
};


/* ─── HTML GENERATORS ────────────────────────────────────────────────────
   Pure functions that return HTML strings.  No side effects.
   Called by the render functions below.
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Activity card — used in the featured grid, filtered view, and results.
 * @param {object} act        - activity object from ACTIVITIES
 * @param {string} fromScreen - screen id to return to when detail closes
 * @param {string} [topBadge] - optional top-right badge label ("Bedste match")
 * @param {number} [delay]    - CSS animation-delay in ms for stagger effect
 */
function createActivityCardHTML(act, fromScreen, topBadge, delay) {
    const [day, month] = act.date.split(' ');
    const stripeStyle = act.hasImage
        ? `style="--stripe-clr: ${act.imgStripe}"`
        : `style="background-color: ${act.color}"`;

    const imageHTML = act.hasImage
        ? `<div class="card-img-placeholder" ${stripeStyle}></div>`
        : `<div class="card-emoji-area" style="background-color:${act.color}">${act.emoji}</div>`;

    const topBadgeHTML = topBadge
        ? `<div class="card-top-badge">${topBadge}</div>`
        : '';

    const animStyle = delay !== undefined
        ? `animation-delay: ${delay}ms`
        : '';

    return `
    <button
      class="activity-card"
      style="${animStyle}"
      onclick="CityMeet.openActivity(${act.id}, '${fromScreen}')"
      aria-label="Åbn detaljer for ${act.title}"
    >
      <div class="card-image">
        ${imageHTML}
        <div class="card-date-badge">
          <span class="card-date-day">${day}</span>
          <span class="card-date-month">${month || ''}</span>
        </div>
        ${topBadgeHTML}
      </div>
      <div class="card-body">
        <div class="card-title">${act.title}</div>
        <div class="card-time">${act.time}</div>
        <div class="card-desc">${act.desc}</div>
        <div class="card-footer">
          <span class="card-distance">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${act.distance}
          </span>
          <div class="card-actions">
            <span class="card-attending">+${act.attending} deltager</span>
            <span class="card-more-btn">Se mere</span>
          </div>
        </div>
      </div>
    </button>
  `.trim();
}

/**
 * Activity list row — used for non-featured items in the "Alle" explore view.
 */
function createListRowHTML(act, delay) {
    const thumbClass = act.hasImage ? 'row-thumb has-image' : 'row-thumb';
    const thumbStyle = act.hasImage
        ? `style="--stripe-clr: ${act.imgStripe}"`
        : `style="background-color: ${act.color}"`;
    const thumbContent = act.hasImage ? '' : act.emoji;
    const animStyle = delay !== undefined ? `animation-delay: ${delay}ms` : '';

    return `
    <button
      class="activity-row"
      style="${animStyle}"
      onclick="CityMeet.openActivity(${act.id}, 'explore')"
      aria-label="${act.title}"
    >
      <div class="${thumbClass}" ${thumbStyle}>${thumbContent}</div>
      <div class="row-info">
        <div class="row-title">${act.title}</div>
        <div class="row-meta">${act.location} · ${act.time}</div>
      </div>
      <div class="row-right">
        <div class="row-date">${act.date}</div>
        <div class="row-distance">${act.distance}</div>
      </div>
      <svg class="row-chevron" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="#ccc" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  `.trim();
}

/**
 * Category filter pill button.
 */
function createCategoryPillHTML(cat, isActive) {
    return `
    <button
      class="cat-pill${isActive ? ' active' : ''}"
      onclick="CityMeet.filterCategory('${cat}')"
      aria-pressed="${isActive}"
    >${cat}</button>
  `.trim();
}

/**
 * Quiz option pill — used for every quiz selection step.
 * @param {object} option   - item from any quiz data array (HOBBIES, STORRELSE, etc.)
 * @param {string} stepId   - QUIZ_STEPS id (e.g. 'select', 'storrelse')
 * @param {boolean} isSelected
 */
function createQuizOptionHTML(option, stepId, isSelected) {
    const checkmark = isSelected ? `
    <span class="hobby-check" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
           stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  ` : '';

    return `
    <button
      class="hobby-pill${isSelected ? ' selected' : ''}"
      onclick="CityMeet.toggleOption('${stepId}', '${option.id}')"
      aria-pressed="${isSelected}"
      aria-label="${option.label}"
    >
      <span class="hobby-emoji" aria-hidden="true">${option.emoji}</span>
      <span class="hobby-label">${option.label}</span>
      ${checkmark}
    </button>
  `.trim();
}

/**
 * Detail screen — full HTML injected into #detail-body.
 * Portrait layout: left column (image + text) + right column (info + QR).
 */
function createDetailHTML(act) {
    const [day, month] = act.date.split(' ');

    const imageHTML = act.hasImage
        ? `<div class="detail-image">
         <div class="card-img-placeholder" style="--stripe-clr: ${act.imgStripe}; height:100%"></div>
       </div>`
        : `<div class="detail-emoji-area" style="background-color:${act.color}">
         ${act.emoji}
       </div>`;

    const tagsHTML = act.tags
        .map(t => `<span class="tag-pill">${t}</span>`)
        .join('');

    const infoCards = [
        { icon: '📍', label: 'Sted', value: act.location },
        { icon: '🕐', label: 'Tidspunkt', value: act.time },
        { icon: '🗺️', label: 'Afstand', value: act.distance },
    ].map(info => `
    <div class="info-card">
      <span class="info-icon">${info.icon}</span>
      <div>
        <div class="info-label">${info.label}</div>
        <div class="info-value">${info.value}</div>
      </div>
    </div>
  `).join('');

    return `
    <div class="detail-layout">

      <!-- Left: image, title, description, tags -->
      <div class="detail-left">
        ${imageHTML}
        <div class="detail-category">${act.category}</div>
        <h1 class="detail-title">${act.title}</h1>
        <p class="detail-desc">${act.desc}</p>
        <div class="detail-tags">${tagsHTML}</div>
      </div>

      <!-- Right: info cards + attending / QR -->
      <div class="detail-right">
        ${infoCards}
      </div>

      <div class="detail-qr-box">
        <div class="detail-qr-top">
          <div>
            <div class="attending-label">Deltager</div>
            <div class="attending-count">+${act.attending}</div>
            <div class="attending-sub">allerede tilmeldt</div>
          </div>
          <!-- QR placeholder (static pattern — replace src with real QR image if needed) -->
          <div class="qr-wrapper">
            <img src="qr-code.png">
          </div>
        </div>
        <div class="detail-qr-caption">Scan QR-koden for at tilmelde dig</div>
      </div>

    </div>
  `.trim();
}

/**
 * Returns an SVG that visually resembles a QR code (placeholder).
 * Replace with a real QR library / image when needed.
 */
function createQRSVG() {
    const dots = [
        [30, 4], [34, 4], [38, 4], [42, 4], [46, 4],
        [30, 10], [38, 10], [46, 10],
        [30, 16], [42, 16], [46, 16],
        [30, 30], [34, 30], [38, 30],
        [30, 48], [34, 48], [42, 54],
        [46, 48], [30, 62], [38, 62], [42, 62],
        [34, 56], [46, 56], [30, 56], [38, 50], [46, 50],
    ];

    const dotEls = dots
        .map(([x, y]) => `<rect x="${x}" y="${y}" width="4" height="4" rx="1" fill="#111"/>`)
        .join('');

    return `
    <svg width="68" height="68" viewBox="0 0 72 72" aria-label="QR kode placeholder">
      <rect width="72" height="72" fill="white"/>
      <!-- Top-left finder pattern -->
      <rect x="4"  y="4"  width="20" height="20" rx="3" fill="#111"/>
      <rect x="7"  y="7"  width="14" height="14" rx="2" fill="white"/>
      <rect x="10" y="10" width="8"  height="8"  rx="1" fill="#111"/>
      <!-- Top-right finder pattern -->
      <rect x="48" y="4"  width="20" height="20" rx="3" fill="#111"/>
      <rect x="51" y="7"  width="14" height="14" rx="2" fill="white"/>
      <rect x="54" y="10" width="8"  height="8"  rx="1" fill="#111"/>
      <!-- Bottom-left finder pattern -->
      <rect x="4"  y="48" width="20" height="20" rx="3" fill="#111"/>
      <rect x="7"  y="51" width="14" height="14" rx="2" fill="white"/>
      <rect x="10" y="54" width="8"  height="8"  rx="1" fill="#111"/>
      <!-- Data dots -->
      ${dotEls}
    </svg>
  `.trim();
}


/* ─── RENDER FUNCTIONS ───────────────────────────────────────────────────
   Each function reads from state + data, generates HTML, and writes it
   to the relevant DOM node.  Call them after state changes.
   ─────────────────────────────────────────────────────────────────────── */

/** Populates the "Sker i dag" featured 3-column card grid. */
function renderFeaturedGrid() {
    const featured = ACTIVITIES.filter(a => a.featured);
    document.getElementById('featured-grid').innerHTML =
        featured.map((act, i) => createActivityCardHTML(act, 'explore', null, i * 60)).join('');
}

/**
 * Populates the scrollable activity list / filtered card grid.
 * When activeCategory is "Alle" → shows non-featured items as list rows.
 * Otherwise → shows matching items as wrapping cards.
 */
function renderActivitiesList() {
    const container = document.getElementById('activities-container');
    const featured = document.getElementById('featured-section');
    const cat = state.activeCategory;

    if (cat === 'Alle') {
        /* Default view: show featured section + list of the rest */
        featured.style.display = '';
        const nonFeatured = ACTIVITIES.filter(a => !a.featured);
        container.innerHTML = `<div class="activities-list">${nonFeatured.map((act, i) => createListRowHTML(act, i * 50)).join('')
            }</div>`;
    } else {
        /* Filtered view: hide featured section, show matching cards */
        featured.style.display = 'none';
        const filtered = ACTIVITIES.filter(a =>
            a.category === cat || a.tags.includes(cat.toLowerCase())
        );
        container.innerHTML = filtered.length
            ? `<div class="cards-grid-filtered">${filtered.map((act, i) => createActivityCardHTML(act, 'explore', null, i * 60)).join('')
            }</div>`
            : '<p style="color:var(--text-muted);padding:16px 0">Ingen aktiviteter fundet i denne kategori.</p>';
    }
}

/** Populates the category pill row in the Explore screen. */
function renderCategoryPills() {
    document.getElementById('category-pills').innerHTML =
        CATEGORIES.map(cat => createCategoryPillHTML(cat, cat === state.activeCategory)).join('');
}

/**
 * Re-renders the option grid for a single quiz step and updates its counter + button.
 * @param {string} stepId - must match a QUIZ_STEPS entry
 */
function renderQuizStep(stepId) {
    const step = QUIZ_STEPS.find(s => s.id === stepId);
    const grid = document.getElementById(`quiz-${stepId}-grid`);
    if (!step || !grid) return;

    const selections = state.quizSelections.get(stepId);
    grid.innerHTML = step.data.map(option => {
        const isSelected = step.multiSelect
            ? (selections instanceof Set && selections.has(option.id))
            : selections === option.id;
        return createQuizOptionHTML(option, stepId, isSelected);
    }).join('');

    /* Update count label */
    const countEl = document.getElementById(`quiz-${stepId}-count`);
    if (countEl) {
        countEl.textContent = step.multiSelect
            ? (selections instanceof Set ? selections.size : 0)
            : (selections ? 1 : 0);
    }

    /* Enable/disable the step's next/submit button */
    const btn = document.getElementById(`quiz-${stepId}-btn`);
    if (btn) {
        const count = step.multiSelect
            ? (selections instanceof Set ? selections.size : 0)
            : (selections ? 1 : 0);
        const ready = count >= step.minRequired;
        btn.disabled = !ready;
        btn.setAttribute('aria-disabled', String(!ready));
    }
}

/** Re-renders all quiz steps. */
function renderAllQuizSteps() {
    QUIZ_STEPS.forEach(step => renderQuizStep(step.id));
}

/** Populates the results card grid. */
function renderResults() {
    document.getElementById('results-grid').innerHTML =
        state.quizResults.map((act, i) =>
            createActivityCardHTML(act, 'results', i === 0 ? 'Bedste match' : null, i * 60)
        ).join('');
}

/** Populates the detail screen body. */
function renderDetail(activity) {
    document.getElementById('detail-body').innerHTML = createDetailHTML(activity);
}


/* ─── NAVIGATION ─────────────────────────────────────────────────────────
   Switches between screens by toggling the .active class.
   Also handles side-effects like resetting quiz state.
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Navigate to a screen.
 * Valid screenIds: 'home', 'explore', 'detail', 'quiz', 'results'
 *
 * @param {string} screenId
 */
function navigateTo(screenId) {
    if (screenId === state.currentScreen) return;

    /* Side effects when entering specific screens */
    if (screenId === 'quiz') {
        /* Entering quiz always resets to intro step */
        resetQuiz();
    }

    /* Deactivate current screen */
    const prev = document.getElementById('screen-' + state.currentScreen);
    if (prev) prev.classList.remove('active');

    /* Activate new screen */
    const next = document.getElementById('screen-' + screenId);
    if (!next) {
        console.warn('CityMeet: unknown screen id "' + screenId + '"');
        return;
    }
    next.classList.add('active');
    state.currentScreen = screenId;
}

/**
 * Open an activity's detail screen.
 * @param {number} id         - activity id (from ACTIVITIES)
 * @param {string} fromScreen - screen to return to when detail is closed
 */
function openActivity(id, fromScreen) {
    const act = ACTIVITIES.find(a => a.id === id);
    if (!act) {
        console.warn('CityMeet: activity not found, id=' + id);
        return;
    }
    state.selectedActivity = act;
    state.detailReturnScreen = fromScreen || 'explore';
    renderDetail(act);
    navigateTo('detail');
}

/**
 * Close the detail screen and return to whichever screen opened it.
 * The X-button in index.html calls this.
 */
function closeDetail() {
    navigateTo(state.detailReturnScreen || 'explore');
}


/* ─── QUIZ LOGIC ─────────────────────────────────────────────────────────*/

/**
 * Advance from quiz intro view to hobby-selection view.
 * Called by the "Start →" button.
 */
function startQuiz() {
    showQuizView('select');
}

/**
 * Toggle/select an option in a quiz step, then re-render that step's UI.
 * Multi-select steps toggle the option in a Set.
 * Single-select steps set the value (or deselect if tapping the same option again).
 * @param {string} stepId   - QUIZ_STEPS id
 * @param {string} optionId - option.id from the step's data array
 */
function toggleOption(stepId, optionId) {
    const step = QUIZ_STEPS.find(s => s.id === stepId);
    if (!step) return;

    if (step.multiSelect) {
        const set = state.quizSelections.get(stepId);
        if (set.has(optionId)) {
            set.delete(optionId);
        } else {
            set.add(optionId);
        }
    } else {
        const current = state.quizSelections.get(stepId);
        state.quizSelections.set(stepId, current === optionId ? null : optionId);
    }

    renderQuizStep(stepId);
}

/**
 * Score and submit the quiz. Uses all step selections as matching criteria.
 * Hobby matches are weighted 2x since they're the primary interest filter.
 * Navigates to the results screen.
 */
function submitQuiz() {
    const hobbies = state.quizSelections.get('select');
    if (!hobbies || hobbies.size < 2) return;

    const scored = ACTIVITIES
        .filter(a => a.featured)
        .map(act => {
            let score = 0;
            /* Hobbies count double — they're the primary preference */
            Array.from(hobbies).forEach(hobby => {
                if (act.tags.includes(hobby)) score += 2;
                if (act.category.toLowerCase() === hobby) score += 2;
            });
            /* Other answers (size, energy, personality) count once each */
            QUIZ_STEPS
                .filter(s => s.id !== 'select')
                .forEach(s => {
                    const sel = state.quizSelections.get(s.id);
                    Array.from(sel).forEach(tag => {
                        if (act.tags.includes(tag)) score += 1;
                    });
                });
            return { ...act, score };
        })
        .sort((a, b) => b.score - a.score);

    state.quizResults = scored;
    console.log(state.quizResults)
    renderResults();
    navigateTo('results');
}

/**
 * Reset all quiz selections and return to the intro sub-view.
 * Called automatically when navigating to 'quiz' (via navigateTo).
 * Also callable directly as CityMeet.resetQuiz().
 */
function resetQuiz() {
    /* Re-initialise quizSelections from QUIZ_STEPS config */
    QUIZ_STEPS.forEach(step => {
        state.quizSelections.set(step.id, step.multiSelect ? new Set() : null);
    });
    state.quizResults = [];

    renderAllQuizSteps();
    showQuizView('intro');
}

/**
 * Switch between quiz sub-views.
 * Valid values: 'intro' | any QUIZ_STEPS id (e.g. 'select', 'storrelse', 'energi', 'personlighed')
 * @param {string} view
 */
function showQuizView(view) {
    const allViewIds = ['intro', ...QUIZ_STEPS.map(s => s.id)];
    allViewIds.forEach(id => {
        const el = document.getElementById(`quiz-${id}`);
        if (el) el.classList.toggle('active', id === view);
    });
}


/* ─── CATEGORY FILTER ────────────────────────────────────────────────────*/

/**
 * Set the active category and re-render the explore lists/pills.
 * @param {string} category - one of CATEGORIES
 */
function filterCategory(category) {
    state.activeCategory = category;
    renderCategoryPills();
    renderActivitiesList();
}


/* ─── RIPPLE ANIMATION ───────────────────────────────────────────────────
   Adds a CSS ripple wave element at the click position.
   Works for any <button> via event delegation (set up in init).
   ─────────────────────────────────────────────────────────────────────── */

/**
 * Create and animate a ripple on `button` at the pointer position from `event`.
 * @param {HTMLButtonElement} button
 * @param {MouseEvent|PointerEvent} event
 */
function addRipple(button, event) {
    const rect = button.getBoundingClientRect();
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.left = (event.clientX - rect.left) + 'px';
    wave.style.top = (event.clientY - rect.top) + 'px';
    button.appendChild(wave);
    /* Remove the element after the animation finishes to avoid DOM bloat */
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
}


/* ─── VIEWPORT SCALE ─────────────────────────────────────────────────────
   App is fullscreen — no scaling needed.
   ─────────────────────────────────────────────────────────────────────── */
function updateAppScale() { }


/* ─── INITIALISATION ─────────────────────────────────────────────────────
   Runs once the DOM is ready.
   ─────────────────────────────────────────────────────────────────────── */
function init() {
    /* Render all dynamic content into the DOM */
    renderFeaturedGrid();
    renderActivitiesList();
    renderCategoryPills();
    resetQuiz();

    /* Ripple: attach to every button click via delegation (covers dynamic content too) */
    document.getElementById('app').addEventListener('pointerdown', function (e) {
        const btn = e.target.closest('button');
        if (btn) addRipple(btn, e);
    });

    /* Responsive scale — run on load and on resize */
    updateAppScale();
    window.addEventListener('resize', updateAppScale);
}

/* Kick off when the DOM is ready */
document.addEventListener('DOMContentLoaded', init);


/* ─── PUBLIC API ─────────────────────────────────────────────────────────
   Everything the user's own JavaScript might need to call.
   Import this file, then call e.g.:
     CityMeet.navigateTo('explore');
     CityMeet.setAccent('#FF6B6B');
   ─────────────────────────────────────────────────────────────────────── */
window.CityMeet = {
    /** Navigate to a named screen ('home' | 'explore' | 'detail' | 'quiz' | 'results') */
    navigateTo,

    /** Open a specific activity detail. fromScreen determines where X returns to. */
    openActivity,

    /** Close the detail screen, returning to the screen that opened it. */
    closeDetail,

    /** Advance the quiz from intro to the first selection step. */
    startQuiz,

    /** Show a quiz sub-view by id: 'intro' or any QUIZ_STEPS id. */
    showQuizView,

    /** Toggle/select a quiz option. stepId = QUIZ_STEPS id, optionId = option.id. */
    toggleOption,

    /** Score and submit the quiz using all step selections. */
    submitQuiz,

    /** Reset all quiz selections and return to the quiz intro. */
    resetQuiz,

    /** Filter the Explore screen by category name (must be in CATEGORIES). */
    filterCategory,

    /** Change the accent colour at runtime. Pass a valid CSS colour string. */
    setAccent(color) {
        document.documentElement.style.setProperty('--accent', color);
        /* Recalculate derived accent tokens */
        document.documentElement.style.setProperty('--accent-shadow', color + '55');
        document.documentElement.style.setProperty('--accent-light', color + '18');
        document.documentElement.style.setProperty('--accent-mid', color + '33');
    },

    /** Read-only snapshot of the current application state. */
    getState() {
        const selections = {};
        state.quizSelections.forEach((val, key) => {
            selections[key] = val instanceof Set ? Array.from(val) : val;
        });
        return {
            currentScreen: state.currentScreen,
            selectedActivity: state.selectedActivity,
            quizSelections: selections,
            activeCategory: state.activeCategory,
        };
    },

    /** Direct access to the raw data arrays (read-only intent). */
    data: { ACTIVITIES, HOBBIES, STORRELSE, ENERGI, PERSONLIGHED, CATEGORIES, QUIZ_STEPS },
};