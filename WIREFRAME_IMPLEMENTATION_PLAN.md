# Wireframe Implementation Plan
**Rishta - Matrimonial Biodata App**

## Overview
This document provides a detailed, actionable plan to build the 10 wireframe screens shown in the design. These screens are part of **Phase 2 (Biodata Creation)** and **Phase 3 (Sharing & Privacy)** of the project timeline.

**Total Effort**: ~50-60 hours of development work  
**Timeline**: 2-3 weeks with one developer  
**Tech Stack**: React 18 + TypeScript + Tailwind CSS + Redux

---

## Section 1: Core User Flow (Screens 1-7)

These are the main biodata creation screens accessed after user logs in.

### Screen 1.1: Home/Landing Page
**File**: `src/pages/Home.tsx`

**Purpose**: Welcome page with options to create biodata or view existing one

**Key Components**:
- Hero section with app branding
- Two main CTAs: "Create My Biodata" & "View My Biodata"
- Display existing biodata status (if any)
- Recent activity/shares summary

**Design Elements** (from wireframe):
- Rishta logo at top
- Two large red buttons
- Simple, clean layout
- Mobile-first responsive

**Implementation Steps**:
```
1. Create src/pages/Home.tsx
2. Create src/components/HeroSection.tsx
3. Add routing in src/App.tsx (public route)
4. Style with Tailwind utilities
5. Connect Redux to fetch user's biodata status
```

**Acceptance Criteria**:
- [ ] Page loads without auth errors
- [ ] Buttons navigate to correct pages
- [ ] Responsive on mobile/tablet/desktop
- [ ] Shows "Create" if no biodata exists, "View" if exists
- [ ] Recent activity displayed below

---

### Screen 1.2: OTP Verification (Mobile)
**File**: `src/components/OTPVerify.tsx`

**Purpose**: Phone/Email verification during signup or biodata sharing

**Key Components**:
- OTP input fields (6 digit)
- Resend button with timer
- Submit button
- Cancel/Back option

**Design Elements** (from wireframe):
- Large OTP input boxes
- "Verify Number" button (red)
- Resend option
- Clean mobile-first design

**Implementation Steps**:
```
1. Create src/components/OTPVerify.tsx
2. Create src/utils/otpHelpers.ts (timer logic)
3. Connect to Redux for OTP state
4. API integration for verification endpoint
5. Error handling for wrong OTP
```

**Acceptance Criteria**:
- [ ] 6 input fields focus automatically
- [ ] Resend button disabled until timer expires (60s)
- [ ] Submit validates all fields filled
- [ ] Shows error message for invalid OTP
- [ ] Mobile responsive

---

### Screen 1.3: Step 1 - Personal Details
**File**: `src/pages/BioDataForm/Step1_PersonalDetails.tsx`

**Purpose**: Capture basic personal information

**Form Fields**:
- Full Name (text)
- Date of Birth (date picker)
- Phone Number (tel)
- Email (email)
- Religion (select dropdown)
- Caste (text)
- Height (select)
- Profession (text)
- Education (select)
- Income (select range)

**Design Elements** (from wireframe):
- Step indicator "1 of 7"
- Form fields with labels
- Red "Next" button at bottom
- Back button option
- Input validation messages

**Implementation Steps**:
```
1. Create src/pages/BioDataForm/Step1_PersonalDetails.tsx
2. Create src/components/FormField.tsx (reusable)
3. Create src/components/StepIndicator.tsx
4. Define Redux slice: src/store/bioDataSlice.ts
5. Add form validation schema: src/utils/validation.ts
6. Style with Tailwind
```

**Acceptance Criteria**:
- [ ] All fields render correctly
- [ ] Form data persists in Redux
- [ ] Validation works on blur/submit
- [ ] Next button disabled if validation fails
- [ ] Can navigate back to previous step
- [ ] Mobile responsive

---

### Screen 1.4: Step 2 - Photos
**File**: `src/pages/BioDataForm/Step2_Photos.tsx`

**Purpose**: Upload and manage profile photos

**Key Components**:
- Drag & drop upload area
- Photo preview gallery
- Set profile picture
- Delete photo button
- Upload progress indicator

**Design Elements** (from wireframe):
- Photo upload boxes (placeholder with + icon)
- Gallery of uploaded photos
- "Choose Photos" button option
- Next button

**Implementation Steps**:
```
1. Create src/pages/BioDataForm/Step2_Photos.tsx
2. Create src/components/PhotoUploader.tsx
3. Create src/services/uploadService.ts (S3 integration)
4. Add photo state to Redux bioDataSlice
5. Implement drag-drop functionality
6. Add image preview & cropping (optional: use react-image-crop)
```

**Acceptance Criteria**:
- [ ] Drag & drop upload works
- [ ] File picker fallback works
- [ ] Image validation (size <5MB, type: jpg/png)
- [ ] Preview shows before upload
- [ ] Progress bar shown during upload
- [ ] Can delete photos
- [ ] Can set primary photo
- [ ] Responsive on mobile

---

### Screen 1.5: Step 3 - Family Information
**File**: `src/pages/BioDataForm/Step3_Family.tsx`

**Purpose**: Capture family background information

**Form Fields**:
- Father's Name
- Mother's Name
- Father's Occupation
- Mother's Occupation
- Siblings count
- Siblings details
- Family type (Joint/Nuclear)
- Location/City

**Design Elements** (from wireframe):
- Multiple family member input sections
- "Add Sibling" button
- Checkboxes for family background options
- Step 3 of 7 indicator

**Implementation Steps**:
```
1. Create src/pages/BioDataForm/Step3_Family.tsx
2. Create src/components/FamilyMemberField.tsx
3. Implement dynamic sibling fields (add/remove)
4. Add validation for required family fields
5. Store in Redux bioDataSlice
```

**Acceptance Criteria**:
- [ ] Can add/remove multiple siblings
- [ ] All fields validate
- [ ] Data persists in Redux
- [ ] Mobile responsive
- [ ] Required fields marked with *

---

### Screen 1.6: Step 4 - Horoscope/Kundali
**File**: `src/pages/BioDataForm/Step4_Horoscope.tsx`

**Purpose**: Capture astrological information

**Form Fields**:
- Date of Birth (date picker)
- Birth Time (time picker)
- Birth Place (text/select)
- Rashi (zodiac sign) - auto-calculate or select
- Nakshatra (lunar mansion) - auto-calculate or select
- Gotra (optional)
- Mars Dosha (yes/no toggle)

**Design Elements** (from wireframe):
- Horoscope/kundali icon
- Date/time pickers
- Toggle switches for Mars dosha
- Step 4 of 7 indicator

**Implementation Steps**:
```
1. Create src/pages/BioDataForm/Step4_Horoscope.tsx
2. Create src/utils/astroCalculations.ts (optional: rashi/nakshatra calculation)
3. Create date/time picker components
4. Add horoscope fields to Redux
5. Validation for date/time fields
```

**Acceptance Criteria**:
- [ ] Date picker works on mobile
- [ ] Time picker functional
- [ ] Birth place searchable (optional: autocomplete)
- [ ] Rashi/Nakshatra populate (manual or auto)
- [ ] Data saved to Redux
- [ ] Responsive design

---

### Screen 1.7: Step 5 - Choose Template
**File**: `src/pages/BioDataForm/Step5_ChooseTemplate.tsx`

**Purpose**: Select biodata presentation template

**Key Components**:
- 3-4 template preview cards
- "Traditional" template (default)
- Modern template
- Custom/Premium template
- Preview on selection

**Design Elements** (from wireframe):
- Template preview cards
- Selected template highlighted (red border)
- Template names
- Step 5 of 7 indicator

**Implementation Steps**:
```
1. Create src/pages/BioDataForm/Step5_ChooseTemplate.tsx
2. Create src/components/TemplateCard.tsx
3. Create src/styles/templates/ (CSS for each template design)
4. Store selected template in Redux
5. Preview template before confirming
```

**Acceptance Criteria**:
- [ ] 3+ templates available
- [ ] Can preview before selection
- [ ] Template selection persists
- [ ] Visual indication of selected template
- [ ] Next/Done button enabled after selection

---

### Screen 1.8: Final Step - Review & Submit
**File**: `src/pages/BioDataForm/Step6_Review.tsx`

**Purpose**: Review all information before final submission

**Key Components**:
- Summary of all entered data
- Edit links for each section
- Photo preview
- Confirmation checkbox
- Submit button

**Design Elements** (from wireframe):
- All data displayed in review format
- "Edit" links per section
- Red "Create My Biodata" button
- Step 7 of 7 indicator

**Implementation Steps**:
```
1. Create src/pages/BioDataForm/Step6_Review.tsx
2. Map Redux state to display format
3. "Edit" links navigate back to respective step
4. Submit button calls API endpoint
5. Loading state during submission
6. Success/error handling
```

**Acceptance Criteria**:
- [ ] All biodata displayed correctly
- [ ] Edit links work
- [ ] Submit calls /api/biodata POST
- [ ] Success message shown
- [ ] Redirect to biodata view after success
- [ ] Error handling for failed submission

---

## Section 2: Biodata Output & Sharing (Screens 8-10)

These screens handle biodata viewing, sharing, and privacy controls.

---

### Screen 2.1: Biodata Preview (Traditional Template)
**File**: `src/pages/BioDataPreview.tsx`

**Purpose**: Display user's complete biodata with selected template design

**Key Sections**:
1. Header with profile photo
2. Personal details (name, age, location, profession)
3. Family information
4. Horoscope details
5. Photos gallery
6. Action buttons (Edit, Share, Download)

**Design Elements** (from wireframe):
- Traditional template with structured layout
- Profile photo prominently displayed
- Information organized by category
- "Share" and "Edit" buttons
- Beautiful typography and spacing

**Implementation Steps**:
```
1. Create src/pages/BioDataPreview.tsx
2. Create src/components/TemplateView_Traditional.tsx
3. Fetch biodata from API: GET /api/biodata/:id
4. Map data to template layout
5. Style with Tailwind and custom CSS
6. Add Edit button → navigate to edit form
7. Add Share button → open share modal
```

**Acceptance Criteria**:
- [ ] Biodata fetches on page load
- [ ] All sections display correctly
- [ ] Photos load from S3
- [ ] Edit button enables form editing
- [ ] Share button opens modal
- [ ] Responsive on all devices
- [ ] Download PDF option (optional)

---

### Screen 2.2: Share & Privacy Controls
**File**: `src/pages/SharePrivacySettings.tsx`

**Purpose**: Manage sharing permissions and view share history

**Key Components**:
1. Create New Share (button)
2. Active Shares list
   - Share link/email
   - Permissions granted
   - Expiry date
   - Last accessed date
   - Revoke button
3. Share History/Activity log

**Design Elements** (from wireframe):
- Share creation form (modal)
- Toggles for permissions: view_basic, view_photos, view_horoscope, view_contact
- Share link with copy button
- Email input option
- Expiry date picker
- List of active shares

**Implementation Steps**:
```
1. Create src/pages/SharePrivacySettings.tsx
2. Create src/components/ShareModal.tsx
3. Create src/components/SharePermissionToggle.tsx
4. Fetch active shares: GET /api/shares
5. POST /api/shares for new share
6. DELETE /api/shares/:id to revoke
7. PUT /api/shares/:id to update permissions
8. Copy-to-clipboard for share link
```

**Acceptance Criteria**:
- [ ] List active shares
- [ ] Can create new share (link or email)
- [ ] Permission toggles work
- [ ] Expiry date selectable
- [ ] Copy link to clipboard works
- [ ] Can revoke shares
- [ ] Confirm before revoke
- [ ] Mobile responsive

---

### Screen 2.3: Public Viewer (Recipient's View)
**File**: `src/pages/PublicBioDataView.tsx`

**Purpose**: View shared biodata without login (recipient view)

**Key Components**:
1. Biodata display (limited fields based on permissions)
2. Contact info (if permitted) with contact button
3. Share sender's info (optional)
4. Expiry warning (if close to expiry)

**Design Elements** (from wireframe):
- Clean, readable biodata view
- Contact button prominent
- Information organized by section
- Expiry notice if applicable
- No login required

**Implementation Steps**:
```
1. Create src/pages/PublicBioDataView.tsx (public route)
2. Extract share token from URL: /share/:token
3. API call: GET /api/public/:token
4. Display only permitted fields based on response
5. Hide contact info if not permitted
6. Show expiry warning
7. Add contact/reply button (if email permitted)
```

**Acceptance Criteria**:
- [ ] Accessible without authentication
- [ ] Correct fields displayed based on permissions
- [ ] Contact button visible (if permitted)
- [ ] Error for expired/invalid token
- [ ] Mobile responsive
- [ ] No sensitive data leaks
- [ ] Log access in audit trail

---

## Section 3: Core Components (Reusable)

These components are used across multiple screens.

### Component 1: FormField.tsx
**Purpose**: Reusable form field with validation
- Text input, email, tel, number variants
- Dropdown select
- Checkbox
- Radio group
- Error message display
- Label + asterisk for required fields

**File**: `src/components/FormField.tsx`

### Component 2: StepIndicator.tsx
**Purpose**: Shows current step in multi-step form
**Display**: "Step 1 of 7" with progress bar

**File**: `src/components/StepIndicator.tsx`

### Component 3: Header/Navigation.tsx
**Purpose**: Top navigation bar
- Logo
- Links (Home, Biodata, Shares, Settings, Logout)
- Mobile hamburger menu

**File**: `src/components/Header.tsx`

### Component 4: Modal.tsx
**Purpose**: Reusable modal dialog
- For share, confirm, alert dialogs
- Close button
- Action buttons

**File**: `src/components/Modal.tsx`

### Component 5: PhotoUploader.tsx
**Purpose**: Drag & drop photo upload
- Accepts jpg/png
- File size validation
- Preview before upload
- Progress indicator
- S3 integration

**File**: `src/components/PhotoUploader.tsx`

---

## Section 4: State Management (Redux)

Create a Redux slice to manage form state across steps.

**File**: `src/store/bioDataSlice.ts`

**State Structure**:
```typescript
{
  bioData: {
    personalDetails: {
      fullName: string;
      dob: string;
      phone: string;
      email: string;
      religion: string;
      caste: string;
      height: string;
      profession: string;
      education: string;
      income: string;
    };
    photos: {
      urls: string[];
      primaryPhoto: string;
    };
    family: {
      fatherName: string;
      motherName: string;
      siblings: Array<{name: string; occupation: string}>;
      // ... more fields
    };
    horoscope: {
      dob: string;
      birthTime: string;
      birthPlace: string;
      rashi: string;
      nakshatra: string;
    };
    template: string; // 'traditional', 'modern', etc.
    currentStep: number;
    isLoading: boolean;
    error: string | null;
  }
}
```

**Actions**:
- `updatePersonalDetails()`
- `updatePhotos()`
- `updateFamily()`
- `updateHoroscope()`
- `setTemplate()`
- `setCurrentStep()`
- `resetForm()`

---

## Section 5: API Endpoints Required

Your backend should expose these endpoints:

**Authentication** (already done in Phase 1):
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Biodata Creation**:
- `POST /api/biodata` - Create new biodata
- `GET /api/biodata/:id` - Get specific biodata
- `PUT /api/biodata/:id` - Update biodata
- `GET /api/biodata/user/me` - Get current user's biodata

**Photos**:
- `POST /api/biodata/:id/photos` - Upload photo
- `DELETE /api/biodata/:id/photos/:photoId` - Delete photo

**Sharing**:
- `POST /api/shares` - Create share
- `GET /api/shares` - List user's shares
- `PUT /api/shares/:id` - Update share permissions
- `DELETE /api/shares/:id` - Revoke share
- `GET /api/public/:token` - Access shared biodata (public)

---

## Section 6: Development Tasks (Ordered)

### Phase 1: Setup & Basic Components (6 hours)
```
Task 1: Set up Redux store structure
  - Create src/store/bioDataSlice.ts
  - Add to Redux root store
  Duration: 2 hours

Task 2: Create reusable components
  - FormField.tsx
  - StepIndicator.tsx
  - Modal.tsx
  - Header.tsx
  Duration: 3 hours

Task 3: Set up routing
  - Add React Router setup
  - Create public/private route wrappers
  - Update App.tsx with routes
  Duration: 1 hour
```

### Phase 2: Create Form Steps (25 hours)
```
Task 4: Home page + navigation
  - Home.tsx
  - Header navigation
  Duration: 3 hours

Task 5: Step 1 - Personal Details
  - Step1_PersonalDetails.tsx
  - Form validation
  Duration: 4 hours

Task 6: Step 2 - Photos
  - Step2_Photos.tsx
  - PhotoUploader.tsx
  - S3 integration
  Duration: 6 hours

Task 7: Step 3 - Family
  - Step3_Family.tsx
  - Dynamic sibling fields
  Duration: 3 hours

Task 8: Step 4 - Horoscope
  - Step4_Horoscope.tsx
  - Date/time pickers
  Duration: 3 hours

Task 9: Step 5 - Template Selection
  - Step5_ChooseTemplate.tsx
  - Template previews
  Duration: 3 hours

Task 10: Step 6 - Review & Submit
  - Step6_Review.tsx
  - API integration (POST /api/biodata)
  Duration: 3 hours
```

### Phase 3: Display & Sharing (15 hours)
```
Task 11: Biodata Preview
  - BioDataPreview.tsx
  - Template display component
  Duration: 5 hours

Task 12: Share & Privacy Settings
  - SharePrivacySettings.tsx
  - ShareModal.tsx
  - API integration (GET/POST/DELETE /api/shares)
  Duration: 6 hours

Task 13: Public Viewer
  - PublicBioDataView.tsx
  - Share token validation
  - Permission-based field display
  Duration: 4 hours
```

### Phase 4: Polish & Testing (8 hours)
```
Task 14: Styling & Responsiveness
  - Ensure all screens mobile-responsive
  - Match wireframe colors/spacing
  - Tailwind optimization
  Duration: 4 hours

Task 15: Error Handling & Loading States
  - Loading spinners
  - Error messages
  - Form validation feedback
  Duration: 2 hours

Task 16: Basic UI Tests
  - Form submission
  - Navigation between steps
  - Share functionality
  Duration: 2 hours
```

---

## Section 7: Technology & Libraries

**Already in package.json**:
- React 18
- TypeScript
- Tailwind CSS
- Redux & Redux Toolkit
- Axios (for API calls)

**Need to add**:
```bash
npm install react-router-dom
npm install react-hook-form  # For better form handling
npm install zod  # Or joi for validation
npm install date-fns  # Date manipulation
```

Optional but recommended:
```bash
npm install react-image-crop  # Photo cropping
npm install react-dropzone  # Drag & drop
npm install react-toastify  # Toast notifications
npm install react-select  # Better dropdowns
```

---

## Section 8: Styling Guide

**Color Palette** (from wireframe):
- Primary Red: `#D32F2F` or `#C62828`
- Dark Navy: `#1A237E` or similar
- Light Gray: `#F5F5F5`
- Border Gray: `#BDBDBD`

**Tailwind Classes to Use**:
```
- Buttons: bg-red-700 hover:bg-red-800 text-white
- Inputs: border border-gray-300 rounded px-4 py-2
- Cards: shadow rounded-lg p-6 bg-white
- Headers: font-bold text-lg
- Mobile: responsive using sm:, md:, lg: prefixes
```

---

## Section 9: Estimated Timeline

| Task | Hours | Days | Week |
|------|-------|------|------|
| Setup & Components | 6 | 1 | Week 1 |
| Form Steps (1-6) | 25 | 3-4 | Week 2-3 |
| Display & Sharing | 15 | 2 | Week 4 |
| Polish & Testing | 8 | 1 | Week 4 |
| **Total** | **54** | **7-8** | **~2-3 weeks** |

---

## Section 10: Success Criteria

- [ ] All 7 form steps render correctly
- [ ] Form data persists through all steps
- [ ] Can edit any step and return to previous
- [ ] Photos upload to S3 successfully
- [ ] Biodata submission creates record in database
- [ ] Biodata preview displays with correct template
- [ ] Share modal creates shares with correct permissions
- [ ] Public viewer works without authentication
- [ ] All screens responsive (mobile/tablet/desktop)
- [ ] Form validation prevents invalid submissions
- [ ] Error messages displayed for API failures

---

## File Structure After Completion

```
src/
├── pages/
│   ├── Home.tsx
│   ├── BioDataForm/
│   │   ├── Step1_PersonalDetails.tsx
│   │   ├── Step2_Photos.tsx
│   │   ├── Step3_Family.tsx
│   │   ├── Step4_Horoscope.tsx
│   │   ├── Step5_ChooseTemplate.tsx
│   │   ├── Step6_Review.tsx
│   │   └── FormContainer.tsx
│   ├── BioDataPreview.tsx
│   ├── SharePrivacySettings.tsx
│   └── PublicBioDataView.tsx
├── components/
│   ├── Header.tsx
│   ├── FormField.tsx
│   ├── StepIndicator.tsx
│   ├── Modal.tsx
│   ├── PhotoUploader.tsx
│   ├── ShareModal.tsx
│   ├── TemplateCard.tsx
│   ├── TemplateView_Traditional.tsx
│   ├── TemplateView_Modern.tsx
│   └── FamilyMemberField.tsx
├── store/
│   ├── index.ts
│   ├── authSlice.ts (existing)
│   └── bioDataSlice.ts
├── services/
│   ├── api.ts
│   ├── uploadService.ts
│   └── shareService.ts
├── utils/
│   ├── validation.ts
│   ├── formHelpers.ts
│   └── astroCalculations.ts
├── styles/
│   ├── templates/
│   │   ├── traditional.css
│   │   ├── modern.css
│   │   └── premium.css
│   └── globals.css
├── App.tsx
└── main.tsx
```

---

## How to Execute with Cursor

1. **Start with Setup Tasks** (Task 1-3):
   - Ask Cursor: "Set up Redux store for biodata form"
   - Ask Cursor: "Create reusable FormField component"
   - Ask Cursor: "Add React Router and set up routing structure"

2. **Build Form Steps** (Task 5-10):
   - Ask Cursor: "Create Step 1 form for personal details with validation"
   - Repeat for each step, referencing the wireframe
   - Cursor will understand the context from this document

3. **Connect to API**:
   - Ask Cursor: "Integrate Step 6 with POST /api/biodata endpoint"
   - Ask Cursor: "Add photo upload to S3 for Step 2"

4. **Build Display Features** (Task 11-13):
   - Ask Cursor: "Create biodata preview page matching the wireframe template"
   - Ask Cursor: "Build share modal with permission toggles"

5. **Polish**:
   - Ask Cursor: "Make all forms mobile responsive"
   - Ask Cursor: "Add loading states and error handling"

---

## Notes

- Keep forms modular and testable
- Save Redux state to localStorage for form recovery
- Use TypeScript for type safety
- Test each step independently before integration
- Ensure mobile-first responsive design throughout
- Validate on both client and server side

Good luck! This document gives you a complete roadmap to implement all wireframes. 🚀
