# User Test

## User Test Case 1: UI Aesthetics Test
#### Test Objective: 
Verify whether the UI reflects JCU GYM branding and gym-specific visual elements

### Test Steps:

1. Open the homepage, registration page, login page, and booking page

2. Check if JCU GYM logo and themed background images are present

### Expected Result: 
All pages should display the JCU GYM logo and have a visually engaging gym-themed background

### Actual Result: ❌ Fail to test

### Issue Analysis: 
Background images and logos failed to load, possibly due to incorrect file paths or missing assets

### Suggested Solution:

- Check image file paths in CSS (e.g., url('images/logo.png'))

- Ensure all image files are correctly uploaded and accessible on the server

- Use browser developer tools to debug missing resources

## User Test Case 2: UI Form Complexity Test
### Test Objective: 
Ensure that the user registration or profile form is clean and concise

### Test Steps:

1. Open the registration page

2. Observe the number of form fields and check for unnecessary ones

3. Attempt to fill in the form

### Expected Result: 
The form should only include essential fields like name, phone, email, and password

### Actual Result: ✔ Pass

### Remarks: 
Non-essential fields like nickname and address were removed. The form is now simplified.

## User Test Case 3: UI Input Validity Control Test
### Test Objective: 
Ensure form fields are restricted to valid, meaningful inputs

### Test Steps:

1. Enter invalid or nonsensical data (e.g., "123" or "ABC") into fields like gender or goals

2. Submit the form

3. Expected Result: Input should be restricted using dropdowns or radio buttons to enforce proper format

### Actual Result: ❌ Fail

### Issue Analysis: 
- Fields are implemented as free text inputs, allowing incorrect data submission

### Suggested Solution:

- Replace free text fields with <select> or radio options

- Implement backend validation for accepted values (e.g., gender should be Male/Female/Other)

## User Test Case 4: Booking Feedback Test
### Test Objective: 
Verify that users receive feedback after booking a session

### Test Steps:

1. Log in with a valid account

2. Click on a "Book" button for a session

3. Observe whether confirmation is shown (e.g., popup or status update)

### Expected Result: 
System should provide confirmation such as “Booking Successful”

### Actual Result: ❌ Fail

### Issue Analysis:

- No frontend message or alert shown

- Backend may not return confirmation response

### Suggested Solution:

- Add alert("Booking successful!") or visual feedback on frontend

- Ensure backend returns a success response that frontend can detect
  
