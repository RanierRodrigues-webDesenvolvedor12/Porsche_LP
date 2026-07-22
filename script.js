document.addEventListener("DOMContentLoaded", () => {
    // 1. Registra os Plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // 2. Define o estado inicial do site
    gsap.set(".main-content", { 
        y: "10vh", 
        scale: 0.98, 
        opacity: 0 
    });

    // 3. Prepara o texto para a animação ANTES de iniciar a Timeline
    const split = new SplitText(".porsche-text h2", {
        type: "chars"
    });

    // 4. Cria a Timeline
    const tl = gsap.timeline({
        onComplete: () => {
            // Restaura a rolagem da página quando o preloader finalizar
            document.body.style.overflowY = "auto";
        }
    });

    // Passo 1: Revela o container principal suavemente
    tl.to(".brand-container", {
        opacity: 1,
        duration: 0.5
    })
    
    // Passo 2: Animação do Escudo (Aparece e perde o blur)
    .to(".porsche-crest", {
        opacity: 1,
        scale: 1,
        duration: 1.7,
        ease: "power3.out"
    })
    
    // Passo 3: Animação do SplitText (usando tl.from em vez de gsap.from)
    .from(split.chars, {
        y: 250,
        duration: 0.7,
        stagger: 0.09,
        ease: "power3.out"
    }, "-=1.2") // Sincroniza para iniciar um pouco antes do escudo terminar
    
    // Passo 4: Pausa dramática e subida da cortina do preloader
    .to("#preloader", {
        yPercent: -100,
        duration: 1,
        delay: 0.4, 
        ease: "expo.inOut",
        onComplete: () => {
            document.getElementById("preloader").style.display = "none";
        }
    })
    
    // Passo 5: Revela o conteúdo principal do seu site
    .to(".main-content", {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "expo.inOut", // Corrigido de "ease inOut" para "expo.inOut"
        clearProps: "all"
    }, "-=1.0");
});