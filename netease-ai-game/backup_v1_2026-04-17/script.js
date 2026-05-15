const flowSteps = document.querySelectorAll(".flow-step");
const flowPanels = document.querySelectorAll("[data-flow-panel]");

flowSteps.forEach((step) => {
  step.addEventListener("click", () => {
    const target = step.dataset.flow;

    flowSteps.forEach((item) => item.classList.remove("active"));
    flowPanels.forEach((panel) => panel.classList.remove("active"));

    step.classList.add("active");
    document
      .querySelector(`[data-flow-panel="${target}"]`)
      ?.classList.add("active");
  });
});

const personaTabs = document.querySelectorAll(".persona-tab");
const previewCards = document.querySelectorAll("[data-card]");
const reasonCards = document.querySelectorAll("[data-reason]");

personaTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.persona;

    personaTabs.forEach((item) => item.classList.remove("active"));
    previewCards.forEach((item) => item.classList.remove("active"));
    reasonCards.forEach((item) => item.classList.remove("active"));

    tab.classList.add("active");
    document.querySelector(`[data-card="${target}"]`)?.classList.add("active");
    document
      .querySelector(`[data-reason="${target}"]`)
      ?.classList.add("active");
  });
});

const revealTargets = document.querySelectorAll(".section, .overview-stats");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index * 60, 280)}ms`;
  revealObserver.observe(target);
});
