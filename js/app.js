/**
 * BOXING BEHAVIOR COACHING - INTERACTIVE CLIENT SCRIPT
 * Tailored for Women & Kids
 */

document.addEventListener('DOMContentLoaded', () => {
  const BUSINESS_EMAIL = 'coach@boxingbehavior.com';

  // --- Element References ---
  const triggerConsultationBtn = document.getElementById('btn-trigger-questionnaire');
  const questionnaireSection = document.getElementById('consultation-questionnaire-section');
  const clientNameInput = document.getElementById('client-name');
  const intakeForm = document.getElementById('retro-intake-form');

  // Scale (1 to 10)
  const scaleButtons = document.querySelectorAll('.scale-digit-btn');
  const scaleHiddenInput = document.getElementById('readiness-scale-val');
  const scaleFeedbackText = document.getElementById('scale-feedback-text');

  // Other checkbox
  const otherCheckbox = document.getElementById('challenge-other-cb');
  const otherFieldWrap = document.getElementById('other-field-wrap');
  const otherInput = document.getElementById('other-challenge-input');

  // Modal elements
  const modal = document.getElementById('retro-modal');
  const modalCloseBtn = document.getElementById('modal-close-x');
  const emailPreviewArea = document.getElementById('email-preview-area');
  const openEmailClientBtn = document.getElementById('btn-open-email-client');
  const copyQuestionnaireBtn = document.getElementById('btn-copy-questionnaire');
  const retroToast = document.getElementById('retro-toast');

  let currentCompiledBody = '';
  let currentMailtoHref = '';

  // --- 1. Consultation Trigger Button Smooth Transition ---
  if (triggerConsultationBtn && questionnaireSection) {
    triggerConsultationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      questionnaireSection.scrollIntoView({ behavior: 'smooth' });

      // Flash highlight the questionnaire card
      const paperCard = questionnaireSection.querySelector('.intake-paper-card');
      if (paperCard) {
        paperCard.style.outline = '3px solid var(--accent-terracotta)';
        setTimeout(() => {
          paperCard.style.outline = '';
          clientNameInput?.focus();
        }, 1200);
      }
      showToast('Please complete the strategy consultation questionnaire below.');
    });
  }

  // --- 2. Interactive Readiness Scale (1 to 10) ---
  const readinessMessages = {
    1: 'Level 1: Exploring options and learning more',
    2: 'Level 2: Early consideration',
    3: 'Level 3: Contemplating new habits and routines',
    4: 'Level 4: Open to professional guidance and structure',
    5: 'Level 5: Ready to carve out dedicated weekly time',
    6: 'Level 6: Motivated to develop skills and consistency',
    7: 'Level 7: Committed to measurable health and endurance progress',
    8: 'Level 8: Highly focused and eager to train',
    9: 'Level 9: Exceptionally dedicated to lasting habit change',
    10: 'Level 10: Fully committed to systematic transformation'
  };

  scaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      scaleButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      if (scaleHiddenInput) {
        scaleHiddenInput.value = val;
      }

      if (scaleFeedbackText) {
        scaleFeedbackText.textContent = readinessMessages[val] || `Level ${val}: Ready to train!`;
      }
    });
  });

  // --- 3. "Other" Challenge Checkbox Toggle ---
  if (otherCheckbox && otherFieldWrap) {
    otherCheckbox.addEventListener('change', () => {
      if (otherCheckbox.checked) {
        otherFieldWrap.classList.add('visible');
        otherInput?.focus();
      } else {
        otherFieldWrap.classList.remove('visible');
        if (otherInput) otherInput.value = '';
      }
    });
  }

  // --- 4. Intake Form Submission to Business Email ---
  if (intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name')?.value.trim();
      const email = document.getElementById('client-email')?.value.trim();
      const experience = document.querySelector('input[name="experience_level"]:checked')?.value || 'Beginner (No experience)';
      const workedWithCoach = document.querySelector('input[name="worked_with_coach"]:checked')?.value || 'No';
      const pastCoachDesc = document.getElementById('past-coach-desc')?.value.trim() || 'None provided';

      // Selected Challenges
      const checkedChallenges = Array.from(document.querySelectorAll('input[name="challenges"]:checked'))
        .map(cb => {
          if (cb.value === 'Other' && otherInput?.value.trim()) {
            return `Other: ${otherInput.value.trim()}`;
          }
          return cb.value;
        });

      const specificGoals = document.getElementById('specific-goals')?.value.trim();
      const readiness = scaleHiddenInput?.value || '10';
      const dedicationTime = document.querySelector('input[name="time_dedication"]:checked')?.value || '2–3 hours / week';
      const additionalNotes = document.getElementById('additional-details')?.value.trim() || 'None';
      const physicalLimitations = document.getElementById('physical-limitations')?.value.trim() || 'None reported';

      if (!name || !email || !specificGoals) {
        showToast('Please fill out all required fields marked with an asterisk (*)');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address.');
        return;
      }

      const challengesList = checkedChallenges.length > 0
        ? checkedChallenges.map(c => `  - ${c}`).join('\n')
        : '  - None selected';

      const emailSubject = `Boxing Behavior Coaching Strategy Consultation — ${name}`;

      const emailBody = `BOXING BEHAVIOR COACHING — STRATEGY CONSULTATION REQUEST
=================================================================
FOR: Women (30s-50s) & Girls (5-17) Boxing & Behavioral Conditioning
=================================================================

SECTION 1: CONTACT INFORMATION
-----------------------------------------------------------------
Full Name: ${name}
Email Address: ${email}
Contact Channel: Direct Email (${BUSINESS_EMAIL})

SECTION 2: BACKGROUND & EXPERIENCE
-----------------------------------------------------------------
Boxing / Combat Sports Experience: ${experience}
Worked with a Mindset/Behavior Coach Before: ${workedWithCoach}
Past Coaching Experience:
${pastCoachDesc}

SECTION 3: GOALS & MINDSET
-----------------------------------------------------------------
Primary Fitness, Wellness & Health Challenges:
${challengesList}

Specific Goals Hoped to Achieve:
${specificGoals}

Readiness to Make Changes (1-10): ${readiness}/10 (${readinessMessages[readiness] || ''})

SECTION 4: LOGISTICS & AVAILABILITY
-----------------------------------------------------------------
Dedicated Time Per Week: ${dedicationTime}

SECTION 5: ADDITIONAL DETAILS
-----------------------------------------------------------------
Additional Details or Questions:
${additionalNotes}

Physical Limitations / Safety Notes:
${physicalLimitations}
=================================================================
Target Business Email: ${BUSINESS_EMAIL}
Sent via Boxing Behavior Coaching Consultation Portal`;

      currentCompiledBody = emailBody;
      const mailtoUrl = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      currentMailtoHref = mailtoUrl;

      // Populate Modal Preview
      if (emailPreviewArea) {
        emailPreviewArea.textContent = emailBody;
      }

      if (openEmailClientBtn) {
        openEmailClientBtn.href = currentMailtoHref;
      }

      // Open Modal
      openModal();
    });
  }

  // --- 5. Modal Control & Clipboard Copy ---
  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  copyQuestionnaireBtn?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentCompiledBody);
      } else {
        const ta = document.createElement('textarea');
        ta.value = currentCompiledBody;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('Consultation request copied to clipboard.');
    } catch (err) {
      showToast('Consultation request copied to clipboard.');
    }
  });

  // --- 6. Retro Toast Notification ---
  let toastTimer = null;
  function showToast(msg) {
    if (!retroToast) return;
    retroToast.textContent = msg;
    retroToast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      retroToast.classList.remove('show');
    }, 4000);
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  });

  // --- 7. Mobile Navigation Toggle ---
  const mobileToggleBtn = document.getElementById('nav-mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-active');
      mobileToggleBtn.classList.toggle('is-active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav item link
    navMenu.querySelectorAll('.nav-item-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        mobileToggleBtn.classList.remove('is-active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target) && navMenu.classList.contains('is-active')) {
        navMenu.classList.remove('is-active');
        mobileToggleBtn.classList.remove('is-active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 8. Hero Cinematic Motion Reel (Smooth Image Crossfade) ---
  const heroSlideshow = document.getElementById('hero-slideshow');
  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#hero-slide-dots .slide-dot');
    const progressBar = document.getElementById('slide-progress-bar');
    const toggleBtn = document.getElementById('slideshow-toggle-btn');
    const slideTag = document.getElementById('hero-slide-tag');
    const slideTitle = document.getElementById('hero-slide-title');
    const slideDesc = document.getElementById('hero-slide-desc');
    const slideInfo = document.getElementById('hero-slide-info');

    const SLIDE_DURATION = 5000; // 5 seconds per slide
    const PROGRESS_INTERVAL = 50; // update progress every 50ms
    let currentIndex = 0;
    let isPaused = false;
    let elapsed = 0;
    let progressTimer = null;

    function goToSlide(newIndex) {
      if (newIndex === currentIndex || newIndex < 0 || newIndex >= slides.length) return;

      // Update slide active states
      slides[currentIndex].classList.remove('is-active');
      dots[currentIndex]?.classList.remove('is-active');

      currentIndex = newIndex;

      slides[currentIndex].classList.add('is-active');
      dots[currentIndex]?.classList.add('is-active');

      // Update captions with smooth fade
      const targetSlide = slides[currentIndex];
      const newTag = targetSlide.dataset.tag;
      const newTitle = targetSlide.dataset.title;
      const newDesc = targetSlide.dataset.desc;

      if (slideInfo) {
        slideInfo.classList.add('is-fading');
        setTimeout(() => {
          if (slideTag && newTag) slideTag.textContent = newTag;
          if (slideTitle && newTitle) slideTitle.textContent = newTitle;
          if (slideDesc && newDesc) slideDesc.textContent = newDesc;
          slideInfo.classList.remove('is-fading');
        }, 220);
      }

      // Reset progress
      elapsed = 0;
      if (progressBar) progressBar.style.width = '0%';
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function startTimer() {
      if (progressTimer) clearInterval(progressTimer);
      progressTimer = setInterval(() => {
        if (!isPaused) {
          elapsed += PROGRESS_INTERVAL;
          const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
          if (progressBar) progressBar.style.width = `${pct}%`;

          if (elapsed >= SLIDE_DURATION) {
            nextSlide();
          }
        }
      }, PROGRESS_INTERVAL);
    }

    // Dot click listeners
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        goToSlide(idx);
      });
    });

    // Pause/Resume Button
    if (toggleBtn) {
      const pauseIcon = toggleBtn.querySelector('.icon-pause');
      const playIcon = toggleBtn.querySelector('.icon-play');
      const controlText = toggleBtn.querySelector('.control-text');

      toggleBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        if (isPaused) {
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon) playIcon.style.display = '';
          if (controlText) controlText.textContent = 'PLAY';
          toggleBtn.setAttribute('aria-label', 'Resume slideshow reel');
        } else {
          if (pauseIcon) pauseIcon.style.display = '';
          if (playIcon) playIcon.style.display = 'none';
          if (controlText) controlText.textContent = 'PAUSE';
          toggleBtn.setAttribute('aria-label', 'Pause slideshow reel');
        }
      });
    }

    // Pause on hover over slideshow container
    heroSlideshow.addEventListener('mouseenter', () => { isPaused = true; });
    heroSlideshow.addEventListener('mouseleave', () => {
      if (toggleBtn?.querySelector('.control-text')?.textContent === 'PAUSE') {
        isPaused = false;
      }
    });

    // Initialize timer
    startTimer();
  }
});
