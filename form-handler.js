document.addEventListener('DOMContentLoaded', function () {
  // Listen for WPForms submission complete event
  document.addEventListener('wpformsAjaxSubmitSuccess', function (event) {
    const form = event.detail.form;
    const formId = parseInt(form.dataset.formid, 10);

    // Replace 4744 with your WPForms form ID
    if (formId !== 4744) return;

    // Get form field values
    const name = getFieldValue(form, 'your-name') || '';
    const email = getFieldValue(form, 'your-email') || '';
    const organisation = getFieldValue(form, 'your-organisation') || '';
    const designation = getFieldValue(form, 'your-designation') || '';
    const year = getFieldValue(form, 'your-year') || '';
    const documentType = getFieldValue(form, 'your-document-type') || '';

    const fileMap = {
      "2008": {
        "Final Report": "https://a2f.ng/download/4584/?tmstv=1746086428",
        "Dataset": "https://a2f.ng/download/3444/?tmstv=1746086753"
      },
      "2010": {
        "Final Report": "https://a2f.ng/download/4569/?tmstv=1746086428",
        "Dataset": "https://a2f.ng/download/3441/?tmstv=1746086753"
      },
      "2012": {
        "Final Report": "https://a2f.ng/download/4557/?tmstv=1746086428",
        "Dataset": "https://a2f.ng/download/3438/?tmstv=1746086753"
      },
      "2014": {
        "Final Report": "https://a2f.ng/download/4547/?tmstv=1746086428",
        "Dataset": "https://a2f.ng/download/3435/?tmstv=1746086753"
      },
      "2016": {
        "Final Report": "https://a2f.ng/download/4535/?tmstv=1746086428",
        "Dataset": "https://a2f.ng/download/3432/?tmstv=1746086753"
      },
      "2018": {
        "Final Report": "https://a2f.ng/download/4248/?tmstv=1746086753",
        "Questionnaire": "https://a2f.ng/download/4429/?tmstv=1746086753",
        "Dataset": "https://a2f.ng/download/3429/?tmstv=1746086958"
      },
      "2020": {
        "Final Report": "https://a2f.ng/download/4200/?tmstv=1746086753",
        "Dataset": "https://a2f.ng/download/4522/?tmstv=1746086428"
      },
      "2023": {
        "Final Report": "https://a2f.ng/download/4183/?tmstv=1746086753",
        "Survey Report": "https://a2f.ng/download/4183/?tmstv=1746086753",
        "Fact Sheet": "https://a2f.ng/download/4341/?tmstv=1746086753",
        "Glossary": "https://a2f.ng/download/4380/?tmstv=1746086753",
        "Indicators": "https://a2f.ng/download/4348/?tmstv=1746086753",
        "Dataset (Excel)": "https://a2f.ng/download/4287/?tmstv=1746086753",
        "Dataset (SPSS)": "https://a2f.ng/download/3794/?tmstv=1746086753"
      }
    };

    const fileUrl = fileMap[year]?.[documentType];

    const payload = {
      name,
      email,
      organisation,
      designation,
      year,
      document: documentType,
      date: new Date().toISOString(),
      url: window.location.href
    };

    // Send data to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbwDPiO5bi7Fsjuc8zctEkJdU9PXV9gT21d7sy5vO97Yk2VBNoiQs-FqZtI3ysTGySeNEQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .finally(() => {
      if (fileUrl) {
        const msg = document.createElement('div');
        msg.innerHTML = `<p>Your download will begin in a moment...</p>`;
        msg.style.cssText = "background:#e7f7e7;border:1px solid #cae6ca;padding:10px 15px;margin:15px 0;border-radius:4px";
        
        // WPForms uses different confirmation message selector
        const confirmation = form.querySelector('.wpforms-confirmation-container-full');
        if (confirmation) confirmation.after(msg); else form.appendChild(msg);

        setTimeout(() => {
          const win = window.open(fileUrl, '_blank');
          if (!win) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 1000);
          }

          msg.innerHTML = `<p>Your download has started. If it doesn't begin automatically, <a href="${fileUrl}" target="_blank">click here</a>.</p>`;

          if (typeof PUM !== 'undefined') {
            setTimeout(() => {
              try {
                const popup = PUM.getPopup(form.closest('.pum-container'));
                if (popup) popup.close();
              } catch (e) {}
            }, 3000);
          }
        }, 1500);
      } else {
        alert("Sorry, that file is not available for the selected combination.");
      }
    });
  });

  // Setup dropdown logic
  const setupDynamicFields = () => {
    // For WPForms - update selectors to match WPForms field IDs
    const yearField = document.querySelector('[id^="wpforms-"][id$="-field_5"]'); // Change to match your Year field ID
    const docField = document.querySelector('[id^="wpforms-"][id$="-field_6"]');  // Change to match your Document Type field ID
    
    const options = {
      "2008": ["Final Report", "Dataset"],
      "2010": ["Final Report", "Dataset"],
      "2012": ["Final Report", "Dataset"],
      "2014": ["Final Report", "Dataset"],
      "2016": ["Final Report", "Dataset"],
      "2018": ["Final Report", "Questionnaire", "Dataset"],
      "2020": ["Final Report", "Dataset"],
      "2023": ["Final Report", "Survey Report", "Fact Sheet", "Glossary", "Indicators", "Dataset (Excel)", "Dataset (SPSS)"]
    };

    if (yearField && docField) {
      yearField.addEventListener('change', function () {
        const val = this.value;
        
        // WPForms handles dropdowns differently
        // Clear existing options except the first one
        while (docField.options.length > 1) {
          docField.remove(1);
        }
        
        // Add new options
        if (options[val]) {
          options[val].forEach(doc => {
            const opt = document.createElement('option');
            opt.value = doc;
            opt.textContent = doc;
            docField.appendChild(opt);
          });
        }
      });
    }
  };

  setupDynamicFields();
});

// Helper function to get field values from WPForms
function getFieldValue(form, fieldName) {
  // WPForms uses IDs instead of names, so we need to find the appropriate field
  // You'll need to replace these selectors with your actual field IDs
  const selectors = {
    'your-name': '[id^="wpforms-"][id$="-field_1"]',
    'your-email': '[id^="wpforms-"][id$="-field_2"]',
    'your-organisation': '[id^="wpforms-"][id$="-field_3"]',
    'your-designation': '[id^="wpforms-"][id$="-field_4"]',
    'your-year': '[id^="wpforms-"][id$="-field_5"]',
    'your-document-type': '[id^="wpforms-"][id$="-field_6"]'
  };
  
  const selector = selectors[fieldName];
  const field = form.querySelector(selector);
  return field ? field.value : '';
}