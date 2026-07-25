// ─── All 7 Insurance Claim Categories ────────────────────────────────────
// Each category has tailored chapters with seed questions.
// The LLM generates the actual conversational questions;
// seed questions serve as fallbacks if the API is unavailable.

import type { ClaimCategory, ClaimCategorySlug } from './types';

export const CLAIM_CATEGORIES: ClaimCategory[] = [
  // ═══════════════════════════════════════════════════════════════
  //  1. HOMEOWNERS INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'homeowners',
    name: "Homeowners Insurance",
    description: "Property damage, theft, liability, or loss of use at your home",
    icon: "Home",
    chapters: [
      {
        id: 'safety-first',
        title: 'Safety First',
        subtitle: 'Making sure everyone is OK',
        seedQuestions: [
          'First and most important — is everyone safe? Are you, your family, and any pets all accounted for and uninjured?',
          'Is the home structurally safe to be in right now, or do you need to stay somewhere else tonight?',
          'Do you have everything you need right now — a safe place to stay, medications, essentials?',
        ],
      },
      {
        id: 'what-happened',
        title: 'What Happened',
        subtitle: 'Tell me about the incident in your own words',
        seedQuestions: [
          'Take your time and tell me everything that happened, from the beginning. There is no rush at all.',
          'What date and time did this happen, or when did you first discover the damage?',
          'Where exactly on the property did this occur?',
        ],
      },
      {
        id: 'the-damage',
        title: 'The Damage',
        subtitle: 'Understanding what was affected',
        seedQuestions: [
          'Can you walk me through what areas of the home and what belongings were damaged or destroyed?',
          'Do you have a sense of how extensive the damage is — is it limited to one area, or does it spread through the home?',
          'Were any items particularly valuable, sentimental, or irreplaceable?',
        ],
      },
      {
        id: 'circumstances',
        title: 'The Circumstances',
        subtitle: 'Weather, conditions, and context',
        seedQuestions: [
          'What were the weather conditions like at the time — was there a storm, heavy rain, high winds?',
          'Was anyone else home or on the property when this happened?',
          'Had you noticed any problems in that area before — any warning signs, previous issues, or recent repairs?',
        ],
      },
      {
        id: 'immediate-response',
        title: 'What You Did Next',
        subtitle: 'Actions taken after the incident',
        seedQuestions: [
          'What did you do right after it happened — did you call anyone, try to contain the damage, or take any other immediate action?',
          'Has any emergency or temporary repair work been done so far — like tarping a roof, boarding up windows, or water extraction?',
          'Are you currently staying at the home, or have you had to relocate temporarily?',
        ],
      },
      {
        id: 'evidence',
        title: 'Documentation',
        subtitle: 'Photos, reports, and records',
        seedQuestions: [
          'Were you able to take any photos or video of the damage?',
          'Was a police report, fire department report, or any other official report filed?',
          'Do you have any receipts, appraisals, or records for the items that were damaged?',
        ],
      },
      {
        id: 'financial-impact',
        title: 'Financial Impact',
        subtitle: 'Costs and expenses so far',
        seedQuestions: [
          'Have you had any out-of-pocket expenses so far — hotel stays, emergency repairs, replacing essentials?',
          'Do you have a rough idea of what the damage might cost to repair or replace?',
          'Are there any ongoing expenses you expect — like temporary housing or storage?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Last questions and anything we may have missed',
        seedQuestions: [
          'Have you had any previous insurance claims on this property or with this policy?',
          'Is there anything else you think I should know about what happened, or anything that did not come up yet?',
          'Since we started talking, has anything else come to mind that you did not mention at first?',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  2. AUTO INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'auto',
    name: "Auto Insurance",
    description: "Vehicle accidents, theft, weather damage, or other auto-related claims",
    icon: "Car",
    chapters: [
      {
        id: 'safety-first',
        title: 'Safety First',
        subtitle: 'Making sure everyone is OK',
        seedQuestions: [
          'First and foremost — are you OK? Is anyone hurt?',
          'Were there any passengers in your vehicle, and are they all right?',
          'Was anyone in the other vehicle or anyone nearby injured? Did an ambulance come to the scene?',
        ],
      },
      {
        id: 'what-happened',
        title: 'What Happened',
        subtitle: 'Tell me about the accident in your own words',
        seedQuestions: [
          'Take a deep breath and tell me everything that happened, from the beginning. Just say it however it comes to you.',
          'What day and time did this happen?',
          'Where exactly did the accident occur — do you know the intersection, street, or landmark?',
        ],
      },
      {
        id: 'the-details',
        title: 'The Details',
        subtitle: 'Direction, speed, lanes, and conditions',
        seedQuestions: [
          'What direction were you traveling, and which lane were you in?',
          'What were the weather and road conditions like — clear, rain, snow, ice, fog?',
          'What were the lighting conditions — daylight, dusk, nighttime, were the streetlights on?',
        ],
      },
      {
        id: 'other-people',
        title: 'Other People Involved',
        subtitle: 'Other drivers, passengers, and witnesses',
        seedQuestions: [
          'Can you tell me about the other vehicle — the make, color, and roughly what year it looked like?',
          'Did you exchange information with the other driver — name, phone number, insurance?',
          'Were there any witnesses who saw what happened? Did anyone stop to help or give a statement?',
        ],
      },
      {
        id: 'injuries',
        title: 'Injuries and Medical',
        subtitle: 'How everyone is feeling physically',
        seedQuestions: [
          'Are you experiencing any pain or discomfort right now — even something that seems minor?',
          'Did you or anyone else go to the hospital, see a doctor, or get checked out after the accident?',
          'Have you had any previous injuries to the same areas that are bothering you now?',
        ],
      },
      {
        id: 'vehicle-damage',
        title: 'Your Vehicle',
        subtitle: 'The damage to your car and what happened to it',
        seedQuestions: [
          'Can you describe the damage to your vehicle — which parts were hit, and how bad does it look?',
          'Where on your car was the point of impact — front, rear, driver side, passenger side?',
          'Was your vehicle drivable after the accident, or did it need to be towed? If towed, do you know where it was taken?',
        ],
      },
      {
        id: 'police-and-evidence',
        title: 'Police and Evidence',
        subtitle: 'Reports, photos, and documentation',
        seedQuestions: [
          'Did the police come to the scene? Do you have a report number or the officer\'s name?',
          'Were you able to take any photos of the scene, the vehicles, or anything else?',
          'Do you have a dashcam in your vehicle that might have recorded what happened?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Financial impact and anything we may have missed',
        seedQuestions: [
          'Have you had any expenses so far — towing, rental car, medical bills, or anything else?',
          'Have you had any previous accidents or claims on this vehicle or policy?',
          'Is there anything else you think I should know, or anything that has come to mind since we started talking?',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  3. HEALTH / MEDICAL INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'health',
    name: "Health Insurance",
    description: "Medical treatments, hospital visits, prescriptions, or procedures",
    icon: "HeartPulse",
    chapters: [
      {
        id: 'your-situation',
        title: 'Your Situation',
        subtitle: 'Understanding what brought you here',
        seedQuestions: [
          'I want to help make sure your claim goes smoothly. Can you start by telling me what medical service or treatment this claim is about?',
          'When did this happen or when did you receive the service?',
          'How are you feeling now?',
        ],
      },
      {
        id: 'the-treatment',
        title: 'The Treatment',
        subtitle: 'Details about the medical care received',
        seedQuestions: [
          'What type of medical care did you receive — was it an emergency room visit, a scheduled procedure, a doctor appointment, or something else?',
          'What was the reason for the visit or the diagnosis you were given?',
          'Where did you receive treatment — which hospital, clinic, or doctor\'s office?',
        ],
      },
      {
        id: 'providers',
        title: 'Your Providers',
        subtitle: 'Doctors, hospitals, and facilities involved',
        seedQuestions: [
          'Can you tell me the name of the doctor or facility where you received treatment?',
          'Were you referred by another doctor, or did you go directly?',
          'Is the provider you visited in your insurance network, or are you unsure?',
        ],
      },
      {
        id: 'coverage',
        title: 'Coverage Details',
        subtitle: 'Understanding your insurance plan',
        seedQuestions: [
          'Do you have your insurance member ID or policy number handy?',
          'Were you told you needed a pre-authorization or referral before this service?',
          'Was this related to an accident or injury — like a car accident or a workplace incident?',
        ],
      },
      {
        id: 'financial',
        title: 'Billing and Costs',
        subtitle: 'What you have been charged or paid',
        seedQuestions: [
          'Have you received any bills for this treatment yet? Do you know the amount?',
          'Did you pay anything out of pocket at the time of service — a copay, deductible, or coinsurance?',
          'Have you been told to expect any additional charges or follow-up visits?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Additional information and next steps',
        seedQuestions: [
          'Is this the first time you are seeking treatment for this condition, or have you been treated for it before?',
          'Do you have any other insurance coverage that might apply to this claim?',
          'Is there anything else you think I should know about this claim?',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  4. WORKERS' COMPENSATION
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'workers-comp',
    name: "Workers' Compensation",
    description: "Workplace injuries, occupational illness, or work-related conditions",
    icon: "HardHat",
    chapters: [
      {
        id: 'safety-first',
        title: 'Safety First',
        subtitle: 'Making sure you are OK',
        seedQuestions: [
          'First of all — how are you doing right now? Are you in pain or needing medical attention?',
          'Has anyone from your workplace checked in on you since the incident?',
          'Do you feel safe continuing to work, or do you have concerns about going back?',
        ],
      },
      {
        id: 'what-happened',
        title: 'The Workplace Incident',
        subtitle: 'Tell me what happened at work',
        seedQuestions: [
          'In your own words, can you tell me what happened? Take your time — there is no rush.',
          'What were you doing at work when the injury occurred? What is your job and what were your tasks that day?',
          'What date and time did the incident happen, and where exactly in the workplace did it occur?',
        ],
      },
      {
        id: 'the-injury',
        title: 'Your Injury',
        subtitle: 'Understanding what hurts and how',
        seedQuestions: [
          'Can you describe the injury — what part of your body is affected and what does it feel like?',
          'Did the injury happen suddenly, or has it been building up over time from repetitive work?',
          'Had you ever had a similar problem with that part of your body before this incident?',
        ],
      },
      {
        id: 'medical-treatment',
        title: 'Medical Treatment',
        subtitle: 'Care you have received so far',
        seedQuestions: [
          'Have you seen a doctor or been to a hospital for this injury? If so, where and when?',
          'What did the doctor say about your injury — any diagnosis, tests, or treatment plan?',
          'Are you currently taking any medication or going to physical therapy for this?',
        ],
      },
      {
        id: 'work-impact',
        title: 'Impact on Your Work',
        subtitle: 'How this has affected your job and income',
        seedQuestions: [
          'Have you missed any time from work because of this injury? If so, how much?',
          'Has your employer given you any modified or light-duty work while you recover?',
          'Has this affected your earnings — are you losing wages or using sick leave or PTO?',
        ],
      },
      {
        id: 'witnesses',
        title: 'Witnesses and Reporting',
        subtitle: 'Who saw what happened and how it was reported',
        seedQuestions: [
          'Were there any coworkers or other people who saw the incident happen?',
          'Did you report the injury to your supervisor or HR department? When and how?',
          'Was an incident report or first report of injury completed by your employer?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Prior history and final details',
        seedQuestions: [
          'Have you ever had a previous workers\' compensation claim, either with this employer or a different one?',
          'Were you wearing all the necessary safety equipment at the time of the incident?',
          'Is there anything else you think I should know — anything that has come to mind since we started talking?',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  5. DISABILITY INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'disability',
    name: "Disability Insurance",
    description: "Short-term or long-term disability preventing you from working",
    icon: "Accessibility",
    chapters: [
      {
        id: 'your-situation',
        title: 'Your Situation',
        subtitle: 'Understanding what you are going through',
        seedQuestions: [
          'I appreciate you taking the time to do this. Can you tell me a bit about your situation and what has been going on?',
          'What condition or illness is preventing you from working right now?',
          'How are you feeling today?',
        ],
      },
      {
        id: 'the-condition',
        title: 'Your Condition',
        subtitle: 'Understanding the medical details',
        seedQuestions: [
          'When did you first start noticing symptoms, and when did they become serious enough that you could not work?',
          'What specific limitations are you experiencing — what things can you no longer do that you could do before?',
          'Is your condition expected to improve with treatment, or is it likely to be long-term?',
        ],
      },
      {
        id: 'work-impact',
        title: 'Your Work',
        subtitle: 'How this affects your job and career',
        seedQuestions: [
          'What is your job title, and can you describe the main duties you normally perform?',
          'What was your last day of work, and have you been able to work at all since then — even part-time or light duty?',
          'Has your employer been supportive, and is your position being held for you?',
        ],
      },
      {
        id: 'medical-treatment',
        title: 'Medical Care',
        subtitle: 'Doctors, treatments, and your care team',
        seedQuestions: [
          'Who are the doctors or specialists you are currently seeing for this condition?',
          'What treatments have you received so far — medications, physical therapy, surgery, or other treatments?',
          'What is your doctor\'s outlook on your ability to return to work?',
        ],
      },
      {
        id: 'financial-impact',
        title: 'Financial Impact',
        subtitle: 'Income, benefits, and expenses',
        seedQuestions: [
          'What is your current monthly income, and how much are you losing by not being able to work?',
          'Are you receiving any other benefits — Social Security disability, state disability, sick leave, or short-term disability?',
          'Have you applied for Social Security disability benefits?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Prior history and final details',
        seedQuestions: [
          'Have you ever filed a disability claim before, either under this policy or a different one?',
          'Do you have any pre-existing conditions that are contributing to your current disability?',
          'Is there anything else you think I should know, or anything that has come to mind while we have been talking?',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  6. LIFE INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'life',
    name: "Life Insurance",
    description: "Filing a claim for the loss of a loved one",
    icon: "ShieldCheck",
    chapters: [
      {
        id: 'our-condolences',
        title: 'Our Condolences',
        subtitle: 'We are sorry for your loss',
        seedQuestions: [
          'I am truly sorry for your loss. I know this is a difficult time, and I appreciate your patience. We are going to take this one step at a time.',
          'Is this a good time for you to go through this, or would you prefer to do it another day?',
          'Is there a family member or friend who is with you who can help?',
        ],
      },
      {
        id: 'the-insured',
        title: 'About the Insured',
        subtitle: 'Information about the person who passed',
        seedQuestions: [
          'Can you tell me the full legal name of the person who passed away, as it appears on the policy?',
          'What was their date of birth?',
          'What was their address at the time of passing?',
        ],
      },
      {
        id: 'the-circumstances',
        title: 'The Circumstances',
        subtitle: 'Understanding what happened',
        seedQuestions: [
          'What was the date of passing?',
          'What was the cause, as stated on the death certificate?',
          'Where did the passing occur — at home, in a hospital, or another location?',
        ],
      },
      {
        id: 'beneficiary',
        title: 'Beneficiary Information',
        subtitle: 'Who the policy was meant to benefit',
        seedQuestions: [
          'What is your relationship to the person who passed away?',
          'Are you the named beneficiary on the policy, or is there someone else?',
          'Are there any other beneficiaries listed, and are they all living?',
        ],
      },
      {
        id: 'documentation',
        title: 'Documentation',
        subtitle: 'What we will need to process the claim',
        seedQuestions: [
          'Do you have a certified copy of the death certificate available?',
          'Do you have the original policy document, or do you know the policy number?',
          'Has an autopsy been performed, if applicable?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Final details and next steps',
        seedQuestions: [
          'Was the person who passed under the care of a physician at the time?',
          'Are there any legal matters, such as an estate proceeding, that we should be aware of?',
          'Is there anything else you would like to share or ask before we wrap up?',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  //  7. COMMERCIAL / BUSINESS INSURANCE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'commercial',
    name: "Commercial Insurance",
    description: "Business property damage, liability, professional errors, or business interruption",
    icon: "Building2",
    chapters: [
      {
        id: 'safety-first',
        title: 'Safety First',
        subtitle: 'Making sure everyone is safe',
        seedQuestions: [
          'First — is everyone safe? Were any employees, customers, or visitors injured?',
          'Is the business location currently safe to occupy?',
          'Has the incident been contained, or is there an ongoing risk?',
        ],
      },
      {
        id: 'what-happened',
        title: 'The Incident',
        subtitle: 'Tell me what happened at the business',
        seedQuestions: [
          'Take your time and tell me everything that happened, from the beginning.',
          'What date and time did this occur, and where exactly on the business premises?',
          'Was the business open and operating at the time, or was it closed?',
        ],
      },
      {
        id: 'people-involved',
        title: 'People Involved',
        subtitle: 'Employees, customers, contractors, and others',
        seedQuestions: [
          'Were any employees, customers, contractors, or other third parties involved in the incident?',
          'Can you provide names and contact information for anyone who was involved or witnessed what happened?',
          'Has anyone made a demand or filed a complaint related to this incident?',
        ],
      },
      {
        id: 'damage-assessment',
        title: 'Damage and Loss',
        subtitle: 'What was affected — property, inventory, equipment',
        seedQuestions: [
          'What property, equipment, inventory, or other business assets were damaged or destroyed?',
          'Do you have an estimate of the financial value of the damage?',
          'Have any emergency or temporary repairs been made to prevent further loss?',
        ],
      },
      {
        id: 'business-impact',
        title: 'Business Impact',
        subtitle: 'How this affects your operations and revenue',
        seedQuestions: [
          'Has the business been able to continue operating, or has it been interrupted?',
          'What is the expected period of closure or reduced operations?',
          'Have you incurred any additional expenses to keep the business running — temporary location, expedited shipping, overtime?',
        ],
      },
      {
        id: 'evidence',
        title: 'Documentation and Evidence',
        subtitle: 'Reports, photos, contracts, and financial records',
        seedQuestions: [
          'Have any police reports, incident reports, or fire department reports been filed?',
          'Do you have photos, video, or surveillance footage of the incident or the damage?',
          'Are there any contracts, invoices, or financial records that are relevant to this claim?',
        ],
      },
      {
        id: 'final-details',
        title: 'Anything Else?',
        subtitle: 'Prior history and final details',
        seedQuestions: [
          'Has the business filed any previous claims under this or any other insurance policy?',
          'Is there any litigation, attorney involvement, or third-party subrogation related to this incident?',
          'Is there anything else you think I should know, or anything that has come to mind since we started talking?',
        ],
      },
    ],
  },
];

export function getCategory(slug: ClaimCategorySlug): ClaimCategory {
  const cat = CLAIM_CATEGORIES.find(c => c.slug === slug);
  if (!cat) throw new Error(`Unknown claim category: ${slug}`);
  return cat;
}

export function getChapter(categorySlug: ClaimCategorySlug, chapterId: string) {
  const cat = getCategory(categorySlug);
  const ch = cat.chapters.find(c => c.id === chapterId);
  if (!ch) throw new Error(`Unknown chapter ${chapterId} in ${categorySlug}`);
  return ch;
}