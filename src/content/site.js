// Bilingual content tree. `content.es` is the live Spanish site (unchanged
// in meaning/values from before, restructured only where the redesign
// explicitly asked for it — e.g. `about`, `servicesTools`, and the new
// `contact` fields). `content.en` is a complete, faithful English
// counterpart of the same shape (see `SiteContent` in
// `src/lib/content-types.ts`) — nothing here is summarized or trimmed.
//
// No page currently renders `content.en` (no `/en` route exists yet); it's
// prepared so a future locale switcher can consume it directly, typed
// identically to `content.es`.

const es = {
  seo: {
    title: "chiissuu | Jesús León — Software Engineer & Data Science",
    description:
      "Portfolio de Jesús León: Ingeniería del Software, Data Science y diseño visual.",
  },
  nav: {
    home: "Inicio",
    about: "Sobre mí",
    contact: "Contacto",
    projects: "Proyectos",
    services: "Servicios",
    tools: "Tools",
    faq: "FAQ",
  },
  hero: {
    // Three distinct strings, deliberately not the same property: `CHISU`
    // is the giant 5-letter display wordmark rendered only in the hero
    // (visual identity mark, not the real site name). `CHIISSUU` is the
    // actual site/brand name — the accessible name of the crossfade and
    // anywhere else the real name is needed. `CHISU®` is a third, dedicated
    // string used ONLY for the sidebar's boxed brand mark. Never derive one
    // from the others.
    displayWordmark: "CHISU",
    siteName: "CHIISSUU",
    sidebarMark: "CHISU®",
    title: ["Software Engineer", "Data Science", "GFX"],
    primaryCta: "Ver Proyectos",
    secondaryCta: "Sobre Mí",
    imageAlt: "Retrato recortado provisional de Jesús León",
    tagline:
      "Mentalidad competitiva forjada en esports, criterio de equipo y una obsesión constante por la cultura visual.",
    metrics: [
      { value: "2+", label: "años construyendo y aprendiendo" },
      { value: "10+", label: "proyectos académicos y personales" },
    ],
    chips: ["Creative", "Strategist", "Efficient", "Builder", "Team-first"],
    personalNote:
      "Fuera del código, me interesan la inversión, los mercados financieros y el análisis de negocio.",
  },
  about: {
    aboutMe: {
      title: "SOBRE MÍ",
      titleImage: {
        src: "/assets/images/about-title-es.png",
        width: 2446,
        height: 1400,
        crop: { x: 173, y: 454, width: 2084, height: 558 },
      },
      groupLabels: {
        intro: "/whoami",
        difference: "Qué me diferencia de la competencia",
      },
      closingPhrase: "proyectos con más profundidad, más personalidad y una experiencia cuidada.",
      projectsCta: { label: "Ver mis proyectos", href: "#projects" },
      accents: {
        strong: ["Jesús León Romero Atienza", "Ingeniería del Software", "Big Data", "desarrollo full-stack", "bases de datos", "arquitectura de software", "programación de sistemas", "diseño gráfico", "trabajar en equipo", "versión propia", "varias capas"],
        emojis: [
          { text: "U-TAD", symbol: "📚" },
          { text: "esports", symbol: "🎮" },
          { text: "moda", symbol: "👟" },
          { text: "música", symbol: "🎧" },
          { text: "redes sociales", symbol: "📱" },
        ],
        location: "Madrid, España",
        flags: [
          { text: "español", country: "es" },
          { text: "C1 de inglés", country: "gb" },
          { text: "A2 de alemán", country: "de" },
        ],
        links: [
          { text: "Ingeniería del Software con mención en Ingeniería de Datos (Big Data)", href: "https://u-tad.com/grados/ingenieria-software" },
          { text: "Centro Universitario de Tecnología y Arte Digital", href: "https://maps.app.goo.gl/Ppb4QnavdNihgWui9" },
        ],
      },
      paragraphs: [
        "Soy Jesús León Romero Atienza, estudiante de Ingeniería del Software con mención en Ingeniería de Datos (Big Data) en U-TAD, el Centro Universitario de Tecnología y Arte Digital, situado en mi ciudad natal, Madrid, España.",
        "Durante estos tres años de formación he construido una base en desarrollo full-stack, bases de datos, arquitectura de software y programación de sistemas.",
        "Domino totalmente el español, tengo un nivel C1 de inglés y un A2 de alemán.",
        "Lo que me diferencia de la competencia es la forma de conectar la tecnología con el diseño gráfico, el análisis de negocios y las finanzas.",
        "Mi experiencia en esports me ha enseñado a trabajar en equipo, mantener la disciplina y tomar decisiones bajo presión.",
        "La moda, la música y las redes sociales influyen en mi criterio visual y en la forma de comunicar mis proyectos.",
        "Esta combinación de disciplinas me ayuda a dar a cada proyecto una versión propia, con varias capas que se refuerzan entre sí. Así puedo crear soluciones que funcionan, transmiten una identidad y conectan con las personas. Mi diferencia frente a la competencia está en esa suma de perspectivas: proyectos con más profundidad, más personalidad y una experiencia cuidada.",
      ],
    },
    skillsTitle: "MI STACK DE TRABAJO",
    skillGroups: [
      {
        id: "software",
        title: "Software",
        items: [
          ["Java", "java.png"],
          ["Python", "python.png"],
          ["C", "c.png"],
          ["C++", "cpp.png"],
          ["JavaScript", "javascript.png"],
          ["PHP", "php.png"],
          ["TypeScript", "typescript.png"],
        ],
      },
      {
        id: "web",
        title: "Web",
        items: [
          ["Astro", "astro.png"],
          ["React", "react.png"],
          ["Node.js", "nodejs.png"],
          ["GSAP", "gsap.png"],
        ],
      },
      {
        id: "databases",
        title: "Bases de datos",
        items: [
          ["MySQL", "mysql.png"],
          ["PostgreSQL", "postgresql.png"],
          ["MariaDB", "mariadb.png"],
          ["MongoDB", "mongodb.png"],
          ["Qdrant", "qdrant.png"],
          ["Redis", "redis.png"],
          ["Neo4j", "neo4j.png"],
        ],
      },
      {
        id: "data",
        title: "Data",
        items: [
          ["Pandas", "pandas.png"],
          ["NumPy", "numpy.png"],
          ["Matplotlib", "matplotlib.png"],
          ["Seaborn", "seaborn.png"],
          ["Scikit-learn", "scikit-learn.png"],
          ["Jupyter", "jupyter.png"],
        ],
      },
      {
        id: "tools",
        title: "Herramientas",
        items: [
          ["Git", "git.png"],
          ["GitHub", "github.svg"],
          ["Docker", "docker.png"],
          ["Linux", "linux.png"],
          ["Windows", "windows.png"],
          ["n8n", "n8n.png"],
        ],
      },
      {
        id: "design",
        title: "Diseño",
        items: [
          ["Photoshop", "photoshop.png"],
          ["GIMP", "gimp.png"],
          ["Photopea", "photopea.png"],
          ["Canva", "canva.png"],
          ["After Effects", "after-effects.png"],
          ["Illustrator", "illustrator.png"],
        ],
      },
      {
        id: "collaboration",
        title: "Documentación y colaboración",
        items: [
          ["Obsidian", "obsidian.png"],
          ["Google Drive", "google-drive.png"],
          ["Word", "word.png"],
          ["Excel", "excel.png"],
          ["PowerPoint", "powerpoint.png"],
          ["Teams", "teams.png"],
        ],
      },
    ],
  },
  projects: {
    eyebrow: "Proyectos",
    title: "Proyectos destacados",
    titleImage: {
      src: "/assets/images/section-title-proyectos-es.webp",
      width: 2000,
      height: 1145,
      crop: { x: 103, y: 389, width: 1817, height: 436 },
    },
    note:
      "Una selección de los proyectos más relevantes que he desarrollado en mi trayectoria como ingeniero tecnológico.",
    noteStrong: ["proyectos más relevantes", "ingeniero tecnológico"],
    moreLabel: "Ver más en GitHub",
    moreHref: "https://github.com/chiissuu",
    items: [
      {
        id: "01",
        art: "network",
        category: "DEEP LEARNING",
        tags: ["Keras", "Redes neuronales", "Python"],
        title: "Clasificador de perros y gatos",
        description:
          "Notebook con Keras que distingue imágenes de perros y gatos mediante redes neuronales, con una exactitud de 0,99.",
        status: "En desarrollo",
        metric: { value: "0,99", label: "exactitud" },
      },
      {
        id: "02",
        art: "cache",
        category: "SISTEMAS",
        tags: ["C", "Linux", "Memoria caché"],
        title: "MegatronixOS",
        description:
          "Simulador en C de una memoria caché de correspondencia directa: decodifica direcciones, detecta aciertos y fallos, carga bloques desde una RAM simulada y genera estadísticas.",
        status: "",
        href: "https://github.com/chiissuu/MegatronixOS",
      },
      {
        id: "03",
        art: "order",
        category: "BACKEND / POO",
        tags: ["Java", "UML", "Patrones de diseño"],
        title: "Plataforma de pedidos de restaurante",
        description:
          "Proyecto universitario en equipo inspirado en Uber Eats y Glovo: comidas personalizables, varios métodos de entrega, precios dinámicos y notificaciones, con siete patrones de diseño.",
        status: "",
        href: "https://github.com/chiissuu/Restaurant-Ordering-Platform",
      },
      {
        id: "04",
        art: "shop",
        category: "WEB / API",
        tags: ["JavaScript", "Vite", "API"],
        title: "Tienda diaria de Fortnite",
        description:
          "Aplicación web que muestra la tienda diaria de Fortnite desde una API pública: secciones, tarjetas con precio, favoritos guardados y una caché de tres horas.",
        status: "",
        href: "https://github.com/chiissuu/M2-PWIC",
      },
      {
        id: "05",
        art: "graph",
        category: "AUTOMATIZACIÓN",
        tags: ["Python", "Playwright", "CLI"],
        title: "Instagram Checker",
        description:
          "Script en Python que compara seguidores y seguidos desde el export oficial de Instagram para ver quién no te sigue. Todo en local; la verificación online es opcional.",
        status: "",
        href: "https://github.com/chiissuu/instagram-checker",
      },
      {
        id: "06",
        art: "target",
        category: "WEB / JUEGO",
        tags: ["JavaScript", "HTML", "CSS"],
        title: "Aim Trainer",
        description:
          "Juego de puntería en el navegador: 15 segundos para acertar objetivos, con precisión, ranking local y modo oscuro, solo con HTML, CSS y JavaScript.",
        status: "",
        href: "https://github.com/chiissuu/aim-trainer",
      },
    ],
  },
  services: {
    eyebrow: "Servicios",
    title: "Servicios",
    intro: "Trabajo técnico y visual para negocios que necesitan resolver bien ambas partes.",
    items: [
      "Automatización de procesos tecnológicos para empresas",
      "Páginas web comerciales, visuales y estéticas",
      "Asesoramiento técnico y visual previo",
      "Auditoría personal obligatoria con el cliente antes del desarrollo, para entender el problema, reducir errores y ajustar expectativas",
      "Recomendaciones extra sobre estructura, diseño, comunicación y viabilidad técnica",
    ],
    cta: "Ver todos los servicios",
    page: {
      eyebrow: "Servicios profesionales",
      title: "Servicios",
      intro:
        "Desarrollo web full-stack, automatización de procesos y asesoramiento técnico/visual para empresas.",
      articles: [
        {
          title: "Automatización de procesos tecnológicos",
          text: "Automatización de tareas repetitivas, integraciones y flujos internos para reducir trabajo manual.",
          tags: ["Automatización", "Procesos", "Sistemas"],
          art: "flow",
        },
        {
          title: "Páginas web comerciales y visuales",
          text: "Webs con estructura clara, orientadas a presentar servicios o productos con una estética cuidada.",
          tags: ["Web", "UI", "Negocio"],
          art: "web",
        },
        {
          title: "Auditoría y asesoramiento técnico/visual",
          text: "Sesión previa obligatoria para entender el problema real antes de proponer una solución técnica o visual.",
          tags: ["Auditoría", "Consultoría", "Estrategia"],
          art: "audit",
        },
      ],
      form: {
        title: "Cuéntame tu proyecto",
        submitIdle: "Enviar solicitud",
        submitLoading: "Enviando…",
        submitSuccess: "Formulario preparado. El envío real se conectará próximamente.",
        submitError: "Revisa los campos marcados antes de continuar.",
        fields: {
          name: "Nombre",
          email: "Email",
          company: "Empresa / proyecto",
          serviceType: "Tipo de servicio",
          serviceOptions: [
            "Automatización de procesos",
            "Web comercial / visual",
            "Auditoría y asesoramiento",
            "Otro",
          ],
          budget: "Presupuesto estimado",
          timeline: "Plazo aproximado",
          problem: "Descripción del problema",
          message: "Mensaje adicional",
        },
      },
    },
  },
  tools: {
    eyebrow: "Tools",
    title: "Tools útiles personales",
    intro: "Pequeñas herramientas personales que voy construyendo y publicando poco a poco.",
    cta: "Ver tools",
    page: {
      eyebrow: "Utilidades personales",
      title: "Tools",
      intro: "Plantilla visual de herramientas propias. Se irán añadiendo a medida que estén listas.",
      items: [
        {
          title: "Conversor de vídeo a MP3 / MP4",
          status: "Disponible",
          text:
            "Extrae el audio de un vídeo como MP3 o conviértelo a un MP4 compatible. Todo se procesa en tu navegador — nada se sube a ningún servidor.",
          tags: ["Vídeo", "Audio", "Local"],
          cta: "Abrir conversor",
          state: "available",
          category: "Vídeo",
          featured: true,
          art: "video",
          href: "/video-converters/",
        },
        {
          title: "Herramientas de boosting para redes sociales",
          status: "En desarrollo",
          text:
            "Colección de utilidades para analizar y hacer crecer cuentas en redes sociales, empezando por Instagram. La lógica y los scripts se irán conectando poco a poco.",
          tags: ["Redes sociales", "Boosting", "Próximamente"],
          cta: "Próximamente",
          state: "building",
          category: "Redes sociales",
          featured: true,
          art: "social",
        },
      ],
    },
  },
  servicesTools: {
    services: {
      title: "Servicios",
      titleImage: {
        src: "/assets/images/section-title-servicios-es.webp",
        width: 2000,
        height: 1145,
        crop: { x: 138, y: 391, width: 1743, height: 434 },
      },
      description: [
        { text: "Combino " },
        { text: "desarrollo técnico", strong: true },
        { text: " y " },
        { text: "criterio visual", strong: true },
        { text: " para que tu negocio resuelva bien ambas partes: automatizo procesos y creo páginas web comerciales con una estética cuidada." },
      ],
      process: {
        title: "Cómo trabajo",
        steps: [
          {
            title: "Asesoramiento previo",
            text: "Valoramos qué necesitas, en lo técnico y en lo visual, antes de escribir una línea.",
          },
          {
            title: "Auditoría obligatoria",
            text: "Una sesión contigo para entender el problema, reducir errores y alinear expectativas.",
          },
          {
            title: "Desarrollo",
            text: "La automatización o la web, construida sobre lo acordado en la auditoría.",
          },
          {
            title: "Recomendaciones",
            text: "Propuestas adicionales sobre estructura, diseño, comunicación y viabilidad técnica.",
          },
        ],
      },
      ctaLabel: "Cuéntame tu proyecto",
    },
    tools: {
      title: "Tools",
      titleImage: {
        src: "/assets/images/section-title-tools-es.webp",
        width: 2000,
        height: 1145,
        crop: { x: 535, y: 407, width: 965, height: 414 },
      },
      description:
        "Pequeñas herramientas personales que nacen de necesidades concretas: sencillas, accesibles y transparentes. La colección crece poco a poco.",
      catalog: {
        filterFeatured: "Destacadas",
        categoriesLabel: "Filtrar por categoría",
        moreLabel: "Ver todas ({n})",
        lessLabel: "Ver menos",
        emptyLabel: "No hay herramientas con ese filtro.",
        count: { tools: ["herramienta", "herramientas"], available: ["disponible", "disponibles"] },
      },
      ctaLabel: "Ir a la página de herramientas",
    },
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos de tu próxima idea",
    titleImage: {
      src: "/assets/images/section-title-contacto-es.webp",
      width: 2000,
      height: 1145,
      crop: { x: 234, y: 396, width: 1562, height: 423 },
    },
    text: "Abierto a colaborar, seguir aprendiendo y construir productos digitales con criterio técnico y visual.",
    directTitle: "Escríbeme directamente",
    emailIntro: "La vía más rápida: respondo desde este correo.",
    emailButton: "Escribir por email",
    copyLabel: "Copiar",
    copiedLabel: "Copiado",
    channelsLabel: "También me encuentras en",
    formTitle: "O déjame un mensaje",
    links: {
      email: "jesusleonromero233@gmail.com",
      github: "https://github.com/chiissuu",
      githubLabel: "GitHub",
      linktree: "https://linktr.ee/chiissuu",
      linktreeLabel: "Redes Sociales",
      linkedinLabel: "LinkedIn",
      linkedinTooltip: "Enlace todavía no disponible",
    },
    form: {
      notice: "Al enviar se abrirá tu aplicación de correo con el mensaje ya preparado; no se guarda nada en ningún servidor.",
      submitIdle: "Enviar mensaje",
      submitLoading: "Preparando…",
      submitSuccess: "Se abrirá tu correo con el mensaje preparado. Si no se abre, copia mi email con el botón de al lado.",
      submitError: "Revisa los campos marcados antes de continuar.",
      fields: {
        name: "Nombre",
        email: "Email",
        reason: "Motivo",
        reasonOptions: ["Colaboración", "Proyecto", "Pregunta", "Otro"],
        message: "Mensaje",
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas frecuentes",
    titleImage: {
      src: "/assets/images/section-title-faq-es.webp",
      width: 2000,
      height: 1145,
      crop: { x: 692, y: 423, width: 621, height: 416 },
    },
    lead: "Lo que suelen preguntarme antes de empezar.",
    items: [
      {
        q: "¿Tienes experiencia profesional?",
        a: "Todavía no en un puesto profesional — este portfolio se centra en proyectos académicos y personales mientras termino el grado.",
        link: { label: "Ver mis proyectos", href: "#projects" },
      },
      {
        q: "¿Qué tecnologías usas?",
        a: "Sobre todo Python, JavaScript y TypeScript, con Astro y React para la web, y bases de datos como MongoDB, Redis o Neo4j. El stack completo está en «Mi stack de trabajo».",
        link: { label: "Ver mi stack", href: "#projects" },
      },
      {
        q: "¿Cómo empezamos un proyecto?",
        a: "Con asesoramiento previo y una auditoría personal obligatoria contigo, para entender bien el problema, reducir errores y alinear expectativas antes de desarrollar.",
        link: { label: "Ver cómo trabajo", href: "#services" },
      },
      {
        q: "¿Estás disponible para trabajos freelance?",
        a: "Estoy abierto a hablar de proyectos: cuéntame qué necesitas y valoramos juntos si encaja con mi disponibilidad.",
        link: { label: "Escribirme", href: "#contact" },
      },
      {
        q: "¿Puedo ver tu trabajo de diseño gráfico?",
        a: "Sí — el enlace al archivo de diseño está disponible en la sección Sobre mí.",
        link: { label: "Ir a Sobre mí", href: "#about" },
      },
      {
        q: "¿El conversor de vídeo sube mis archivos a algún servidor?",
        a: "No. Todo se procesa en tu navegador; ni el vídeo ni el audio salen de tu equipo.",
        link: { label: "Ver las herramientas", href: "#tools" },
      },
      {
        q: "¿Cuál es la mejor forma de contactarte?",
        a: "El email es el canal más directo: puedes escribirme desde el botón de Contacto o dejarme un mensaje en el formulario.",
        link: { label: "Ir a Contacto", href: "#contact" },
      },
    ],
    more: {
      text: "¿No está tu pregunta?",
      linkLabel: "Escríbeme",
      href: "#contact",
    },
  },
  closing: {
    text: "Gracias por llegar hasta aquí.",
    signature: "— chiissuu",
    topLabel: "Volver arriba",
  },
  videoConverter: {
    seo: {
      title: "Conversor de vídeo a MP3/MP4",
      description:
        "Extrae audio en MP3 o convierte tu vídeo a un MP4 compatible, totalmente en tu navegador. Nada se sube a ningún servidor.",
    },
    eyebrow: "Herramientas",
    title: "Conversor de vídeo",
    intro:
      "Extrae el audio de un vídeo como MP3 o conviértelo a un MP4 compatible con H.264/AAC. Todo el procesamiento ocurre en tu navegador, con FFmpeg compilado a WebAssembly.",
    privacyNotice:
      "Tus archivos se procesan únicamente en tu navegador y no se suben a ningún servidor.",
    responsibleUseNotice:
      "Procesa únicamente archivos propios o archivos para los que tengas autorización de uso.",
    labels: {
      error: "Error",
      warning: "Aviso",
    },
    dropzone: {
      label: "Arrastra un vídeo aquí o haz clic para seleccionarlo",
      hint: "Formatos de vídeo habituales · Máximo 200 MB · Máximo 15 minutos",
      button: "Seleccionar archivo",
      dragActive: "Suelta el archivo para cargarlo",
    },
    fileInfo: {
      name: "Nombre",
      size: "Tamaño",
      duration: "Duración",
      format: "Formato original",
      unknownDuration: "No disponible",
    },
    output: {
      label: "Formato de salida",
      mp3: "MP3 (solo audio)",
      mp4: "MP4 (vídeo compatible)",
      bitrateLabel: "Calidad del audio",
      bitrate128: "128 kbps",
      bitrate192: "192 kbps (recomendado)",
      bitrate256: "256 kbps",
    },
    actions: {
      convert: "Iniciar conversión",
      cancel: "Cancelar",
      download: "Descargar archivo",
      reset: "Convertir otro archivo",
    },
    status: {
      loadingEngine: "Descargando e iniciando el motor de conversión local (solo la primera vez)…",
      converting: "Convirtiendo…",
      done: "Conversión completada.",
      cancelled: "Conversión cancelada.",
    },
    errors: {
      tooLarge: "El archivo supera el tamaño máximo permitido (200 MB).",
      tooLong: "El vídeo supera la duración máxima permitida (15 minutos).",
      unsupportedFormat:
        "Este archivo no parece ser un vídeo compatible. Prueba con MP4, WebM, MOV, MKV o AVI.",
      emptyFile: "El archivo está vacío o no se ha podido leer.",
      metadataUnreadable:
        "Tu navegador no ha podido leer los metadatos de este vídeo. Puede que el formato no sea compatible.",
      engineLoadFailed:
        "No se pudo cargar el motor de conversión local. Comprueba tu conexión e inténtalo de nuevo.",
      conversionFailed: "Ha ocurrido un error durante la conversión. Prueba con otro archivo.",
      alreadyConverting: "Ya hay una conversión en curso.",
    },
    memoryWarning:
      "Este archivo es grande para un dispositivo móvil o con poca memoria. La conversión puede ir lenta o fallar.",
  },
};

const en = {
  seo: {
    title: "chiissuu | Jesús León — Software Engineer & Data Science",
    description:
      "Portfolio of Jesús León: Software Engineering, Data Science, and visual design.",
  },
  nav: {
    home: "Home",
    about: "About Me",
    contact: "Contact",
    projects: "Projects",
    services: "Services",
    tools: "Tools",
    faq: "FAQ",
  },
  hero: {
    // See the `es` block above for why these are three separate fields.
    displayWordmark: "CHISU",
    siteName: "CHIISSUU",
    sidebarMark: "CHISU®",
    title: ["Software Engineer", "Data Science", "Applied visually."],
    primaryCta: "View Projects",
    secondaryCta: "About Me",
    imageAlt: "Temporary cropped portrait of Jesús León",
    tagline:
      "Competitive mindset forged in esports, team judgment, and a constant obsession with visual culture.",
    metrics: [
      { value: "2+", label: "years building and learning" },
      { value: "10+", label: "academic and personal projects" },
    ],
    chips: ["Creative", "Strategist", "Efficient", "Builder", "Team-first"],
  },
  about: {
    aboutMe: {
      title: "ABOUT ME",
      titleImage: {
        src: "/assets/images/about-title-en.png",
        width: 2446,
        height: 1400,
        crop: { x: 139, y: 475, width: 2157, height: 537 },
      },
      groupLabels: {
        intro: "/whoami",
        difference: "What sets me apart from the competition",
      },
      closingPhrase: "projects with more depth, more personality, and a thoughtfully designed experience.",
      projectsCta: { label: "View my projects", href: "#projects" },
      accents: {
        strong: ["Jesús León Romero Atienza", "Software Engineering", "Big Data", "full-stack development", "databases", "software architecture", "systems programming", "graphic design", "work as part of a team", "a distinct identity", "several layers"],
        emojis: [
          { text: "U-TAD", symbol: "📚" },
          { text: "esports", symbol: "🎮" },
          { text: "Fashion", symbol: "👟" },
          { text: "music", symbol: "🎧" },
          { text: "social media", symbol: "📱" },
        ],
        location: "Madrid, Spain",
        flags: [
          { text: "Spanish", country: "es" },
          { text: "C1 level of English", country: "gb" },
          { text: "A2 level of German", country: "de" },
        ],
        links: [
          { text: "Software Engineering student specializing in Data Engineering (Big Data)", href: "https://u-tad.com/grados/ingenieria-software" },
          { text: "University Center for Technology and Digital Art", href: "https://maps.app.goo.gl/Ppb4QnavdNihgWui9" },
        ],
      },
      paragraphs: [
        "I am Jesús León Romero Atienza, a Software Engineering student specializing in Data Engineering (Big Data) at U-TAD, the University Center for Technology and Digital Art, in my hometown of Madrid, Spain.",
        "During these three years of study, I have built a foundation in full-stack development, databases, software architecture, and systems programming.",
        "I am fully fluent in Spanish, with a C1 level of English and an A2 level of German.",
        "What sets me apart from the competition is how I connect technology with graphic design, business analysis, and finance.",
        "My experience in esports has taught me to work as part of a team, stay disciplined, and make decisions under pressure.",
        "Fashion, music, and social media influence my visual judgment and the way I communicate my projects.",
        "This combination of disciplines helps me give each project a distinct identity, with several layers that reinforce one another. That lets me create solutions that work, express an identity, and connect with people. My difference from the competition lies in that mix of perspectives: projects with more depth, more personality, and a thoughtfully designed experience.",
      ],
    },
    skillsTitle: "MY WORK STACK",
    skillGroups: [
      {
        id: "software",
        title: "Software",
        items: [
          ["Java", "java.png"],
          ["Python", "python.png"],
          ["C", "c.png"],
          ["C++", "cpp.png"],
          ["JavaScript", "javascript.png"],
          ["PHP", "php.png"],
          ["TypeScript", "typescript.png"],
        ],
      },
      {
        id: "web",
        title: "Web",
        items: [
          ["Astro", "astro.png"],
          ["React", "react.png"],
          ["Node.js", "nodejs.png"],
          ["GSAP", "gsap.png"],
        ],
      },
      {
        id: "databases",
        title: "Databases",
        items: [
          ["MySQL", "mysql.png"],
          ["PostgreSQL", "postgresql.png"],
          ["MariaDB", "mariadb.png"],
          ["MongoDB", "mongodb.png"],
          ["Qdrant", "qdrant.png"],
          ["Redis", "redis.png"],
          ["Neo4j", "neo4j.png"],
        ],
      },
      {
        id: "data",
        title: "Data",
        items: [
          ["Pandas", "pandas.png"],
          ["NumPy", "numpy.png"],
          ["Matplotlib", "matplotlib.png"],
          ["Seaborn", "seaborn.png"],
          ["Scikit-learn", "scikit-learn.png"],
          ["Jupyter", "jupyter.png"],
        ],
      },
      {
        id: "tools",
        title: "Tools",
        items: [
          ["Git", "git.png"],
          ["GitHub", "github.svg"],
          ["Docker", "docker.png"],
          ["Linux", "linux.png"],
          ["Windows", "windows.png"],
          ["n8n", "n8n.png"],
        ],
      },
      {
        id: "design",
        title: "Design",
        items: [
          ["Photoshop", "photoshop.png"],
          ["GIMP", "gimp.png"],
          ["Photopea", "photopea.png"],
          ["Canva", "canva.png"],
          ["After Effects", "after-effects.png"],
          ["Illustrator", "illustrator.png"],
        ],
      },
      {
        id: "collaboration",
        title: "Documentation & collaboration",
        items: [
          ["Obsidian", "obsidian.png"],
          ["Google Drive", "google-drive.png"],
          ["Word", "word.png"],
          ["Excel", "excel.png"],
          ["PowerPoint", "powerpoint.png"],
          ["Teams", "teams.png"],
        ],
      },
    ],
  },
  projects: {
    eyebrow: "Projects",
    title: "Featured Projects",
    note:
      "A selection of the most relevant projects I have developed throughout my career as a technology engineer.",
    noteStrong: ["most relevant projects", "technology engineer"],
    moreLabel: "See more on GitHub",
    moreHref: "https://github.com/chiissuu",
    items: [
      {
        id: "01",
        art: "network",
        category: "DEEP LEARNING",
        tags: ["Keras", "Neural networks", "Python"],
        title: "Dog and cat classifier",
        description:
          "A Keras notebook that tells dog and cat images apart with neural networks, with an accuracy of 0.99.",
        status: "In progress",
        metric: { value: "0.99", label: "accuracy" },
      },
      {
        id: "02",
        art: "cache",
        category: "SYSTEMS",
        tags: ["C", "Linux", "Cache memory"],
        title: "MegatronixOS",
        description:
          "A C simulator of a direct-mapped cache memory: it decodes addresses, detects hits and misses, loads blocks from a simulated RAM and produces statistics.",
        status: "",
        href: "https://github.com/chiissuu/MegatronixOS",
      },
      {
        id: "03",
        art: "order",
        category: "BACKEND / OOP",
        tags: ["Java", "UML", "Design patterns"],
        title: "Restaurant ordering platform",
        description:
          "A team university project inspired by Uber Eats and Glovo: custom meals, several delivery methods, dynamic pricing and notifications, built with seven design patterns.",
        status: "",
        href: "https://github.com/chiissuu/Restaurant-Ordering-Platform",
      },
      {
        id: "04",
        art: "shop",
        category: "WEB / API",
        tags: ["JavaScript", "Vite", "API"],
        title: "Fortnite daily shop",
        description:
          "A web app that shows the Fortnite daily shop from a public API: sections, cards with prices, saved favorites and a three-hour cache.",
        status: "",
        href: "https://github.com/chiissuu/M2-PWIC",
      },
      {
        id: "05",
        art: "graph",
        category: "AUTOMATION",
        tags: ["Python", "Playwright", "CLI"],
        title: "Instagram Checker",
        description:
          "A Python script that compares followers and following from Instagram's official export to show who does not follow you back. Everything runs locally; online verification is optional.",
        status: "",
        href: "https://github.com/chiissuu/instagram-checker",
      },
      {
        id: "06",
        art: "target",
        category: "WEB / GAME",
        tags: ["JavaScript", "HTML", "CSS"],
        title: "Aim Trainer",
        description:
          "An aim game in the browser: 15 seconds to hit as many targets as you can, with accuracy, a local leaderboard and dark mode, using only HTML, CSS and JavaScript.",
        status: "",
        href: "https://github.com/chiissuu/aim-trainer",
      },
    ],
  },
  services: {
    eyebrow: "Services",
    title: "Services",
    intro: "Technical and visual work for businesses that need to get both parts right.",
    items: [
      "Technology process automation for companies",
      "Commercial, visual, and aesthetic websites",
      "Prior technical and visual guidance",
      "Mandatory personal audit with the client before development, to understand the problem, reduce errors, and align expectations",
      "Extra recommendations on structure, design, communication, and technical feasibility",
    ],
    cta: "See all services",
    page: {
      eyebrow: "Professional services",
      title: "Services",
      intro:
        "Full-stack web development, process automation, and technical/visual guidance for businesses.",
      articles: [
        {
          title: "Technology process automation",
          text: "Automating repetitive tasks, integrations, and internal workflows to reduce manual work.",
          tags: ["Automation", "Processes", "Systems"],
          art: "flow",
        },
        {
          title: "Commercial and visual websites",
          text: "Websites with a clear structure, built to present services or products with a polished aesthetic.",
          tags: ["Web", "UI", "Business"],
          art: "web",
        },
        {
          title: "Technical/visual audit and guidance",
          text: "A mandatory prior session to understand the real problem before proposing a technical or visual solution.",
          tags: ["Audit", "Consulting", "Strategy"],
          art: "audit",
        },
      ],
      form: {
        title: "Tell me about your project",
        submitIdle: "Send request",
        submitLoading: "Sending…",
        submitSuccess: "Form ready. Real submission will be connected soon.",
        submitError: "Check the marked fields before continuing.",
        fields: {
          name: "Name",
          email: "Email",
          company: "Company / project",
          serviceType: "Service type",
          serviceOptions: [
            "Process automation",
            "Commercial / visual website",
            "Audit and guidance",
            "Other",
          ],
          budget: "Estimated budget",
          timeline: "Approximate timeline",
          problem: "Problem description",
          message: "Additional message",
        },
      },
    },
  },
  tools: {
    eyebrow: "Tools",
    title: "Useful personal tools",
    intro: "Small personal tools I'm building and publishing little by little.",
    cta: "See tools",
    page: {
      eyebrow: "Personal utilities",
      title: "Tools",
      intro: "A visual template of my own tools. More will be added as they're ready.",
      items: [
        {
          title: "Video converter to MP3 / MP4",
          status: "Available",
          text:
            "Extract a video's audio as MP3 or convert it to a compatible MP4. Everything runs in your browser — nothing is uploaded to any server.",
          tags: ["Video", "Audio", "Local"],
          cta: "Open converter",
          state: "available",
          category: "Video",
          featured: true,
          art: "video",
          href: "/video-converters/",
        },
        {
          title: "Social media boosting tools",
          status: "In development",
          text:
            "A collection of utilities to analyse and grow social media accounts, starting with Instagram. The logic and scripts will be connected little by little.",
          tags: ["Social media", "Boosting", "Coming soon"],
          cta: "Coming soon",
          state: "building",
          category: "Social media",
          featured: true,
          art: "social",
        },
      ],
    },
  },
  servicesTools: {
    services: {
      title: "Services",
      description: [
        { text: "I combine " },
        { text: "technical development", strong: true },
        { text: " and " },
        { text: "visual judgment", strong: true },
        { text: " so your business gets both parts right: I automate processes and build commercial websites with a polished aesthetic." },
      ],
      process: {
        title: "How I work",
        steps: [
          {
            title: "Prior guidance",
            text: "We assess what you need, technically and visually, before a single line is written.",
          },
          {
            title: "Mandatory audit",
            text: "A session with you to understand the problem, reduce errors and align expectations.",
          },
          {
            title: "Development",
            text: "The automation or the website, built on what was agreed in the audit.",
          },
          {
            title: "Recommendations",
            text: "Additional suggestions on structure, design, communication and technical feasibility.",
          },
        ],
      },
      ctaLabel: "Tell me about your project",
    },
    tools: {
      title: "Tools",
      description:
        "Small personal tools that start from concrete needs: simple, accessible and transparent. The collection grows little by little.",
      catalog: {
        filterFeatured: "Featured",
        categoriesLabel: "Filter by category",
        moreLabel: "Show all ({n})",
        lessLabel: "Show less",
        emptyLabel: "No tools match this filter.",
        count: { tools: ["tool", "tools"], available: ["available", "available"] },
      },
      ctaLabel: "Go to the tools page",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your next idea",
    text: "Open to collaborating, continuing to learn, and building digital products with technical and visual judgment.",
    directTitle: "Write to me directly",
    emailIntro: "The quickest way: I reply from this address.",
    emailButton: "Send an email",
    copyLabel: "Copy",
    copiedLabel: "Copied",
    channelsLabel: "You can also find me on",
    formTitle: "Or leave me a message",
    links: {
      email: "jesusleonromero233@gmail.com",
      github: "https://github.com/chiissuu",
      githubLabel: "GitHub",
      linktree: "https://linktr.ee/chiissuu",
      linktreeLabel: "Social Links",
      linkedinLabel: "LinkedIn",
      linkedinTooltip: "Link not yet available",
    },
    form: {
      notice: "On sending, your mail app opens with the message already prepared; nothing is stored on any server.",
      submitIdle: "Send message",
      submitLoading: "Preparing…",
      submitSuccess: "Your mail app will open with the message prepared. If it doesn't, copy my email with the button next to it.",
      submitError: "Check the marked fields before continuing.",
      fields: {
        name: "Name",
        email: "Email",
        reason: "Reason",
        reasonOptions: ["Collaboration", "Project", "Question", "Other"],
        message: "Message",
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    lead: "What people usually ask before we start.",
    items: [
      {
        q: "Do you have professional experience?",
        a: "Not in a professional role yet — this portfolio focuses on academic and personal projects while I finish my degree.",
        link: { label: "See my projects", href: "#projects" },
      },
      {
        q: "What technologies do you use?",
        a: "Mostly Python, JavaScript and TypeScript, with Astro and React for the web, and databases such as MongoDB, Redis or Neo4j. The full stack is in \"My work stack\".",
        link: { label: "See my stack", href: "#projects" },
      },
      {
        q: "How do we start a project?",
        a: "With prior guidance and a mandatory personal audit with you, to understand the problem properly, reduce errors and align expectations before building.",
        link: { label: "See how I work", href: "#services" },
      },
      {
        q: "Are you available for freelance work?",
        a: "I'm open to talking about projects: tell me what you need and we'll see together whether it fits my availability.",
        link: { label: "Write to me", href: "#contact" },
      },
      {
        q: "Can I see your graphic design work?",
        a: "Yes — the link to the design archive is available in the About Me section.",
        link: { label: "Go to About me", href: "#about" },
      },
      {
        q: "Does the video converter upload my files to a server?",
        a: "No. Everything is processed in your browser; neither the video nor the audio leaves your device.",
        link: { label: "See the tools", href: "#tools" },
      },
      {
        q: "What's the best way to contact you?",
        a: "Email is the most direct channel: use the button in the Contact section or leave me a message in the form.",
        link: { label: "Go to Contact", href: "#contact" },
      },
    ],
    more: {
      text: "Your question isn't here?",
      linkLabel: "Write to me",
      href: "#contact",
    },
  },
  closing: {
    text: "Thanks for making it this far.",
    signature: "— chiissuu",
    topLabel: "Back to top",
  },
  videoConverter: {
    seo: {
      title: "Video converter to MP3/MP4",
      description:
        "Extract audio as MP3 or convert your video to a compatible MP4, entirely in your browser. Nothing is uploaded to any server.",
    },
    eyebrow: "Tools",
    title: "Video converter",
    intro:
      "Extract a video's audio as MP3 or convert it to an H.264/AAC-compatible MP4. All processing happens in your browser, powered by FFmpeg compiled to WebAssembly.",
    privacyNotice:
      "Your files are processed only in your browser and are never uploaded to any server.",
    responsibleUseNotice:
      "Only process files you own or have permission to use.",
    labels: {
      error: "Error",
      warning: "Notice",
    },
    dropzone: {
      label: "Drag a video here or click to select one",
      hint: "Common video formats · 200 MB maximum · 15 minutes maximum",
      button: "Select file",
      dragActive: "Drop the file to load it",
    },
    fileInfo: {
      name: "Name",
      size: "Size",
      duration: "Duration",
      format: "Original format",
      unknownDuration: "Not available",
    },
    output: {
      label: "Output format",
      mp3: "MP3 (audio only)",
      mp4: "MP4 (compatible video)",
      bitrateLabel: "Audio quality",
      bitrate128: "128 kbps",
      bitrate192: "192 kbps (recommended)",
      bitrate256: "256 kbps",
    },
    actions: {
      convert: "Start conversion",
      cancel: "Cancel",
      download: "Download file",
      reset: "Convert another file",
    },
    status: {
      loadingEngine: "Downloading and starting the local conversion engine (first time only)…",
      converting: "Converting…",
      done: "Conversion complete.",
      cancelled: "Conversion cancelled.",
    },
    errors: {
      tooLarge: "The file exceeds the maximum allowed size (200 MB).",
      tooLong: "The video exceeds the maximum allowed duration (15 minutes).",
      unsupportedFormat:
        "This file doesn't look like a supported video. Try MP4, WebM, MOV, MKV, or AVI.",
      emptyFile: "The file is empty or could not be read.",
      metadataUnreadable:
        "Your browser couldn't read this video's metadata. The format may not be supported.",
      engineLoadFailed:
        "Couldn't load the local conversion engine. Check your connection and try again.",
      conversionFailed: "Something went wrong during conversion. Try another file.",
      alreadyConverting: "A conversion is already in progress.",
    },
    memoryWarning:
      "This file is large for a mobile or low-memory device. Conversion may be slow or fail.",
  },
};

export const content = { es, en };
