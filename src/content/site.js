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
      eyebrow: "Quién soy",
      title: "Sobre mí",
      paragraphs: [
        "Soy Jesús León Romero Atienza, estudiante de Ingeniería del Software en U-TAD, Madrid. En septiembre de 2026 comenzaré mi tercer curso, después de dos años en los que he construido una base técnica en desarrollo full-stack, bases de datos, arquitectura de software y programación de sistemas. Además, el español es mi lengua materna, cuento con un nivel C1 de inglés y A2 de alemán, por lo que puedo desenvolverme con documentación técnica y en entornos internacionales, especialmente en inglés. Sin embargo, no me interesa comprender estas áreas como elementos aislados. Lo que realmente me atrae es entender un producto digital de forma completa: cómo se diseña su arquitectura, cómo funciona internamente, qué problema resuelve y qué experiencia ofrece a la persona que lo utiliza.",
      ],
    },
    chapters: [
      {
        number: "01",
        heading: "Base técnica",
        paragraphs: [
          "Durante estos años he trabajado con distintos lenguajes de programación, frameworks y stacks tecnológicos. Aunque he utilizado herramientas diferentes según las necesidades de cada proyecto, los lenguajes con los que más he trabajado y que forman mi base principal son C, C++, Java y Python. Aun así, no me gusta depender de una única tecnología. Cuando un proyecto me plantea un reto diferente, soy capaz de investigar las herramientas necesarias, comprender el problema y adaptarme con rapidez. También he trabajado en proyectos de automatización de procesos empresariales mediante n8n y he desarrollado páginas web utilizando un stack formado por Astro, GSAP, PostgreSQL y Node.js. Todo ello me ha permitido pasar de la programación más cercana al sistema a la creación de aplicaciones, automatizaciones y experiencias web completas.",
        ],
      },
      {
        number: "02",
        heading: "Dirección profesional",
        paragraphs: [
          "En cuanto a mi dirección académica y profesional, durante los próximos años quiero profundizar en Data Science y, progresivamente, en machine learning. No considero los datos como un camino separado de la Ingeniería del Software, sino como una evolución de la misma base. Mi objetivo es aprender a diseñar sistemas capaces de recoger, organizar e interpretar información para convertirla en decisiones, automatizaciones y soluciones que generen un valor real.",
        ],
      },
      {
        number: "03",
        heading: "Visión de producto",
        paragraphs: [
          "Por otro lado, la tecnología no es el único ámbito que ha influido en mi manera de pensar. Mantengo un interés constante por la inversión, los mercados financieros y el análisis de negocios, especialmente por conceptos como los modelos de negocio, la creación de valor, la segmentación de clientes o la evaluación del riesgo. Además, tengo experiencia en diseño gráfico, creando portadas, banners, miniaturas y otros recursos visuales para proyectos personales y colectivos. Aunque a primera vista puedan parecer áreas diferentes, para mí forman parte de una misma manera de entender un producto: comprender qué se construye, para quién se construye, qué valor aporta y cómo debe comunicarse.",
        ],
        cta: {
          label: "Ver archivo de diseño",
          ariaLabel: "Ver archivo de diseño; se abre en una pestaña nueva",
          href: "https://drive.google.com/drive/folders/1e5ltPjqbFB5bYeWJhEbrtPfGYHE3329-?usp=sharing",
        },
      },
      {
        number: "04",
        heading: "Mentalidad e identidad",
        paragraphs: [
          "Una parte importante de mi forma de trabajar también procede de mi experiencia compitiendo en videojuegos y esports. Haber participado en entornos competitivos de títulos como Fortnite, Overwatch, Counter-Strike o Clash Royale me enseñó la importancia de la disciplina, la constancia, el control emocional y la capacidad de adaptarse rápidamente. También me permitió aprender a comunicarme con personas diferentes, aceptar errores, tomar decisiones bajo presión y contribuir a un equipo sin perder de vista el rendimiento colectivo.",
          "Por último, intereses como la moda, la música, el cine, la crítica cinematográfica y la cultura digital han desarrollado mi sensibilidad hacia la creatividad, la comunicación y la experiencia de usuario. Todo ello define el perfil que estoy construyendo: una persona con una base técnica cada vez más sólida, una mentalidad analítica y una atención especial por los detalles. Mi objetivo es continuar aprendiendo y participar en proyectos donde pueda combinar ingeniería, datos y creatividad para desarrollar soluciones útiles, bien construidas y con una identidad propia.",
        ],
        cta: {
          label: "Ver trayectoria competitiva",
          ariaLabel: "Ver trayectoria competitiva; se abre en una pestaña nueva",
          href: "https://drive.google.com/drive/folders/1kWFINuTwxwC1niwWFxsRmgF5mbtppKYF?usp=sharing",
        },
      },
    ],
    skillsTitle: "Skills",
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
        ],
      },
      {
        id: "web",
        title: "Web",
        items: [
          ["HTML", "html.png"],
          ["CSS", "css.png"],
          ["Astro", null],
          ["Node.js", "nodejs.png"],
          ["GSAP", null],
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
          ["n8n", null],
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
        ],
      },
    ],
    formacion: {
      title: "Formación",
      entry: {
        text: "Estudiante de tercer curso de Ingeniería del Software en U-TAD, con mención en Ingeniería de Datos.",
        href: "https://u-tad.com/grados/ingenieria-software",
      },
    },
    idiomas: {
      title: "Idiomas",
      items: ["Español — Nativo", "Inglés — C1", "Alemán — A2"],
    },
  },
  projects: {
    eyebrow: "Proyectos — en construcción",
    title: "Proyectos destacados",
    note:
      "Plantillas visuales: títulos provisionales, imágenes placeholder y sin enlaces definitivos. Se sustituirán por proyectos reales documentados.",
    items: [
      {
        id: "01",
        category: "FULL-STACK",
        tags: ["Full-stack", "UI"],
        title: "Proyecto Full-stack (placeholder)",
        status: "Próximamente",
      },
      {
        id: "02",
        category: "DATA SCIENCE",
        tags: ["Python", "Data"],
        title: "Proyecto de Data Science (placeholder)",
        status: "Próximamente",
      },
      {
        id: "03",
        category: "VISUAL / UI",
        tags: ["Design", "Branding"],
        title: "Sistema Visual (placeholder)",
        status: "Próximamente",
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
        },
        {
          title: "Páginas web comerciales y visuales",
          text: "Webs con estructura clara, orientadas a presentar servicios o productos con una estética cuidada.",
          tags: ["Web", "UI", "Negocio"],
        },
        {
          title: "Auditoría y asesoramiento técnico/visual",
          text: "Sesión previa obligatoria para entender el problema real antes de proponer una solución técnica o visual.",
          tags: ["Auditoría", "Consultoría", "Estrategia"],
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
          href: "/tools/video-converter/",
        },
        {
          title: "Comprobador de quién no te sigue en Instagram",
          status: "En desarrollo",
          text:
            "Herramienta pensada para ver qué cuentas sigues que no te siguen de vuelta en Instagram. La lógica y el script se conectarán próximamente.",
          tags: ["Instagram", "Social", "Próximamente"],
          cta: "Próximamente",
        },
      ],
    },
  },
  servicesTools: {
    title: "Servicios y Tools",
    services: {
      description: [
        { text: "Combino " },
        { text: "desarrollo técnico", strong: true },
        { text: " y " },
        { text: "criterio visual", strong: true },
        {
          text: " para ayudar a negocios que necesitan resolver correctamente ambas dimensiones. Creo ",
        },
        { text: "automatizaciones de procesos tecnológicos", strong: true },
        { text: " para empresas y " },
        { text: "páginas web comerciales", strong: true },
        { text: ", visuales y estéticas. Cada proyecto comienza con " },
        { text: "asesoramiento técnico y visual", strong: true },
        { text: " previo y una " },
        { text: "auditoría personal obligatoria", strong: true },
        { text: " con el cliente, destinada a comprender correctamente el problema, " },
        { text: "reducir errores", strong: true },
        { text: " y alinear expectativas. Además, aporto recomendaciones adicionales sobre " },
        { text: "estructura, diseño, comunicación y viabilidad técnica", strong: true },
        { text: "." },
      ],
      ctaLabel: "Ir a la página de servicios",
    },
    tools: {
      description:
        "Desarrollo pequeñas herramientas personales que parten de necesidades concretas y que voy construyendo y publicando progresivamente. El objetivo es crear utilidades sencillas, accesibles y transparentes que resuelvan tareas específicas sin añadir complejidad innecesaria. Esta colección crecerá poco a poco conforme las herramientas estén preparadas para utilizarse.",
      ctaLabel: "Ir a la página de herramientas",
    },
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos de tu próxima idea",
    text: "Abierto a colaborar en proyectos, seguir aprendiendo y construir productos digitales con criterio técnico y visual.",
    emailIntro: "Si prefieres escribirme manualmente, puedes hacerlo mediante este correo:",
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
      submitIdle: "Enviar mensaje",
      submitLoading: "Enviando…",
      submitSuccess: "Formulario preparado. El envío real se conectará próximamente.",
      submitError: "Revisa los campos marcados antes de continuar.",
      fields: {
        name: "Nombre",
        email: "Email",
        reason: "Razón de contacto",
        reasonOptions: ["Colaboración", "Proyecto", "Pregunta general", "Otro"],
        subject: "Asunto",
        message: "Mensaje",
        preferredResponse: "Método preferido de respuesta",
        preferredResponseOptions: ["Email", "Cualquiera"],
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Tienes experiencia profesional?",
        a: "Todavía no en un puesto profesional — este portfolio se centra en proyectos académicos y personales mientras termino el grado.",
      },
      {
        q: "¿Estás disponible para trabajos freelance?",
        a: "Placeholder — se actualizará en cuanto la disponibilidad esté confirmada.",
      },
      {
        q: "¿Puedo ver tu trabajo de diseño gráfico?",
        a: "Sí — el enlace al archivo de diseño está disponible en la sección Sobre mí.",
      },
      {
        q: "¿Cuál es la mejor forma de contactarte?",
        a: "Por ahora, el email es el canal más fiable — puedes usar el formulario o los enlaces de la sección Contacto.",
      },
    ],
  },
  closing: {
    text: "Construyendo, un proyecto cada vez.",
    signature: "— chiissuu",
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
      eyebrow: "Who I am",
      title: "About Me",
      paragraphs: [
        "My name is Jesús León Romero Atienza, and I am a Software Engineering student at U-TAD in Madrid. In September 2026, I will begin my third year after spending the first two years building a technical foundation in full-stack development, databases, software architecture, and systems programming. I am also a native Spanish speaker with a C1 level of English and an A2 level of German, which allows me to work with technical documentation and operate in international environments, particularly in English. However, I am not interested in understanding these areas as isolated disciplines. What truly motivates me is understanding a digital product as a complete system: how its architecture is designed, how it works internally, which problem it solves, and what kind of experience it provides to the people using it.",
      ],
    },
    chapters: [
      {
        number: "01",
        heading: "Technical foundation",
        paragraphs: [
          "Throughout these years, I have worked with different programming languages, frameworks, and technology stacks. Although the tools I use depend on the requirements of each project, the languages I have worked with the most and that form my main technical foundation are C, C++, Java, and Python. Even so, I do not like being limited to a single technology. When a project presents a different challenge, I am able to research the required tools, understand the problem, and adapt quickly. I have also worked on business process automation projects using n8n and developed websites with a stack consisting of Astro, GSAP, PostgreSQL, and Node.js. These experiences have allowed me to move from lower-level programming to the development of applications, automations, and complete web experiences.",
        ],
      },
      {
        number: "02",
        heading: "Professional direction",
        paragraphs: [
          "Regarding my academic and professional direction, I want to move deeper into Data Science and gradually into machine learning over the next few years. I do not see data as a separate path from Software Engineering, but as a natural extension of the same foundation. My goal is to learn how to design systems that can collect, organize, and interpret information, transforming it into decisions, automations, and solutions that create real value.",
        ],
      },
      {
        number: "03",
        heading: "Product perspective",
        paragraphs: [
          "Technology is not the only field that has influenced the way I think. I have developed a consistent interest in investing, financial markets, and business analysis, particularly in areas such as business models, value creation, customer segmentation, and risk assessment. I also have experience in graphic design, creating covers, banners, thumbnails, and other visual assets for personal and collaborative projects. Although these areas may initially appear unrelated, I see them as part of the same way of understanding a product: knowing what is being built, who it is being built for, which value it provides, and how that value should be communicated.",
        ],
        cta: {
          label: "View design archive",
          ariaLabel: "View design archive; opens in a new tab",
          href: "https://drive.google.com/drive/folders/1e5ltPjqbFB5bYeWJhEbrtPfGYHE3329-?usp=sharing",
        },
      },
      {
        number: "04",
        heading: "Mindset and identity",
        paragraphs: [
          "An important part of my approach to work also comes from competing in video games and esports. Taking part in competitive environments across titles such as Fortnite, Overwatch, Counter-Strike, and Clash Royale taught me the importance of discipline, consistency, emotional control, and adaptability. It also helped me learn how to communicate with different personalities, accept mistakes, make decisions under pressure, and contribute to a team without losing sight of collective performance.",
          "Finally, my interest in fashion, music, cinema, film criticism, and digital culture has strengthened my sensitivity towards creativity, communication, and user experience. Together, these experiences define the profile I am building: someone with an increasingly solid technical foundation, an analytical mindset, and strong attention to detail. My goal is to continue learning and contribute to projects where I can combine engineering, data, and creativity to build useful, well-structured solutions with an identity of their own.",
        ],
        cta: {
          label: "View competitive background",
          ariaLabel: "View competitive background; opens in a new tab",
          href: "https://drive.google.com/drive/folders/1kWFINuTwxwC1niwWFxsRmgF5mbtppKYF?usp=sharing",
        },
      },
    ],
    skillsTitle: "Skills",
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
        ],
      },
      {
        id: "web",
        title: "Web",
        items: [
          ["HTML", "html.png"],
          ["CSS", "css.png"],
          ["Astro", null],
          ["Node.js", "nodejs.png"],
          ["GSAP", null],
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
          ["n8n", null],
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
        ],
      },
    ],
    formacion: {
      title: "Education",
      entry: {
        text: "Third-year Software Engineering student at U-TAD, specializing in Data Engineering.",
        href: "https://u-tad.com/grados/ingenieria-software",
      },
    },
    idiomas: {
      title: "Languages",
      items: ["Spanish — Native", "English — C1", "German — A2"],
    },
  },
  projects: {
    eyebrow: "Projects — under construction",
    title: "Featured Projects",
    note:
      "Visual templates: placeholder titles, placeholder images, and no final links yet. These will be replaced with real, documented projects.",
    items: [
      {
        id: "01",
        category: "FULL-STACK",
        tags: ["Full-stack", "UI"],
        title: "Full-stack Project (placeholder)",
        status: "Coming soon",
      },
      {
        id: "02",
        category: "DATA SCIENCE",
        tags: ["Python", "Data"],
        title: "Data Science Project (placeholder)",
        status: "Coming soon",
      },
      {
        id: "03",
        category: "VISUAL / UI",
        tags: ["Design", "Branding"],
        title: "Visual System (placeholder)",
        status: "Coming soon",
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
        },
        {
          title: "Commercial and visual websites",
          text: "Websites with a clear structure, built to present services or products with a polished aesthetic.",
          tags: ["Web", "UI", "Business"],
        },
        {
          title: "Technical/visual audit and guidance",
          text: "A mandatory prior session to understand the real problem before proposing a technical or visual solution.",
          tags: ["Audit", "Consulting", "Strategy"],
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
          href: "/tools/video-converter/",
        },
        {
          title: "Instagram non-follower checker",
          status: "In development",
          text:
            "A tool designed to see which accounts you follow that don't follow you back on Instagram. The logic and script will be connected soon.",
          tags: ["Instagram", "Social", "Coming soon"],
          cta: "Coming soon",
        },
      ],
    },
  },
  servicesTools: {
    title: "Services & Tools",
    services: {
      description: [
        { text: "I combine " },
        { text: "technical development", strong: true },
        { text: " and " },
        { text: "visual judgment", strong: true },
        { text: " to help businesses that need to get both dimensions right. I build " },
        { text: "technology process automations", strong: true },
        { text: " for companies and " },
        { text: "commercial websites", strong: true },
        { text: ", visual and aesthetic. Every project starts with prior " },
        { text: "technical and visual guidance", strong: true },
        { text: " and a " },
        { text: "mandatory personal audit", strong: true },
        { text: " with the client, aimed at properly understanding the problem, " },
        { text: "reducing errors", strong: true },
        { text: ", and aligning expectations. I also provide additional recommendations on " },
        { text: "structure, design, communication, and technical feasibility", strong: true },
        { text: "." },
      ],
      ctaLabel: "Go to the services page",
    },
    tools: {
      description:
        "I build small personal tools that start from concrete needs, and that I keep building and publishing gradually. The goal is to create simple, accessible, and transparent utilities that solve specific tasks without adding unnecessary complexity. This collection will grow little by little as each tool becomes ready to use.",
      ctaLabel: "Go to the tools page",
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your next idea",
    text: "Open to collaborating on projects, continuing to learn, and building digital products with technical and visual judgment.",
    emailIntro: "If you'd rather write to me manually, you can do so through this email:",
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
      submitIdle: "Send message",
      submitLoading: "Sending…",
      submitSuccess: "Form ready. Real submission will be connected soon.",
      submitError: "Check the marked fields before continuing.",
      fields: {
        name: "Name",
        email: "Email",
        reason: "Reason for contact",
        reasonOptions: ["Collaboration", "Project", "General question", "Other"],
        subject: "Subject",
        message: "Message",
        preferredResponse: "Preferred response method",
        preferredResponseOptions: ["Email", "Either"],
      },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    items: [
      {
        q: "Do you have professional experience?",
        a: "Not in a professional role yet — this portfolio focuses on academic and personal projects while I finish my degree.",
      },
      {
        q: "Are you available for freelance work?",
        a: "Placeholder — this will be updated once availability is confirmed.",
      },
      {
        q: "Can I see your graphic design work?",
        a: "Yes — the link to the design archive is available in the About Me section.",
      },
      {
        q: "What's the best way to contact you?",
        a: "For now, email is the most reliable channel — you can use the form or the links in the Contact section.",
      },
    ],
  },
  closing: {
    text: "Building, one project at a time.",
    signature: "— chiissuu",
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
