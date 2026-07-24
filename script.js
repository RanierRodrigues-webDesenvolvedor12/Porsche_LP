document.addEventListener("DOMContentLoaded", () => {
    // 1. Registra os Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // 2. Define o estado inicial do site
    gsap.set(".main-content", { 
        y: "10vh", 
        scale: 0.98, 
        opacity: 0 
    });
    gsap.set(".btn-secondary", { 
        opacity: 0, 
        y: 60 
    });

    // 3. Prepara os textos para a animação ANTES de iniciar a Timeline
    const splitPreloader = new SplitText(".porsche-text h2", { type: "chars" });
    
    // SplitText do título Hero (Separando por palavras e caracteres)
    const splitHeroTitle = new SplitText(".hero-title", { type: "words,chars" });

    // 4. Cria a Timeline Principal
    const tl = gsap.timeline({
        onComplete: () => {
            // Restaura a rolagem da página quando todas as animações principais finalizarem
            document.body.style.overflowY = "auto";
        }
    });

    /* =========================================
       FASE 1: PRELOADER (Seu código original)
       ========================================= */
    tl.to(".brand-container", {
        opacity: 1,
        duration: 0.5
    })
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

    /* =========================================
       FASE 2: HERO SECTION ANIMATIONS
       ========================================= */
    
    // Revela o Header descendo
    .from(".site-header", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6")

    // Anima as faixas vermelhas (height 0 -> 100%)
    .to(".stripe", {
        height: "100%",
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 0.3 // Uma desce um tiquinho depois da outra
    }, "-=0.8")

    // O carro entra de cima para baixo
    .from(".hero-car", {
        y: "-120vh", // Começa muito acima da tela
        duration: 1.6,
        ease: "power3.out"
    }, "-=0.9") // Sincronizado para descer junto com as faixas

    // Anima o SplitText do Título do Hero (letras subindo reveladas)
    .from(splitHeroTitle.chars, {
        opacity: 0,
        y: 60,
        rotationX: -90, // Efeito 3D sutil
        duration: 0.8,
        stagger: 0.02,
        ease: "back.out(1.5)"
    }, "-=0.8")

    // Revela a descrição e o botão
    .from(".hero-desc", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4")

    .to(".btn-secondary",{
        opacity: 1,
        duration:0.4,
        ease: "power3"
    }, "-=0.1")
});