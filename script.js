document.addEventListener("DOMContentLoaded", () => {
    // 1. Registro de Plugins GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // 2. Base do Catálogo de Carros (Showroom) - Mantendo seus arquivos originais .webp
    const carsData = [
        {
            title: "Porsche 911",
            image: "Assets/porsche_branca.webp",
            color: "#8E2323",
            bg: "#f5f0ea",
            desc: "O Porsche 911 é um ícone automotivo que une tradição, luxo e alta performance em um design inconfundível. Reconhecido pela sua engenharia precisa e dirigibilidade marcante, ele oferece uma experiência única para quem busca esportividade, sofisticação e exclusividade em cada detalhe."
        },
        {
            title: "911 Carrera",
            image: "Assets/carro_cobre.webp",
            color: "#C68B59",
            bg: "#efe3d4",
            desc: "Sofisticação de ponta a ponta com o DNA das pistas. O 911 Carrera em tom cobre metálico entrega uma presença visual incomparável, combinada com o icônico motor boxer biturbo de alta rotação para uma resposta instantânea do acelerador."
        },
        {
            title: "911 GT3 RS",
            image: "Assets/carro_rosa.webp",
            color: "#D12B71",
            bg: "#fce8ef",
            desc: "Nascido nas pistas de corrida de endurance para desafiar limites na rua. Com aerodinâmica extrema, redução máxima de peso e uma postura inconfundivelmente agressiva, este modelo foi concebido para o puro êxtase da pilotagem."
        },
        {
            title: "911 Turbo S",
            image: "Assets/carro_vermelho.webp",
            color: "#6B1414",
            bg: "#8E2323",
            desc: "O epítome do desempenho sem comprometer o conforto diário. Com tração integral e números de aceleração de tirar o fôlego, o Turbo S representa a engenharia alemã em seu estado mais soberano e intimidador."
        }
    ];

    // 3. Estados Iniciais (GSAP)
    gsap.set(".main-content", { y: "10vh", scale: 0.98, opacity: 0 });
    gsap.set(".btn-secondary", { opacity: 0 });

    const splitPreloader = new SplitText(".porsche-text h2", { type: "chars" });
    const splitHeroTitle = new SplitText(".hero-title", { type: "words,chars" });

    // 4. Timeline Principal do Preloader & Hero
    const tl = gsap.timeline({
        onComplete: () => {
            document.body.style.overflowY = "auto";
            initScrollAnimations();
        }
    });

    /* ========================================================
       FASE 1: PRELOADER
       ======================================================== */
    tl.to(".brand-container", { opacity: 1, duration: 0.5 })
      .to(".porsche-crest", {
          opacity: 1,
          scale: 1,
          duration: 1.7,
          ease: "power3.out"
      })
      .from(splitPreloader.chars, {
          y: 250,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out"
      }, "-=1.2")
      .to("#preloader", {
          yPercent: -100,
          duration: 1,
          delay: 0.4,
          ease: "expo.inOut",
          onComplete: () => {
              document.getElementById("preloader").style.display = "none";
          }
      })
      .to(".main-content", {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "expo.inOut",
          clearProps: "all"
      }, "-=1.0")

    /* ========================================================
       FASE 2: HERO SECTION
       ======================================================== */
      .from(".site-header", {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out"
      }, "-=0.6")
      .to(".stripe", {
          height: "100%",
          duration: 1.5,
          ease: "power4.inOut",
          stagger: 0.3
      }, "-=0.8")
      .from(".hero-car", {
          y: "-120vh",
          duration: 1.6,
          ease: "power3.out"
      }, "-=0.9")
      .from(splitHeroTitle.chars, {
          opacity: 0,
          y: 60,
          rotationX: -90,
          duration: 0.8,
          stagger: 0.02,
          ease: "back.out(1.5)"
      }, "-=0.8")
      .from(".hero-desc", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out"
      }, "-=0.4")
      .to(".btn-secondary", {
          opacity: 1,
          duration: 0.4,
          ease: "power3"
      }, "-=0.1");

    /* ========================================================
       FASE 3: ANIMAÇÃO DE SCROLL (SHOWROOM)
       ======================================================== */
    function initScrollAnimations() {
        const showroomTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".showroom",
                start: "top 75%",
                end: "top 30%",
                toggleActions: "play none none none" // Alterado para não reverter e travar elementos no scroll back
            }
        });

        showroomTl
            .from(".showroom-header", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
            .from("#showroom-title", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
            .from("#showroom-main-img", { x: 80, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
            .from(".thumb-item", { x: -30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }, "-=0.8")
            .from(".showroom-info", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
    }

    /* ========================================================
       FASE 4: INTERATIVIDADE SHOWROOM (CORRIGIDO ANTI-BUG)
       ======================================================== */
    const thumbItems = document.querySelectorAll(".thumb-item");
    const mainImg = document.getElementById("showroom-main-img");
    const titleEl = document.getElementById("showroom-title");
    const descEl = document.getElementById("showroom-desc");

    let isAnimating = false;

    thumbItems.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            // Se já estiver rodando animação OU já for a miniatura selecionada, ignora
            if (isAnimating || thumb.classList.contains("active")) return;

            isAnimating = true;

            // 1. Atualiza classe ativa
            thumbItems.forEach((t) => t.classList.remove("active"));
            thumb.classList.add("active");

            // 2. Coleta dados
            const index = parseInt(thumb.getAttribute("data-index"), 10);
            const car = carsData[index];

            // 3. Muda a cor de destaque (CSS Variables)
            gsap.to(":root", {
                "--accent-color": car.color,
                duration: 0.6,
                ease: "power2.out"
            });

            // 3b. Muda a cor de fundo da seção showroom
            gsap.to(".showroom-bg", {
                backgroundColor: car.bg,
                duration: 0.6,
                ease: "power2.out"
            });

            // 4. Timeline com fromTo para GARANTIR que nada permaneça oculto
            const changeTl = gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                }
            });

            changeTl
                // Esconde rapidamente os elementos atuais
                .to([mainImg, titleEl, descEl], {
                    opacity: 0,
                    y: 10,
                    duration: 0.25,
                    stagger: 0.03,
                    ease: "power2.in"
                })
                // Troca as fontes de dados via JavaScript
                .add(() => {
                    mainImg.src = car.image;
                    titleEl.textContent = car.title;
                    descEl.textContent = car.desc;
                })
                // Entra com a imagem garantindo opacity: 1 no final e limpando props de GPU
                .fromTo(mainImg, 
                    { opacity: 0, x: 30, y: 0 },
                    { 
                      opacity: 1, 
                      x: 0, 
                      duration: 0.5, 
                      ease: "power3.out",
                      clearProps: "transform" // Evita perda de qualidade/borrão na imagem
                    }
                )
                // Entra com Título e Descrição garantindo opacity: 1 no final
                .fromTo([titleEl, descEl],
                    { opacity: 0, y: 15 },
                    { 
                      opacity: 1, 
                      y: 0, 
                      duration: 0.45, 
                      stagger: 0.08, 
                      ease: "power3.out",
                      clearProps: "transform,opacity" // Restaura a renderização limpa do browser
                    },
                    "-=0.35"
                );
        });
    });
});