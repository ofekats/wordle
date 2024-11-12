async function triggerConfetti() {
    await confetti({
        particleCount: 500,
        spread: 70,
        origin: { y: 0.6 }
    });
}