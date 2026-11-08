const fs = require('fs');

const contactPath = 'contact.html';
let content = fs.readFileSync(contactPath, 'utf8');

const startMarker = '<div class="contact-acrylic-box" id="formContainer">';
const endMarker = '<!-- Right: Studio Location in Greenville, SC & Details -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const before = content.substring(0, startIndex + startMarker.length);
// Find the closing </div> of formContainer right before endMarker
const between = content.substring(startIndex + startMarker.length, endIndex);
const after = content.substring(endIndex);

const newPortals = `
            <!-- ================= PORTAL 1: Prospective Client Intake – Women (30s–50s) ================= -->
            <div id="tab-women" class="contact-tab-pane active">
              <span class="tag-label">OFFICIAL CLIENT INTAKE • WOMEN 30s–50s</span>
              <h2 style="font-size: 1.85rem; font-weight: 900; color: #fff; margin-bottom: 8px; text-transform: uppercase;">
                Prospective Client Intake – Women's Program
              </h2>
              <p style="color: var(--text-desc); font-size: 0.94rem; margin-bottom: 24px; line-height: 1.65; border-left: 2px solid var(--yellow-pulse); padding-left: 14px;">
                Thank you for your interest in Boxing Behavior Coaching! Please complete our official Google Intake Form so Dr. Shannon Martinez can review your background, fitness challenges, and goals before your initial session.
              </p>

              <!-- Overview of Intake Areas -->
              <div style="background: rgba(14, 16, 23, 0.75); border: 1px solid var(--glass-border); border-radius: var(--radius-card); padding: 26px; margin-bottom: 26px;">
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--yellow-pulse);">✦</span> What's Covered in This Intake
                </h3>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; color: var(--text-desc); font-size: 0.91rem; line-height: 1.5;">
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--yellow-pulse); font-weight: 900;">✓</span>
                    <span><strong>Contact &amp; Logistics:</strong> Full name, phone, email, and preferred contact method.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--yellow-pulse); font-weight: 900;">✓</span>
                    <span><strong>Training &amp; Fitness History:</strong> Current routine, combat sports experience, and energy levels.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--yellow-pulse); font-weight: 900;">✓</span>
                    <span><strong>Behavioral Goals &amp; Mindset:</strong> Accountability needs, stress relief, and 1-on-1 coaching focus.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--yellow-pulse); font-weight: 900;">✓</span>
                    <span><strong>Health &amp; Customization:</strong> Scheduling preferences in Greenville, SC and any physical limitations.</span>
                  </li>
                </ul>
              </div>

              <!-- Launch Action Button -->
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <a href="https://forms.gle/gcnCnLdye9c2UdEV9" target="_blank" rel="noopener noreferrer" class="btn-start-today" style="width: 100%; text-align: center; font-size: 1rem; padding: 18px 28px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px;">
                  <span>OPEN WOMEN'S INTAKE FORM (GOOGLE FORMS)</span>
                  <span style="font-size: 1.25rem;">↗</span>
                </a>
                <p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; margin: 0;">
                  Opens securely via Google Forms in a new tab • Estimated completion time: 3–5 minutes
                </p>
              </div>
            </div>

            <!-- ================= PORTAL 2: Youth Client Intake – Children (Ages 5–17) ================= -->
            <div id="tab-children" class="contact-tab-pane" style="display: none;">
              <span class="tag-label tag-label-blue">OFFICIAL CLIENT INTAKE • AGES 5–17</span>
              <h2 style="font-size: 1.85rem; font-weight: 900; color: #fff; margin-bottom: 8px; text-transform: uppercase;">
                Youth Client Intake – Boxing Behavior Coaching
              </h2>
              <p style="color: var(--text-desc); font-size: 0.94rem; margin-bottom: 24px; line-height: 1.65; border-left: 2px solid var(--logo-blue); padding-left: 14px;">
                Thank you for your interest in Boxing Behavior Coaching for youth! Please complete our official Google Intake Form so Dr. Martinez can understand your child's background, physical activity, behavioral goals, and mindset.
              </p>

              <!-- Overview of Youth Intake Areas -->
              <div style="background: rgba(14, 16, 23, 0.75); border: 1px solid var(--glass-border); border-radius: var(--radius-card); padding: 26px; margin-bottom: 26px;">
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--logo-blue);">✦</span> What's Covered in the Youth Intake
                </h3>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; color: var(--text-desc); font-size: 0.91rem; line-height: 1.5;">
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-blue); font-weight: 900;">✓</span>
                    <span><strong>Parent &amp; Athlete Info:</strong> Parent/guardian details, child age, and contact preferences.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-blue); font-weight: 900;">✓</span>
                    <span><strong>Athletic &amp; Sports Background:</strong> Current sports, combat sports experience, and readiness.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-blue); font-weight: 900;">✓</span>
                    <span><strong>Behavioral &amp; Focus Goals:</strong> Impulse control, confidence, agility, competition, or social skills.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-blue); font-weight: 900;">✓</span>
                    <span><strong>Logistics &amp; Accommodations:</strong> After-school schedule windows, physical notes, and neurodivergent preferences.</span>
                  </li>
                </ul>
              </div>

              <!-- Launch Action Button -->
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <a href="https://forms.gle/K74inwiYHdUF4YPQ6" target="_blank" rel="noopener noreferrer" class="btn-blue-pill" style="width: 100%; text-align: center; font-size: 1rem; padding: 18px 28px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px;">
                  <span>OPEN YOUTH INTAKE FORM (GOOGLE FORMS)</span>
                  <span style="font-size: 1.25rem;">↗</span>
                </a>
                <p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; margin: 0;">
                  Opens securely via Google Forms in a new tab • Completed by parent or guardian
                </p>
              </div>
            </div>

            <!-- ================= PORTAL 3: Consultative Services & Professional Inquiry ================= -->
            <div id="tab-general" class="contact-tab-pane" style="display: none;">
              <span class="tag-label tag-label-orange">CONSULTATIVE SERVICES • STRATEGY &amp; TROUBLESHOOTING</span>
              <h2 style="font-size: 1.85rem; font-weight: 900; color: #fff; margin-bottom: 8px; text-transform: uppercase;">
                Consultative Services &amp; Strategic Inquiry
              </h2>
              <p style="color: var(--text-desc); font-size: 0.94rem; margin-bottom: 24px; line-height: 1.65; border-left: 2px solid var(--logo-orange); padding-left: 14px;">
                For individuals, parents, coaches, or organizations looking for consultative services to discuss boxing and behavior change strategies, approaches, and troubleshooting.
              </p>

              <!-- Overview of Consultation Focus -->
              <div style="background: rgba(14, 16, 23, 0.75); border: 1px solid var(--glass-border); border-radius: var(--radius-card); padding: 26px; margin-bottom: 26px;">
                <h3 style="font-size: 1.05rem; font-weight: 800; color: #fff; text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
                  <span style="color: var(--logo-orange);">✦</span> Meeting Focus Areas
                </h3>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; color: var(--text-desc); font-size: 0.91rem; line-height: 1.5;">
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-orange); font-weight: 900;">✓</span>
                    <span><strong>Behavioral Habit Architecture:</strong> Translating Applied Behavior Analysis into combat training routines.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-orange); font-weight: 900;">✓</span>
                    <span><strong>Athletic Troubleshooting:</strong> Overcoming performance anxiety, distress tolerance, and habit drift.</span>
                  </li>
                  <li style="display: flex; align-items: flex-start; gap: 10px;">
                    <span style="color: var(--logo-orange); font-weight: 900;">✓</span>
                    <span><strong>Organizational Guidance:</strong> Individualized athlete development roadmaps and coach education.</span>
                  </li>
                </ul>
              </div>

              <!-- Direct Email Action Button -->
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <a href="mailto:info@coachshannonphd.com?subject=Consultative%20Services%20Inquiry%20-%20BOUYA&amp;body=Hi%20Dr.%20Martinez%2C%0A%0AI%20am%20interested%20in%20scheduling%20a%20consultative%20meeting%20regarding%3A%0A%0AName%3A%20%0ARole%20%2F%20Background%3A%20%0APhone%3A%20%0APrimary%20Goals%3A%20%0A" class="btn-orange-pill" style="width: 100%; text-align: center; font-size: 1rem; padding: 18px 28px; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 10px;">
                  <span>EMAIL DR. MARTINEZ DIRECTLY (INFO@COACHSHANNONPHD.COM)</span>
                  <span style="font-size: 1.25rem;">✉</span>
                </a>
                <p style="color: var(--text-muted); font-size: 0.82rem; text-align: center; margin: 0;">
                  Direct Email: info@coachshannonphd.com • Greenville, SC studio &amp; virtual video consultations
                </p>
              </div>
            </div>
          </div>
`;

content = before + '\n' + newPortals + '\n          ' + after;
fs.writeFileSync(contactPath, content, 'utf8');
console.log('Successfully updated contact.html with Google Form intake portals!');
