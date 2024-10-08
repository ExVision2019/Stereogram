document.addEventListener('DOMContentLoaded', function() {
    const uploadTemplateForm = document.getElementById('uploadTemplateForm');
    const uploadDepthForm = document.getElementById('uploadDepthForm');
    const templateList = document.getElementById('templateList');
    const depthList = document.getElementById('depthList');

    function loadTemplates() {
        fetch('/api/templates')
            .then(response => response.json())
            .then(templates => {
                templateList.innerHTML = '';
                templates.forEach(template => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
                    li.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <img src="/uploads/${template.filename}" alt="${template.name}" class="w-16 h-16 object-cover rounded">
                            <span class="font-medium">${template.name}</span>
                        </div>
                        <button class="deleteTemplateBtn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200" data-id="${template.id}">Delete</button>
                    `;
                    templateList.appendChild(li);
                });

                document.querySelectorAll('.deleteTemplateBtn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        deleteTemplate(this.dataset.id);
                    });
                });
            });
    }

    function loadDepthImages() {
        fetch('/api/depth-images')
            .then(response => response.json())
            .then(depthImages => {
                depthList.innerHTML = '';
                depthImages.forEach(depth => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-lg';
                    li.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <img src="/uploads/depth/${depth.filename}" alt="${depth.name}" class="w-16 h-16 object-cover rounded">
                            <span class="font-medium">${depth.name}</span>
                        </div>
                        <button class="deleteDepthBtn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200" data-id="${depth.id}">Delete</button>
                    `;
                    depthList.appendChild(li);
                });

                document.querySelectorAll('.deleteDepthBtn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        deleteDepthImage(this.dataset.id);
                    });
                });
            });
    }

    uploadTemplateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('templateName').value);
        formData.append('image', document.getElementById('templateImage').files[0]);

        fetch('/api/templates', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            alert('Template uploaded successfully');
            loadTemplates();
            this.reset();
        })
        .catch(error => {
            alert('Error uploading template');
            console.error('Error:', error);
        });
    });

    uploadDepthForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('depthName').value);
        formData.append('image', document.getElementById('depthImage').files[0]);

        fetch('/api/depth-images', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            alert('Depth image uploaded successfully');
            loadDepthImages();
            this.reset();
        })
        .catch(error => {
            alert('Error uploading depth image');
            console.error('Error:', error);
        });
    });

    function deleteTemplate(id) {
        if (confirm('Are you sure you want to delete this template?')) {
            fetch(`/api/templates/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(result => {
                alert('Template deleted successfully');
                loadTemplates();
            })
            .catch(error => {
                alert('Error deleting template');
                console.error('Error:', error);
            });
        }
    }

    function deleteDepthImage(id) {
        if (confirm('Are you sure you want to delete this depth image?')) {
            fetch(`/api/depth-images/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(result => {
                alert('Depth image deleted successfully');
                loadDepthImages();
            })
            .catch(error => {
                alert('Error deleting depth image');
                console.error('Error:', error);
            });
        }
    }

    // Load both templates and depth images when the page loads
    loadTemplates();
    loadDepthImages();
});