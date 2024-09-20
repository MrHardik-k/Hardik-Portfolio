(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission

      let thisForm = this;

      let action = thisForm.getAttribute('action'); // This should now point to Formspree URL
      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm); // Capture form data
      
      // Optional: Add timestamp if not already added in HTML
      if (!formData.has('timestamp')) {
        formData.append('timestamp', new Date().toISOString());
      }

      php_email_form_submit(thisForm, action, formData); // Submit the form via AJAX
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' } // Formspree accepts JSON responses
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.ok) {
          thisForm.querySelector('.sent-message').classList.add('d-block'); // Show success message
          thisForm.reset(); // Reset form on success
        } else {
          throw new Error(data.message || 'Form submission failed.');
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    console.error(error); // Log error for debugging
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error.message;
    thisForm.querySelector('.error-message').classList.add('d-block'); // Show error message
  }

})();
