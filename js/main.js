/**
 * BOUYA BEHAVIOR SOLUTIONS - CORE CLIENT LOGIC
 * Navigation, Interactive Boxing Timer, Audio Synthesizer, Modal Triggers & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroVideoReel();
  initAudioBell();
  initBoxingTimer();
  initConsultationModal();
  initContactForm();
  initContactTabs();
  initQAAccordion();
  initScrollReveal();
});

/* ----------------- Hero Spliced Boxing Video Montage Reel ----------------- */
function initHeroVideoReel() {
  const videoA = document.getElementById('heroVideoA');
  const videoB = document.getElementById('heroVideoB');
  if (!videoA || !videoB) return;

  const reelLabel = document.getElementById('heroReelLabel');
  const reelToggle = document.getElementById('heroReelToggle');
  const reelHud = document.getElementById('heroReelHud');
  const segs = document.querySelectorAll('#heroReelSegments .reel-seg');

  // 5 Spliced Action Cuts (4.2 seconds per cut for high-energy athletic pacing)
  const playlist = [
    { src: 'assets/videos/boxing-clip-1.mp4', label: '01 / PAD WORK & COACHING', start: 0 },
    { src: 'assets/videos/boxing-clip-2.mp4', label: '02 / RING CONDITIONING', start: 0.5 },
    { src: 'assets/videos/boxing-clip-3.mp4', label: '03 / HEAVY BAG ROUNDS', start: 0 },
    { src: 'assets/videos/boxing-clip-4.mp4', label: '04 / COMBINATION DRILLS', start: 0.5 },
    { src: 'assets/videos/boxing-clip-5.mp4', label: '05 / RING FOOTWORK', start: 0 }
  ];

  const CUT_DURATION_MS = 4400;
  let currentIndex = 0;
  let activeVideo = videoA;
  let standbyVideo = videoB;
  let isPaused = false;
  let cutTimer = null;

  function updateHud(idx) {
    segs.forEach((seg, i) => {
      seg.classList.toggle('active', i === idx);
    });
  }

  function preloadClip(videoEl, clipIndex) {
    const item = playlist[clipIndex];
    if (!videoEl.src.endsWith(item.src)) {
      videoEl.src = item.src;
      videoEl.load();
    }
    videoEl.currentTime = item.start || 0;
  }

  function scheduleNextCut() {
    clearTimeout(cutTimer);
    if (isPaused) return;
    cutTimer = setTimeout(() => {
      advanceToClip((currentIndex + 1) % playlist.length);
    }, CUT_DURATION_MS);
  }

  function advanceToClip(nextIndex) {
    clearTimeout(cutTimer);
    currentIndex = nextIndex;
    updateHud(currentIndex);

    // Ensure standby has the target clip ready
    const targetItem = playlist[currentIndex];
    if (!standbyVideo.src.endsWith(targetItem.src)) {
      standbyVideo.src = targetItem.src;
    }
    standbyVideo.currentTime = targetItem.start || 0;

    const playPromise = standbyVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    // Crossfade standby in, active out
    standbyVideo.classList.add('is-active');
    activeVideo.classList.remove('is-active');

    // Swap references
    const prevVideo = activeVideo;
    activeVideo = standbyVideo;
    standbyVideo = prevVideo;

    // After crossfade completes, pause outgoing and preload the following clip
    setTimeout(() => {
      standbyVideo.pause();
      const upcomingIndex = (currentIndex + 1) % playlist.length;
      preloadClip(standbyVideo, upcomingIndex);
    }, 900);

    scheduleNextCut();
  }

  // Initialize first clip on activeVideo and second clip on standbyVideo
  preloadClip(activeVideo, 0);
  preloadClip(standbyVideo, 1);
  updateHud(0);

  const initialPlay = activeVideo.play();
  if (initialPlay !== undefined) {
    initialPlay.then(() => {
      scheduleNextCut();
    }).catch(() => {
      // Autoplay fallback
      scheduleNextCut();
    });
  } else {
    scheduleNextCut();
  }

  // Interactive HUD controls: Pause/Play toggle & direct clip jump
  if (reelToggle) {
    reelToggle.addEventListener('click', () => {
      isPaused = !isPaused;
      if (reelHud) reelHud.classList.toggle('is-paused', isPaused);
      if (isPaused) {
        clearTimeout(cutTimer);
        activeVideo.pause();
      } else {
        activeVideo.play().catch(() => {});
        scheduleNextCut();
      }
    });
  }

  segs.forEach((seg, idx) => {
    seg.addEventListener('click', () => {
      if (idx === currentIndex) return;
      isPaused = false;
      if (reelHud) reelHud.classList.remove('is-paused');
      advanceToClip(idx);
    });
  });
}

/* ----------------- Navigation & Mobile Drawer ----------------- */
function initNavigation() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navTabs = document.getElementById('navTabs');

  if (toggleBtn && navTabs) {
    toggleBtn.addEventListener('click', () => {
      navTabs.classList.toggle('open');
      const isOpen = navTabs.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navTabs.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navTabs.classList.remove('open');
      });
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}

/* ----------------- Web Audio API - Boxing Bell Synthesizer ----------------- */
let audioCtx = null;

function initAudioBell() {
  const playBellBtn = document.getElementById('playBellBtn');
  if (playBellBtn) {
    playBellBtn.addEventListener('click', () => {
      playGymBellSound();
    });
  }
}

function playGymBellSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const freqs = [840, 1680, 2520];
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  } catch (err) {
    console.warn('Audio play restricted or unsupported:', err);
  }
}

/* ----------------- Boxing Round Timer ----------------- */
function initBoxingTimer() {
  const clockEl = document.getElementById('timerClock');
  const roundEl = document.getElementById('roundPill');
  const startBtn = document.getElementById('timerStartBtn');
  const resetBtn = document.getElementById('timerResetBtn');

  if (!clockEl || !startBtn) return;

  const ROUND_DURATION = 180;
  let timeLeft = ROUND_DURATION;
  let currentRound = 1;
  let timerInterval = null;
  let isRunning = false;

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    clockEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (roundEl) {
      roundEl.textContent = `ROUND 0${currentRound}`;
    }
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'RESUME';
      startBtn.classList.remove('active');
    } else {
      playGymBellSound();
      isRunning = true;
      startBtn.textContent = 'PAUSE';
      startBtn.classList.add('active');

      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          playGymBellSound();
          clearInterval(timerInterval);
          isRunning = false;
          currentRound = (currentRound % 12) + 1;
          timeLeft = ROUND_DURATION;
          startBtn.textContent = 'START NEXT';
          updateDisplay();
        }
      }, 1000);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      timeLeft = ROUND_DURATION;
      currentRound = 1;
      startBtn.textContent = 'START ROUND';
      updateDisplay();
    });
  }

  updateDisplay();
}

/* ----------------- Consultation Modal ----------------- */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const openBtns = document.querySelectorAll('[data-open-modal="consultation"]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ----------------- Contact Form Handling & info@coachshannonphd.com Dispatch ----------------- */
function initContactForm() {
  const forms = document.querySelectorAll('.contact-form-handler');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.innerHTML = 'DISPATCHING DOSSIER TO COACH SHANNON...';
        submitBtn.disabled = true;
      }

      const formData = new FormData(form);
      const formTitle = form.querySelector('[name="form_title"]')?.value ||
                        form.closest('.contact-tab-pane')?.querySelector('h2')?.innerText ||
                        form.closest('.modal-acrylic-content')?.querySelector('h3')?.innerText ||
                        'Boxing Behavior Coaching Intake';

      let programCategory = formData.get('program_category');
      if (!programCategory) {
        if (form.id === 'intakeFormWomen' || formTitle.toLowerCase().includes('women')) {
          programCategory = "WOMEN'S PROGRAM";
        } else if (form.id === 'intakeFormYouth' || formTitle.toLowerCase().includes('youth') || formTitle.toLowerCase().includes('children') || formTitle.toLowerCase().includes('kids')) {
          programCategory = "KIDS PROGRAM";
        } else if (form.id === 'intakeFormConsultative' || formTitle.toLowerCase().includes('consultative')) {
          programCategory = "CONSULTATIVE SERVICES & STRATEGY";
        } else {
          const modalService = form.querySelector('#modalService')?.value;
          if (modalService === 'women') {
            programCategory = "WOMEN'S PROGRAM";
          } else if (modalService === 'children') {
            programCategory = "KIDS PROGRAM";
          } else if (modalService === 'consultative') {
            programCategory = "CONSULTATIVE SERVICES & STRATEGY";
          } else {
            programCategory = "GENERAL INQUIRY";
          }
        }
      }

      let programSubjectTag = "[GENERAL INTAKE]";
      if (programCategory.includes("WOMAN")) {
        programSubjectTag = "[WOMAN'S PROGRAM]";
      } else if (programCategory.includes("KIDS") || programCategory.includes("YOUTH")) {
        programSubjectTag = "[KIDS PROGRAM]";
      } else if (programCategory.includes("CONSULTATIVE")) {
        programSubjectTag = "[CONSULTATIVE SERVICES]";
      }

      const clientName = formData.get('full_name') ||
                         formData.get('parent_name') ||
                         formData.get('child_name') ||
                         form.querySelector('#modalName')?.value ||
                         'Valued Athlete';

      const clientEmail = formData.get('email') ||
                          formData.get('parent_email') ||
                          form.querySelector('#modalEmail')?.value ||
                          '';

      const clientPhone = formData.get('phone') ||
                          formData.get('parent_phone') ||
                          'Not provided';

      const timestamp = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      });

      let dossier = `================================================================================\n`;
      dossier += `BOUYA BEHAVIOR SOLUTIONS | ATHLETE INTAKE DOSSIER\n`;
      dossier += `================================================================================\n`;
      dossier += `PROGRAM TYPE     : *** ${programCategory} ***\n`;
      dossier += `Target Recipient : info@coachshannonphd.com\n`;
      dossier += `Form Title       : ${formTitle}\n`;
      dossier += `Submission Time  : ${timestamp}\n`;
      dossier += `--------------------------------------------------------------------------------\n\n`;

      dossier += `[ 1. APPLICANT CONTACT INFORMATION ]\n`;
      dossier += `• Program Category         : ${programCategory}\n`;
      dossier += `• Full Name                : ${clientName}\n`;
      dossier += `• Email Address            : ${clientEmail}\n`;
      dossier += `• Phone Number             : ${clientPhone}\n`;

      const sections = form.querySelectorAll('.form-section-block');
      if (sections.length > 0) {
        sections.forEach((sec, idx) => {
          const heading = sec.querySelector('.form-section-heading')?.innerText || `Section ${idx + 1}`;
          dossier += `\n[ ${heading.toUpperCase()} ]\n`;

          const items = sec.querySelectorAll('.form-group-item');
          items.forEach(item => {
            const rawLabel = item.querySelector('.form-field-label')?.innerText || '';
            const cleanLabel = rawLabel.replace(/\*/g, '').trim();
            if (!cleanLabel) return;

            const textInput = item.querySelector('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, select');
            if (textInput && textInput.value) {
              dossier += `• ${cleanLabel}:\n    ${textInput.value.trim()}\n`;
            }

            const checkedRadio = item.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
              dossier += `• ${cleanLabel}: ${checkedRadio.value}\n`;
            }

            const checkedBoxes = Array.from(item.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            if (checkedBoxes.length > 0) {
              dossier += `• ${cleanLabel}:\n`;
              checkedBoxes.forEach(val => {
                dossier += `    - ${val}\n`;
              });
            }
          });
        });
      } else {
        const modalService = form.querySelector('#modalService')?.value;
        const modalNotes = form.querySelector('#modalNotes')?.value;
        if (modalService) dossier += `• Program of Interest      : ${modalService}\n`;
        if (modalNotes) dossier += `• Personal Goals & Habits  :\n    ${modalNotes}\n`;
      }

      dossier += `\n================================================================================\n`;
      dossier += `CONFIDENTIAL SUBMISSION • BOUYA BEHAVIOR SOLUTIONS LLC • GREENVILLE, SC\n`;
      dossier += `Direct Recipient: Dr. Shannon Martinez, PhD, BCBA-D (info@coachshannonphd.com)\n`;
      dossier += `================================================================================\n`;

      try {
        await fetch('https://formsubmit.co/ajax/info@coachshannonphd.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `${programSubjectTag} New BOUYA Intake: ${clientName}`,
            _replyto: clientEmail,
            _template: 'box',
            recipient: 'info@coachshannonphd.com',
            program_type: programCategory,
            applicant_name: clientName,
            applicant_email: clientEmail,
            applicant_phone: clientPhone,
            submitted_at: timestamp,
            formatted_document: dossier
          })
        });
      } catch (err) {
        console.warn('FormSubmit network dispatch note:', err);
      }

      playGymBellSound();

      const mailtoSubject = encodeURIComponent(`${programSubjectTag} BOUYA Intake: ${clientName}`);
      const mailtoBody = encodeURIComponent(dossier.slice(0, 1600));
      const mailtoLink = `mailto:info@coachshannonphd.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      const textBlob = `data:text/plain;charset=utf-8,` + encodeURIComponent(dossier);
      const fileName = `BOUYA_Intake_${programSubjectTag.replace(/[^a-zA-Z]/g, '')}_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;

      form.innerHTML = `
        <div style="text-align: center; padding: 28px 16px;">
          <div style="width: 56px; height: 56px; background: var(--yellow-pulse); border-radius: var(--radius-sm); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 18px; color: #000;">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div style="margin-bottom: 10px;">
            <span class="tag-label" style="justify-content: center;">${programCategory}</span>
          </div>
          <h3 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 10px; text-transform: uppercase;">
            INTAKE DOSSIER SENT!
          </h3>
          <p style="color: var(--text-desc); font-size: 0.95rem; line-height: 1.6; max-width: 520px; margin: 0 auto 16px;">
            Your information has been packaged into a formatted dossier and sent directly to 
            <strong style="color: var(--yellow-pulse);">info@coachshannonphd.com</strong>.
            Dr. Shannon Martinez will review your profile and reach out to discuss next steps.
          </p>

          <div style="text-align: left; max-width: 640px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--yellow-pulse); text-transform: uppercase; letter-spacing: 1px;">
                Generated Intake Document
              </span>
              <a href="${textBlob}" download="${fileName}" style="font-size: 0.78rem; font-weight: 700; color: #fff; text-decoration: underline;">
                Download File (.txt)
              </a>
            </div>
            <pre class="dossier-preview-box">${escapeHtml(dossier)}</pre>
          </div>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
            <a href="${textBlob}" download="${fileName}" class="btn-start-today">
              DOWNLOAD DOSSIER (.TXT)
            </a>
            <a href="${mailtoLink}" class="btn-explore-outline">
              OPEN IN EMAIL CLIENT
            </a>
          </div>
        </div>
      `;

      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ----------------- Contact Section Smooth Scroll ----------------- */
function initContactTabs() {
  const urlParams = new URLSearchParams(window.location.search);
  const formParam = urlParams.get('form');
  if (formParam) {
    const targetMap = {
      'women': 'intake-women',
      'children': 'intake-children',
      'youth': 'intake-children',
      'general': 'intake-consultative',
      'consultative': 'intake-consultative'
    };
    const targetId = targetMap[formParam];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }
}

/* ----------------- Q&A (FAQ) Accordion ----------------- */
function initQAAccordion() {
  const qaItems = document.querySelectorAll('.qa-item');
  if (!qaItems.length) return;

  qaItems.forEach(item => {
    const trigger = item.querySelector('.qa-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      qaItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.qa-trigger');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isCurrentlyActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ----------------- Smooth Scroll-Reveal ----------------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.focus-cards-trio > div, .pillars-trio-grid > div, .four-links-grid > a, .service-hero-card, .service-dual-card, .qa-item, .coach-acrylic-card, .subpage-acrylic-card'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  targets.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${(index % 3) * 60}ms`;
    observer.observe(el);
  });
}
