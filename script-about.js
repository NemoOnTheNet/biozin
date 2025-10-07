// Script pour améliorer l'accessibilité et l'UX du formulaire
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const commentaireTextarea = document.getElementById('commentaire');
  const characterCount = document.getElementById('commentaire-count');

  if (!form || !commentaireTextarea || !characterCount) return;

  // Compteur de caractères
  function updateCharacterCount() {
    const currentLength = commentaireTextarea.value.length;
    const maxLength = 500;
    characterCount.textContent = `${currentLength}/${maxLength} caractères`;

    if (currentLength > maxLength * 0.9) {
      characterCount.style.color = '#d32f2f';
    } else {
      characterCount.style.color = '#666';
    }
  }

  // Validation en temps réel
  function validateField(field, errorElement) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Ce champ est obligatoire.';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer une adresse e-mail valide.';
      }
    } else if (field.type === 'tel' && value) {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        errorMessage = 'Veuillez entrer un numéro de téléphone français valide.';
      }
    }

    // Mise à jour de l'affichage des erreurs
    if (errorElement) {
      errorElement.textContent = errorMessage;
      field.setAttribute('aria-invalid', !isValid);
    }

    return isValid;
  }

  // Écouteurs d'événements
  commentaireTextarea.addEventListener('input', updateCharacterCount);
  updateCharacterCount(); // Initialisation

  // Validation en temps réel pour tous les champs
  const fields = form.querySelectorAll('input[required], textarea[required], input[type="email"], input[type="tel"]');
  fields.forEach((field) => {
    const errorElement = document.getElementById(field.id + '-error');

    field.addEventListener('blur', () => {
      validateField(field, errorElement);
    });

    field.addEventListener('input', () => {
      // Effacer l'erreur lors de la saisie
      if (errorElement && errorElement.textContent) {
        errorElement.textContent = '';
        field.setAttribute('aria-invalid', 'false');
      }
    });
  });

  // Validation complète du formulaire
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isFormValid = true;

    fields.forEach((field) => {
      const errorElement = document.getElementById(field.id + '-error');
      const isFieldValid = validateField(field, errorElement);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Simulation d'envoi (remplacer par votre logique d'envoi)
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Message envoyé avec succès !');
        form.reset();
        updateCharacterCount();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    } else {
      // Focus sur le premier champ en erreur
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
      }
    }
  });

  // Amélioration du focus pour la navigation au clavier
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
      e.preventDefault();
      const formElements = Array.from(form.querySelectorAll('input, textarea, button'));
      const currentIndex = formElements.indexOf(e.target);
      const nextElement = formElements[currentIndex + 1];
      if (nextElement) {
        nextElement.focus();
      }
    }
  });
});
