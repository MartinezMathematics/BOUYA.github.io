function detectCategory(formId, formTitle, selectedService) {
  let programCategory;
  if (formId === 'intakeFormWomen' || formTitle.toLowerCase().includes('women')) {
    programCategory = "WOMAN'S PROGRAM (AGES 30s–50s)";
  } else if (formId === 'intakeFormYouth' || formTitle.toLowerCase().includes('youth') || formTitle.toLowerCase().includes('children') || formTitle.toLowerCase().includes('kids')) {
    programCategory = "KIDS / YOUTH PROGRAM (AGES 5–17)";
  } else if (formId === 'intakeFormConsultative' || formTitle.toLowerCase().includes('consultative')) {
    programCategory = "CONSULTATIVE SERVICES & STRATEGY";
  } else {
    if (selectedService === 'women') programCategory = "WOMAN'S PROGRAM (AGES 30s–50s)";
    else if (selectedService === 'children') programCategory = "KIDS / YOUTH PROGRAM (AGES 5–17)";
    else if (selectedService === 'consultative') programCategory = "CONSULTATIVE SERVICES & STRATEGY";
    else programCategory = "GENERAL INQUIRY";
  }
  let tag = '[GENERAL INTAKE]';
  if (programCategory.includes('WOMAN')) tag = "[WOMAN'S PROGRAM]";
  else if (programCategory.includes('KIDS') || programCategory.includes('YOUTH')) tag = '[KIDS PROGRAM]';
  else if (programCategory.includes('CONSULTATIVE')) tag = '[CONSULTATIVE SERVICES]';
  return { programCategory, tag };
}

console.log('Test 1 (Women):', detectCategory('intakeFormWomen', 'Prospective Client Intake', ''));
console.log('Test 2 (Kids):', detectCategory('intakeFormYouth', 'Youth Client Intake', ''));
console.log('Test 3 (Consult):', detectCategory('intakeFormConsultative', 'Consultative Services', ''));
console.log('Test 4 (Modal Kids):', detectCategory('', '', 'children'));
console.log('Test 5 (Modal Women):', detectCategory('', '', 'women'));
