/**
 * BOUYA BEHAVIOR SOLUTIONS - CORE CLIENT LOGIC
 * Navigation, Interactive Boxing Timer, Audio Synthesizer, Modal Triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAudioBell();
  initBoxingTimer();
  initConsultationModal();
  initContactForm();
  initContactTabs();
  initQAAccordion();
  initProceduralMesh();
  initCardSpotlights();
  initScrollReveal();
});

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

    // Close on link click
    navTabs.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navTabs.classList.remove('open');
      });
    });
  }

  // Highlight active link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Dynamic acrylic glass depth on scroll
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
  // Lazily initialize AudioContext on user interaction
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
    
    // Boxing brass bell dual-tone harmonics
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

  const ROUND_DURATION = 180; // 3 minutes
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
      // Pause
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'RESUME';
      startBtn.classList.remove('active');
    } else {
      // Start
      playGymBellSound();
      isRunning = true;
      startBtn.textContent = 'PAUSE';
      startBtn.classList.add('active');

      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          // Round finished
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
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg> DISPATCHING DOSSIER TO COACH SHANNON...
        `;
        submitBtn.disabled = true;
      }

      // 1. Gather all form values
      const formData = new FormData(form);
      const formTitle = form.querySelector('[name="form_title"]')?.value ||
                        form.closest('.contact-tab-pane')?.querySelector('h2')?.innerText ||
                        form.closest('.modal-acrylic-content')?.querySelector('h3')?.innerText ||
                        'Boxing Behavior Coaching Intake';

      // Detect specific program: Kids Program vs Woman's Program vs Consultative
      let programCategory = formData.get('program_category');
      if (!programCategory) {
        if (form.id === 'intakeFormWomen' || formTitle.toLowerCase().includes('women')) {
          programCategory = "WOMAN'S PROGRAM (AGES 30s–50s)";
        } else if (form.id === 'intakeFormYouth' || formTitle.toLowerCase().includes('youth') || formTitle.toLowerCase().includes('children') || formTitle.toLowerCase().includes('kids')) {
          programCategory = "KIDS / YOUTH PROGRAM (AGES 5–17)";
        } else if (form.id === 'intakeFormConsultative' || formTitle.toLowerCase().includes('consultative')) {
          programCategory = "CONSULTATIVE SERVICES & STRATEGY";
        } else {
          const modalService = form.querySelector('#modalService')?.value;
          if (modalService === 'women') {
            programCategory = "WOMAN'S PROGRAM (AGES 30s–50s)";
          } else if (modalService === 'children') {
            programCategory = "KIDS / YOUTH PROGRAM (AGES 5–17)";
          } else if (modalService === 'consultative') {
            programCategory = "CONSULTATIVE SERVICES & STRATEGY";
          } else {
            programCategory = "GENERAL INQUIRY";
          }
        }
      }

      // Short label for email subject: "[KIDS PROGRAM]" or "[WOMAN'S PROGRAM]"
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

      // 2. Build well-formatted text document (Dossier)
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

      // Iterate through form sections or input groups to capture all answers
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

            // Check input type
            const textInput = item.querySelector('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea, select');
            if (textInput && textInput.value) {
              dossier += `• ${cleanLabel}:\n    ${textInput.value.trim()}\n`;
            }

            // Radio selections
            const checkedRadio = item.querySelector('input[type="radio"]:checked');
            if (checkedRadio) {
              dossier += `• ${cleanLabel}: ${checkedRadio.value}\n`;
            }

            // Checkbox selections
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
        // Fallback for simple modal form
        const modalService = form.querySelector('#modalService')?.value;
        const modalNotes = form.querySelector('#modalNotes')?.value;
        if (modalService) dossier += `• Program of Interest      : ${modalService}\n`;
        if (modalNotes) dossier += `• Personal Goals & Habits  :\n    ${modalNotes}\n`;
      }

      dossier += `\n================================================================================\n`;
      dossier += `CONFIDENTIAL SUBMISSION • BOUYA BEHAVIOR SOLUTIONS LLC • GREENVILLE, SC\n`;
      dossier += `Direct Recipient: Dr. Shannon Martinez, PhD, BCBA-D (info@coachshannonphd.com)\n`;
      dossier += `================================================================================\n`;

      // 3. Dispatch to info@coachshannonphd.com via FormSubmit AJAX
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

      // Play audio notification
      playGymBellSound();

      // 4. Render sleek success state with the formatted document
      const mailtoSubject = encodeURIComponent(`${programSubjectTag} BOUYA Intake: ${clientName}`);
      const mailtoBody = encodeURIComponent(dossier.slice(0, 1600));
      const mailtoLink = `mailto:info@coachshannonphd.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      const textBlob = `data:text/plain;charset=utf-8,` + encodeURIComponent(dossier);
      const fileName = `BOUYA_Intake_${programSubjectTag.replace(/[^a-zA-Z]/g, '')}_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;

      form.innerHTML = `
        <div style="text-align: center; padding: 28px 16px;">
          <div style="width: 64px; height: 64px; background: var(--yellow-pulse); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #000; box-shadow: 0 4px 20px rgba(229, 248, 50, 0.4);">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div style="background: rgba(229, 248, 50, 0.12); border: 1px solid var(--yellow-pulse); border-radius: var(--radius-pill); display: inline-block; padding: 6px 18px; margin-bottom: 14px;">
            <span style="font-size: 0.8rem; font-weight: 900; color: var(--yellow-pulse); letter-spacing: 1.2px; text-transform: uppercase;">
              ${programCategory}
            </span>
          </div>
          <h3 style="font-size: 1.9rem; font-weight: 900; color: #fff; margin-bottom: 10px; letter-spacing: 0.5px; text-transform: uppercase;">
            INTAKE DOSSIER SENT!
          </h3>
          <p style="color: var(--text-desc); font-size: 0.95rem; line-height: 1.6; max-width: 520px; margin: 0 auto 16px;">
            Your information has been packaged into a formatted dossier and sent directly to 
            <strong style="color: var(--yellow-pulse);">info@coachshannonphd.com</strong>.
            Dr. Shannon Martinez will review your profile and reach out to discuss next steps.
          </p>

          <div style="text-align: left; max-width: 640px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 0.76rem; font-weight: 800; color: var(--yellow-pulse); text-transform: uppercase; letter-spacing: 1px;">
                Generated Intake Document
              </span>
              <a href="${textBlob}" download="${fileName}" style="font-size: 0.74rem; font-weight: 800; color: #fff; text-decoration: underline; letter-spacing: 0.5px;">
                Download File (.txt)
              </a>
            </div>
            <pre class="dossier-preview-box">${escapeHtml(dossier)}</pre>
          </div>

          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
            <a href="${textBlob}" download="${fileName}" class="btn-start-today" style="display: inline-block;">
              DOWNLOAD DOSSIER (.TXT)
            </a>
            <a href="${mailtoLink}" class="btn-explore-outline" style="display: inline-block;">
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

/* ----------------- Contact Tab Switching (Women, Children, General) ----------------- */
function initContactTabs() {
  const tabBtns = document.querySelectorAll('.contact-tab-btn');
  const tabPanes = document.querySelectorAll('.contact-tab-pane');

  if (!tabBtns.length || !tabPanes.length) return;

  function switchTab(targetId) {
    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === targetId;
      if (isTarget) {
        btn.classList.add('active');
        if (targetId === 'tab-children') {
          btn.style.background = 'var(--logo-blue)';
          btn.style.color = '#000';
          btn.style.border = '1px solid var(--logo-blue)';
        } else if (targetId === 'tab-general') {
          btn.style.background = 'var(--logo-orange)';
          btn.style.color = '#fff';
          btn.style.border = '1px solid var(--logo-orange)';
        } else {
          btn.style.background = 'var(--yellow-pulse)';
          btn.style.color = '#000';
          btn.style.border = 'none';
        }
      } else {
        btn.classList.remove('active');
        btn.style.background = 'var(--glass-card)';
        btn.style.color = '#fff';
        btn.style.border = '1px solid var(--glass-border)';
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === targetId) {
        pane.style.display = 'block';
        pane.classList.add('active');
      } else {
        pane.style.display = 'none';
        pane.classList.remove('active');
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-tab');
      switchTab(targetId);
    });
  });

  // Support direct linking via URL parameter (e.g. contact.html?form=women or contact.html?form=children)
  const urlParams = new URLSearchParams(window.location.search);
  const formParam = urlParams.get('form');
  if (formParam === 'children') {
    switchTab('tab-children');
  } else if (formParam === 'general' || formParam === 'consultative') {
    switchTab('tab-general');
  } else if (formParam === 'women') {
    switchTab('tab-women');
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

      // Close all other accordion items
      qaItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.qa-trigger');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
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

/* ----------------- Google AI Procedural Interactive Wireframe Mesh ----------------- */
function initProceduralMesh() {
  const canvas = document.getElementById('proceduralMeshCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationId = null;
  let time = 0;

  // Grid dimensions
  const cols = 36;
  const rows = 20;

  // Dynamic ripples triggered by subtle mouse movement
  const ripples = [];
  const maxRipples = 5;

  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    isHovering: false,
    speed: 0,
    lastX: 0,
    lastY: 0
  };

  const container = canvas.closest('.hero-section-full') || canvas.parentElement;

  if (container) {
    container.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - mouse.lastX;
      const dy = currentY - mouse.lastY;
      mouse.speed = Math.hypot(dx, dy);

      mouse.targetX = currentX;
      mouse.targetY = currentY;
      mouse.lastX = currentX;
      mouse.lastY = currentY;
      mouse.isHovering = true;

      // Gentle interactive ripple on cursor motion
      if (mouse.speed > 10 && ripples.length < maxRipples) {
        ripples.push({
          x: currentX,
          y: currentY,
          radius: 8,
          maxRadius: 160,
          strength: Math.min(mouse.speed * 0.12, 10),
          life: 1.0
        });
      }
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
      mouse.isHovering = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    }, { passive: true });
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  function draw() {
    if (document.hidden) {
      animationId = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    if (!prefersReduced) {
      time += 0.018;
    }

    // Update ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += 2.8;
      rip.life -= 0.022;
      if (rip.life <= 0 || rip.radius >= rip.maxRadius) {
        ripples.splice(r, 1);
      }
    }

    // Smooth mouse coordinate damping
    if (mouse.isHovering) {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
    } else {
      mouse.x += (-9999 - mouse.x) * 0.08;
    }

    // Grid coordinates 2D array
    const points = [];
    const horizonY = height * 0.12;
    const bottomY = height * 1.08;

    for (let r = 0; r < rows; r++) {
      points[r] = [];
      const rowNorm = r / (rows - 1); // 0 at top, 1 at bottom

      // Exponential perspective progression
      const perspecProgress = Math.pow(rowNorm, 1.45);
      const baseRowY = horizonY + perspecProgress * (bottomY - horizonY);

      // Extend grid width and start well off-screen to the left to eliminate any visible left boundary
      const rowStartX = -width * 0.35 - rowNorm * (width * 0.20);
      const rowWidth = width * (1.20 + rowNorm * 0.50);
      const rowCellW = rowWidth / (cols - 1);

      for (let c = 0; c < cols; c++) {
        const colNorm = c / (cols - 1);
        const px = rowStartX + c * rowCellW;
        let py = baseRowY;

        // Fluid, organic topological undulation
        const wave1 = Math.sin(colNorm * 5.4 + time * 1.4 + rowNorm * 2.8) * 14;
        const wave2 = Math.cos(rowNorm * 4.2 - time * 0.95 + colNorm * 3.4) * 9;
        let elevation = (wave1 + wave2) * (0.25 + rowNorm * 0.85);

        // Mouse elevation deformation
        if (mouse.isHovering) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            const factor = Math.cos((dist / 180) * (Math.PI / 2));
            elevation += factor * 18;
          }
        }

        // Ripple displacement
        for (let ripIdx = 0; ripIdx < ripples.length; ripIdx++) {
          const rip = ripples[ripIdx];
          const rdx = px - rip.x;
          const rdy = py - rip.y;
          const rdist = Math.hypot(rdx, rdy);
          const waveDist = Math.abs(rdist - rip.radius);
          if (waveDist < 32) {
            const factor = Math.cos((waveDist / 32) * (Math.PI / 2)) * rip.life;
            elevation += factor * rip.strength;
          }
        }

        py -= elevation;

        // Bilateral horizontal fade: soft fade at the left edge, clean fade before the right athlete image
        const xPercent = px / width;
        let leftFade = 1;
        if (xPercent < 0.12) {
          leftFade = Math.max(0, (xPercent + 0.05) / 0.17);
        }
        let rightFade = 1;
        if (xPercent > 0.30) {
          rightFade = Math.max(0, 1 - (xPercent - 0.30) / 0.28);
        }
        const hFade = Math.max(0, Math.min(1, leftFade * rightFade));

        points[r][c] = {
          x: px,
          y: py,
          elevation: elevation,
          rowNorm: rowNorm,
          colNorm: colNorm,
          hFade: hFade
        };
      }
    }

    // Render horizontal perspective mesh lines (Feathered on left, dissolved before right image)
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      const rowNorm = r / (rows - 1);

      for (let c = 0; c < cols; c++) {
        const pt = points[r][c];
        // Stop line path if it reaches the fully dissolved right zone
        if (pt.x > width * 0.65 && pt.hFade <= 0.005) {
          break;
        }
        if (c === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }

      // Smooth horizontal gradient stroke: feathers on left edge, completely disappears before photo
      const maxAlpha = 0.08 + rowNorm * 0.16;
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.08, `rgba(255, 255, 255, ${(maxAlpha * 0.75).toFixed(3)})`);
      grad.addColorStop(0.24, `rgba(255, 255, 255, ${maxAlpha.toFixed(3)})`);
      grad.addColorStop(0.35, `rgba(255, 255, 255, ${(maxAlpha * 0.85).toFixed(3)})`);
      grad.addColorStop(0.48, `rgba(255, 255, 255, ${(maxAlpha * 0.35).toFixed(3)})`);
      grad.addColorStop(0.58, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    // Render vertical perspective mesh lines (Skipped off-screen or over right photo)
    for (let c = 0; c < cols; c++) {
      const colNorm = c / (cols - 1);
      const samplePt = points[rows - 1][c];
      if (!samplePt || samplePt.x < -20 || samplePt.hFade <= 0.01) {
        continue; // Do not draw lines off-screen to the left or over the right photo
      }

      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const pt = points[r][c];
        if (r === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }

      const fade = samplePt ? samplePt.hFade : 1;
      const isYellowCol = (c % 6 === 0);
      const isBlueCol = (c % 6 === 3);
      let colStroke = `rgba(255, 255, 255, ${(0.045 + colNorm * 0.08) * fade})`;
      if (isYellowCol) {
        colStroke = `rgba(229, 248, 50, ${(0.09 + colNorm * 0.12) * fade})`;
      } else if (isBlueCol) {
        colStroke = `rgba(0, 195, 255, ${(0.08 + colNorm * 0.11) * fade})`;
      }

      ctx.strokeStyle = colStroke;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // Subtle accent intersection points (Only within visible feathered boundary)
    for (let r = 1; r < rows; r += 2) {
      for (let c = 1; c < cols; c += 2) {
        const pt = points[r][c];
        if (pt.x < 15 || pt.hFade <= 0.06) continue; // Skip points off the left edge or over right photo

        const mouseDist = mouse.isHovering ? Math.hypot(pt.x - mouse.x, pt.y - mouse.y) : 9999;
        const isNearCursor = mouseDist < 150;
        const isCrest = pt.elevation > 6;

        if (isCrest || isNearCursor || (r % 4 === 0 && c % 4 === 0)) {
          let dotRadius = 1.35;
          let dotAlpha = (0.12 + Math.max(0, pt.elevation * 0.02)) * pt.hFade;
          let dotColor = 'rgba(255, 255, 255, ';

          if (isNearCursor) {
            const factor = 1 - (mouseDist / 150);
            dotRadius += factor * 2.2;
            dotAlpha = Math.min(0.85, 0.25 + factor * 0.6) * pt.hFade;
            dotColor = 'rgba(229, 248, 50, ';
          } else if (isCrest) {
            // Harmonic logo color distribution across wave crests
            if ((r + c) % 5 === 0) {
              dotColor = 'rgba(255, 63, 3, '; // Logo reddish-orange on high energy nodes
              dotAlpha = Math.min(0.55, dotAlpha * 1.5);
            } else if ((r + c) % 3 === 0) {
              dotColor = 'rgba(0, 195, 255, '; // Logo cyan blue
              dotAlpha = Math.min(0.65, dotAlpha * 1.6);
            } else {
              dotColor = 'rgba(229, 248, 50, '; // Signature yellow
              dotAlpha = Math.min(0.70, dotAlpha * 1.6);
            }
          }

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `${dotColor}${dotAlpha.toFixed(2)})`;
          ctx.fill();
        }
      }
    }

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

/* ----------------- Google AI Interactive Card Spotlight ----------------- */
function initCardSpotlights() {
  const cardSelectors = [
    '.focus-card-acrylic',
    '.pillar-acrylic-card',
    '.four-link-acrylic-card',
    '.service-hero-card',
    '.service-acrylic-card',
    '.coach-acrylic-card',
    '.qa-item',
    '.contact-acrylic-box'
  ];

  const cards = document.querySelectorAll(cardSelectors.join(', '));
  if (!cards.length) return;

  cards.forEach(card => {
    card.classList.add('google-card-spotlight');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    }, { passive: true });
  });
}

/* ----------------- Google AI Smooth Scroll-Reveal ----------------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.focus-cards-trio > div, .pillars-trio-grid > div, .four-links-grid > div, .service-hero-card, .qa-item, .coach-acrylic-card, .subpage-acrylic-card'
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
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${(index % 3) * 70}ms`;
    observer.observe(el);
  });
}
