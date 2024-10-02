document.addEventListener('DOMContentLoaded', function() {
    const customDropdown = document.getElementById('customDropdown');
    const selectedOption = customDropdown.querySelector('.selected-option');
    const optionsContainer = customDropdown.querySelector('.options-container');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewContainer = document.getElementById('previewContainer');
    const templatePreview = document.getElementById('templatePreview');
    const depthImageInput = document.getElementById('depthImage');

    // Fixed values for separation and depthStrength
    const separation = 170;
    const depthStrength = 25;

    let selectedTemplateId = null;
    let templateOptions = [];

     // Fetch and populate template options
     fetch('/api/templates')
     .then(response => response.json())
     .then(templates => {
         templateOptions = templates;
         templates.forEach(template => {
             const option = document.createElement('div');
             option.className = 'option';
             option.innerHTML = `
                 <span>${template.name}</span>
                 <img src="/uploads/${template.filename}" alt="${template.name}" class="template-preview">
             `;
             option.dataset.value = template.id;
             option.dataset.filename = template.filename;
             option.dataset.name = template.name;
             optionsContainer.appendChild(option);

             option.addEventListener('click', function() {
                 selectedTemplateId = this.dataset.value;
                 updateSelectedOption(this.dataset.name, this.dataset.filename);
                 optionsContainer.classList.add('hidden');
                 updateTemplatePreview(this.dataset.filename);
             });
         });

         // Select a random template as default
         selectRandomTemplate();
     });

     function selectRandomTemplate() {
         if (templateOptions.length > 0) {
             const randomIndex = Math.floor(Math.random() * templateOptions.length);
             const randomTemplate = templateOptions[randomIndex];
             selectedTemplateId = randomTemplate.id;
             updateSelectedOption(randomTemplate.name, randomTemplate.filename);
             updateTemplatePreview(randomTemplate.filename);
         }
     }

     function updateSelectedOption(name, filename) {
        selectedOption.innerHTML = `
            <span>${name}</span>
            <img src="/uploads/${filename}" alt="${name}" class="template-preview">
        `;
    }

    selectedOption.addEventListener('click', function() {
        optionsContainer.classList.toggle('hidden');
    });

    document.addEventListener('click', function(e) {
        if (!customDropdown.contains(e.target)) {
            optionsContainer.classList.add('hidden');
        }
    });

    // Update the updateTemplatePreview function
    function updateTemplatePreview(filename) {
        if (filename) {
            const templatePath = `/uploads/${filename}`;
            templatePreview.src = templatePath;
            previewContainer.classList.remove('hidden');
        } else {
            previewContainer.classList.add('hidden');
        }
    }

    generateBtn.addEventListener('click', function() {
        const depthImage = depthImageInput.files[0];

        if (!depthImage || !selectedTemplateId) {
            alert('Please upload a depth image and select a template.');
            return;
        }

        const formData = new FormData();
        formData.append('separation', separation);
        formData.append('depthStrength', depthStrength);
        formData.append('depthImage', depthImage);
        formData.append('templateId', selectedTemplateId);

        fetch('/generate-stereogram', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            document.getElementById('stereogramPreview').src = url;
            document.getElementById('stereogramPreviewContainer').classList.remove('hidden');
            
            downloadBtn.onclick = function() {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'stereogram.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            downloadBtn.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while generating the stereogram.');
        });
    });
});