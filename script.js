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
            color: "#af5200",
            bg: "#C68B59",
            desc: "Sofisticação de ponta a ponta com o DNA das pistas. O 911 Carrera em tom cobre metálico entrega uma presença visual incomparável, combinada com o icônico motor boxer biturbo de alta rotação para uma resposta instantânea do acelerador."
        },
        {
            title: "911 GT3 RS",
            image: "Assets/carro_rosa.webp",
            color: "#D12B71",
            bg: "#D12B71",
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

    // Estado inicial das bordas verticais (info-line): 0% de altura
    const isMobileLines = () => window.matchMedia("(max-width: 768px)").matches;
    const infoAxis = () => (isMobileLines() ? "scaleX" : "scaleY");
    gsap.set(".info-line", { [infoAxis()]: 0, transformOrigin: "center" });

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
       FASE 3: ANIMAÇÕES DE SCROLL (HERO + SHOWROOM)
       ======================================================== */

    // HERO: parallax de scroll — faixas vermelhas encolhem até 0% e o carro desce
    function initHeroScrollAnimation() {
        gsap.timeline({
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        })
            .to(".stripe", {
                scaleY: 0,
                transformOrigin: "top",
                ease: "none",
                duration: 1
            }, 0)
            .to(".car-wrapper", {
                y: "70vh",
                scale: 0.9,
                opacity: 0.4,
                ease: "none",
                duration: 1
            }, 0)
            .to(".hero-content", {
                y: -80,
                opacity: 0,
                ease: "none",
                duration: 1
            }, 0)
            .to(".hero-bg", {
                scale: 1.15,
                ease: "none",
                duration: 1
            }, 0);
    }

    // FOOTER: entrada dos elementos + parallax do texto gigante + interações
    function initFooterAnimations() {
        // Título do CTA pré-dividido para o reveal letra a letra (sem flash)
        const ctaSplit = new SplitText(".footer-cta-title", { type: "chars" });
        gsap.set(ctaSplit.chars, { yPercent: 110, opacity: 0, force3D: true });

        const footerTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".site-footer",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        footerTl
            .to(".footer-line", { scaleX: 1, duration: 1, ease: "power3.out" })
            .from(".footer-cta-label", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.7")
            .to(ctaSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.03,
                ease: "power3.out"
            }, "-=0.4")
            .from(".btn-footer", { scale: 0.8, opacity: 0, duration: 0.55, ease: "back.out(1.6)" }, "-=0.3")
            .from(".footer-brand", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.2")
            .from(".footer-col", { y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, "-=0.6")
            .from(".social-icon", { scale: 0, opacity: 0, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" }, "-=0.5")
            .from(".footer-bottom", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.3");

        // Parallax do texto gigante: surge por baixo e desliza conforme o scroll
        gsap.fromTo(".giant-text",
            { yPercent: 55 },
            {
                yPercent: -12,
                ease: "none",
                scrollTrigger: {
                    trigger: ".site-footer",
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1
                }
            }
        );

        // Preenchimento das letras: vinculado ao scroll (preenche ao entrar, despreenche ao sair)
        gsap.fromTo(".giant-text, .giant-red",
            { backgroundPosition: "0% 0%" },
            {
                backgroundPosition: "0% 100%",
                ease: "none",
                scrollTrigger: {
                    trigger: ".footer-giant",
                    start: "top 90%",
                    end: "center 50%",
                    scrub: 1
                }
            }
        );

        // Botão magnético (test drive)
        const footerBtn = document.querySelector(".btn-footer");
        if (footerBtn) {
            footerBtn.addEventListener("mousemove", (e) => {
                const rect = footerBtn.getBoundingClientRect();
                const relX = e.clientX - rect.left - rect.width / 2;
                const relY = e.clientY - rect.top - rect.height / 2;
                gsap.to(footerBtn, {
                    x: relX * 0.35,
                    y: relY * 0.35,
                    duration: 0.4,
                    ease: "power3.out"
                });
            });
            footerBtn.addEventListener("mouseleave", () => {
                gsap.to(footerBtn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.4)"
                });
            });
        }

        // Voltar ao topo (hero)
        const footerTop = document.querySelector(".footer-top");
        const heroSection = document.querySelector("#hero");
        if (footerTop && heroSection) {
            footerTop.addEventListener("click", (e) => {
                e.preventDefault();
                window.scrollTo({ top: heroSection.offsetTop, behavior: "smooth" });
            });
        }
    }

    // SHOWROOM: entrada dos elementos ao alcançar a seção
    function initScrollAnimations() {
        initHeroScrollAnimation();
        initFooterAnimations();

        const showroomTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".showroom",
                start: "top 75%",
                end: "top 30%",
                toggleActions: "play none none none" // Não reverte ao scrollar para trás
            }
        });

        showroomTl
            .from(".showroom-header", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" })
            .add(() => animateTitle(), "-=0.4")
            .from("#showroom-main-img", { x: 80, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
            .from(".thumb-item", { x: -30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }, "-=0.8")
            .from(".showroom-info", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
            .add(() => infoLinesTween(1), "-=0.5");
    }

    /* ========================================================
       FASE 4: INTERATIVIDADE SHOWROOM (ANIMAÇÕES PROFISSIONAIS)
       ======================================================== */
    const thumbItems = document.querySelectorAll(".thumb-item");
    const mainImg = document.getElementById("showroom-main-img");
    const titleEl = document.getElementById("showroom-title");
    const descEl = document.getElementById("showroom-desc");

    let isAnimating = false;
    let titleSplit = null;

    // Bordas verticais da descrição: 0% -> 100% de altura
    function infoLinesTween(target) {
        const entering = target === 1;
        return gsap.to(".info-line", {
            [infoAxis()]: target,
            duration: entering ? 0.7 : 0.2,
            ease: entering ? "power3.out" : "power2.in",
            stagger: entering ? 0.14 : 0.04,
            transformOrigin: "center",
            overwrite: true
        });
    }

    // Título com SplitText: letra por letra surgindo de baixo para cima
    function animateTitle(text) {
        const targetText = typeof text === "string" ? text : titleEl.textContent;

        if (titleSplit) {
            titleSplit.revert();
            titleSplit = null;
        }

        titleEl.textContent = targetText;
        gsap.set(titleEl, { opacity: 1, y: 0, clearProps: "transform,opacity" });

        titleSplit = new SplitText(titleEl, { type: "chars" });
        gsap.set(titleSplit.chars, { yPercent: 120, opacity: 0, force3D: true });

        return gsap.to(titleSplit.chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.04,
            ease: "power4.out"
        });
    }

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

            // 4. Timeline principal da troca (saída -> swap -> entrada)
            const changeTl = gsap.timeline({
                onComplete: () => {
                    isAnimating = false;
                }
            });

            changeTl
                // SAÍDA: recolhe elementos atuais (título, imagem, descrição e bordas)
                .to(titleEl, { opacity: 0, y: -12, duration: 0.22, ease: "power2.in" }, 0)
                .to([mainImg, descEl], { opacity: 0, y: -8, duration: 0.22, stagger: 0.03, ease: "power2.in" }, 0)
                .add(() => infoLinesTween(0), 0)

                // TROCA: atualiza fontes de dados via JavaScript
                .add(() => {
                    mainImg.src = car.image;
                    descEl.textContent = car.desc;
                }, 0.28)

                // ENTRADA: título letra a letra + imagem + descrição + bordas
                .add(() => animateTitle(car.title), 0.3)
                .fromTo(mainImg,
                    { opacity: 0, x: 45, y: 8, scale: 1.05 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        ease: "power3.out",
                        clearProps: "transform,opacity" // Evita perda de qualidade/borrão na imagem
                    },
                    0.38
                )
                .fromTo(descEl,
                    { opacity: 0, y: 22 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                        clearProps: "transform,opacity"
                    },
                    0.55
                )
                .add(() => infoLinesTween(1), 0.62);
        });
    });
});