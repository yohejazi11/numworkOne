async function uploadContent(content = 'posts') {
    const mainContentContainer = document.getElementById('mainContentDiv');
    const TopSideSectionL = document.getElementById('TopSideSectionL');
    while (mainContentContainer.firstChild) {
        mainContentContainer.removeChild(mainContentContainer.firstChild);
    }
    while (TopSideSectionL.firstChild) {
        TopSideSectionL.removeChild(TopSideSectionL.firstChild);
    }
    const tasksNavButton = document.getElementById('tasksNavButton');
    const postsNavButton = document.getElementById('postsNavButton');
    const jobsNavButton = document.getElementById('jobsNavButton');
    let isUserSignIn = 0;

    try {
        const userInfoResponse = await fetch("getUserInfo.php");
        if (!userInfoResponse.ok) throw new Error('Network response was not ok ' + userInfoResponse.statusText);
        const response = await userInfoResponse.json();
        if (response.user_id > 0) {
            isUserSignIn = response.user_id;
            switch (content) {
                case 'posts':
                    createButton('إضافة منشور', 'add-post-BTN', 'background-bulrer-pup-on', 'addPostDiv');
                    break;
                case 'tasks':
                    createButton('إضافة مهمة', 'add-task-BTN', 'background-bulrer-pup-on', 'firstTaskAddStep');
                    break;
                case 'jobs':
                    createButton('إضافة وظيفة', 'add-job-BTN', 'background-bulrer-pup-on', 'addJobDiv');
                    break;
            }
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }

    switch (content) {
        case 'posts':
            updateUI(postsNavButton, [postsNavButton, jobsNavButton, tasksNavButton]);
            fetchContent('getPosts.php', renderPosts);
            break;
        case 'tasks':
            updateUI(tasksNavButton, [postsNavButton, jobsNavButton, tasksNavButton]);
            fetchContent('getTasks.php', renderTasks);
            break;
        case 'jobs':
            updateUI(jobsNavButton, [postsNavButton, jobsNavButton, tasksNavButton]);
            fetchContent('getJobs.php', renderJobs);
            break;
    }

    function createButton(text, className, popupClass, popupDivId) {
        const button = document.createElement('button');
        button.setAttribute('class', className);
        mainContentContainer.appendChild(button);
        button.textContent = text;
        button.addEventListener('click', function () {
            document.getElementById('background-pup').classList.add(popupClass);
            document.getElementById(popupDivId).classList.add('open-pup');
        });
    }

    function updateUI(selectedButton, buttonsNav) {
        buttonsNav.forEach(buttonNav => {
            if (selectedButton === buttonNav) {
                buttonNav.classList.add('selectedButton');
            } else {
                buttonNav.classList.remove('selectedButton');
            }
        });
    }

    function fetchContent(url, callback) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(callback)
            .catch(error => console.error('Error fetching data:', error));
    }

    function renderPosts(posts_arrays) {
        posts_arrays.sort((a, b) => new Date(b.time_date_post) - new Date(a.time_date_post));
        posts_arrays.forEach(post => {
            const postBox = document.createElement('div');
            postBox.setAttribute('class', 'post-box');

            const userPostInfo = document.createElement('div');
            const postText = document.createElement('div');
            const mediaContainer = document.createElement('div');
            const postGallery = document.createElement('img');
            const postActivity = document.createElement('div');
            const userPostPic = document.createElement('img');
            const userNamePosts = document.createElement('h4');
            const postLikeBox = document.createElement('div');
            const postCommentBox = document.createElement('div');
            const likeBtn = document.createElement('button');
            const likeCounter = document.createElement('div');
            const commentBtn = document.createElement('button');
            const commentCounter = document.createElement('div');

            userPostInfo.setAttribute('class', 'user-post-info');
            postText.setAttribute('class', 'post-text-box');
            mediaContainer.setAttribute('class', 'media-container');
            postGallery.setAttribute('class', 'post-gallery-box');
            postActivity.setAttribute('class', 'post-activity-box');
            postLikeBox.setAttribute('class', 'post-like-box');
            postCommentBox.setAttribute('class', 'post-comment-box');
            userPostPic.setAttribute('class', 'post-user-pic');
            userNamePosts.setAttribute('class', 'post-user-name');

            postGallery.setAttribute('src', post.image_post_one);
            userNamePosts.textContent = post.user_name;
            userPostPic.setAttribute('src', post.profile_pic);
            postText.textContent = post.text_post;

            userPostInfo.appendChild(userPostPic);
            userPostInfo.appendChild(userNamePosts);
            postLikeBox.appendChild(likeBtn);
            postLikeBox.appendChild(likeCounter);
            postCommentBox.appendChild(commentBtn);
            postCommentBox.appendChild(commentCounter);
            postActivity.appendChild(postCommentBox);
            postActivity.appendChild(postLikeBox);
            postBox.appendChild(userPostInfo);

            if (post.text_post !== '') {
                postBox.appendChild(postText);
            }
            if (post.image_post_one !== '') {
                mediaContainer.appendChild(postGallery);
                postBox.appendChild(mediaContainer);
            }
            postBox.appendChild(postActivity);
            mainContentContainer.appendChild(postBox);
        });
    }

    function renderTasks(tasks_arrays) {

        // إنشاء عناصر الـ DOM
        const searchTask = document.createElement('input');
        const sortMainCategory = document.createElement('select');
        const sortSubCategory = document.createElement('select');
    
        sortMainCategory.setAttribute('id', 'sortMainCategory');
        sortSubCategory.setAttribute('id','sortSubCategory');
        sortMainCategory.setAttribute('onchange','updateSubCategory');
    
        TopSideSectionL.appendChild(searchTask);
        TopSideSectionL.appendChild(sortMainCategory);
        TopSideSectionL.appendChild(sortSubCategory);
    
        // جلب البيانات عند تحميل الصفحة
        sortMainCategory.addEventListener('click', function () {

            fetch('TaskCategories.json')
                .then(response => response.json())
                .then(data => {
                    const sortMainCategory = document.getElementById('sortMainCategory');
                    while(sortMainCategory.firstChild){
                        sortMainCategory.removeChild(sortMainCategory.firstChild);
                    }
                    for (let category in data) {
                        let option = document.createElement('option');
                        option.value = category;
                        option.textContent = category;
                        sortMainCategory.appendChild(option);
                    }
                    // حفظ البيانات المستلمة للاستخدام لاحقاً
                    window.categories = data;
                });
    
            fetch('Tasktechnologies.json')
                .then(response => response.json())
                .then(data => {
                    // حفظ البيانات المستلمة للاستخدام لاحقاً
                    window.technologies = data;
                });
                
        });

    
        // دالة تحديث التصنيفات الفرعية
        function updateSubCategory() {
            const sortMainCategory = document.getElementById('sortMainCategory');
            const subCategorySelect = document.getElementById('sortSubCategory');
            const selectedCategory = sortMainCategory.value;
    
            subCategorySelect.innerHTML = '<option value="">اختر...</option>';
            subCategorySelect.classList.add('show');
            if (selectedCategory) {
                const subCategories = window.categories[selectedCategory];
                subCategories.forEach(subCategory => {
                    let option = document.createElement('option');
                    option.value = subCategory;
                    option.textContent = subCategory;
                    subCategorySelect.appendChild(option);
                });
            }
        }
    
        // دالة تحديث التقنيات المطلوبة
        function updateRequiredTechnologies() {
            const subCategorySelect = document.getElementById('sortSubCategory');
            const technologiesContainer = document.getElementById('technologiesSelect');
            const selectedSubCategory = subCategorySelect.value;
    
            technologiesContainer.innerHTML = '';
            technologiesContainer.classList.add('show');
    
            if (selectedSubCategory) {
                const technologies = window.technologies[selectedSubCategory];
                technologies.forEach(technology => {
                    let label = document.createElement('label');
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = technology;
                    checkbox.name = 'technologies[]';
    
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(technology));
    
                    technologiesContainer.appendChild(label);
                });
            }
        }
    
        // ترتيب المهام حسب تاريخ النشر وعرضها
        tasks_arrays.sort((a, b) => new Date(b.time_date_task) - new Date(a.time_date_task));
        tasks_arrays.forEach(task => {
            const taskBox = document.createElement('div');
            const taskTitle = document.createElement('div');
            const taskPostInfo = document.createElement('div');
            const taskOwnerInfo = document.createElement('div');
            const taskDatePost = document.createElement('div');
            const taskDetails = document.createElement('div');
            const addOfferBtn = document.createElement('button');
    
            taskBox.setAttribute('class', 'task-box');
            taskTitle.setAttribute('class', 'task-title-box');
            taskPostInfo.setAttribute('class', 'task-posted-info');
            taskOwnerInfo.setAttribute('class', 'task-owner-user-name');
            taskDatePost.setAttribute('class', 'task-posted-date');
            taskDetails.setAttribute('class', 'task-content');
            addOfferBtn.setAttribute('class', 'add-offer-button');
    
            taskTitle.textContent = task.ProjectName;
            taskOwnerInfo.textContent = `الناشر: ${task.user_name}`;
            taskDatePost.textContent = `تم النشر: ${new Date(task.time_date_task).toLocaleString('ar-EG', {
                year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
            })}`;
            taskDetails.textContent = task.ProjectDescription;
            addOfferBtn.textContent = 'قدم عرض';
    
            taskPostInfo.appendChild(taskOwnerInfo);
            taskPostInfo.appendChild(taskDatePost);
            taskBox.appendChild(taskTitle);
            taskBox.appendChild(taskPostInfo);
            taskBox.appendChild(taskDetails);
    
            // تأكد من أن زر التقديم يظهر فقط إذا كان المستخدم مسجلاً الدخول
            if (isUserSignIn > 0) {
                taskBox.appendChild(addOfferBtn);
            }
    
            mainContentContainer.appendChild(taskBox);
        });
    }
    

    function renderJobs(jobs_arrays) {
        jobs_arrays.sort((a, b) => new Date(b.time_date_post) - new Date(a.time_date_post));
        jobs_arrays.forEach(job => {
            const jobBox = document.createElement('div');
            jobBox.setAttribute('class', 'jobBox');
            jobBox.textContent = `يمكنك عرض الوظائف الآن '${job.text_post}`;
            mainContentContainer.appendChild(jobBox);
        });
    }
}

uploadContent('posts');
