gsap.from(".video-text h1",{
    y:100,
    delay:.5,
    stagger:.5,
    duration:.5,
    opacity:0,
})

gsap.from(".right-container",{
    x:200,
    opacity:0,
    scrollTrigger:{
        trigger:".right-container",
        scroller:"body",
        start:"top 80%",
        end:"top 50%",
        scrub:1
    }
})

// var main = document.querySelector(".page3");
// var cursor = document.querySelector(".cursor");

// main.addEventListener("mousemove",function(dets){
//     gsap.to(cursor,{
//         x:dets.x,
//         y:dets.y,
//         duration: 0.1
//     })
// })
gsap.from(".textcal",{
    delay:.5,
    opacity:0,
    duration:.5,
})

gsap.from(".imag",{
    x:-200,
    opacity:0,
    stagger:.5,
    duration:1,
    scrollTrigger:{
        trigger:".imag",
        scroller:"body",
        start:"top 60%",
        end:"top 30%",
        scrub:2
    }
})

gsap.from(".donate_rght",{
    x:-200,
    opacity:0,
    delay:1
})

gsap.from(".yeh",{
    opacity:0,
    duration:.5,
    scrollTrigger:{
        trigger:".yeh",
        scroller:"body",
        start:"top 30%",
        end:"top 30%",
        scrub:1
    }
})

gsap.from(".donation_org",{
    x:-100,
    opacity:0,
    duration:.5,
    stagger:1,
    scrollTrigger:{
        trigger:".donation_org",
        scroller:"body",
        start:"top 50%",
        end:"top 30%",
        scrub:1
    }
})

