const experienceItems = document.querySelectorAll(".experience-item");

experienceItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
        const rect = item.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const xPercent = mouseX / rect.width - 0.5;
        const yPercent = mouseY / rect.height - 0.5;

        const maximumTilt = 1;

        const rotateY = xPercent * maximumTilt * 2;
        const rotateX = -yPercent * maximumTilt * 2;

        item.style.transform = `
            perspective(800px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform =
            "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
});

