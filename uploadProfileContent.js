async function uploadContent(content = 'mainProfile') {
    const mainContentContainer = document.getElementById('mainContentDiv');
    const leftSideTopSection = document.getElementById('leftSideTopSection');

    // Navigation buttons 
    const workGallaryNavButton = document.getElementById('workGallaryNavButton');
    const dashBoardNavButton = document.getElementById('dashBoardNavButton');
    const profileNavButton = document.getElementById('profileNavButton');

    let isUserSignIn = 0;

    clearElement(mainContentContainer);
    clearElement(leftSideTopSection);

    try {
        const userInfoResponse = await fetch("getUserInfo.php");
        if (!userInfoResponse.ok) throw new Error('Network response was not ok ' + userInfoResponse.statusText);
        const response = await userInfoResponse.json();
        if (response.user_id > 0) {
            isUserSignIn = response.user_id;
            handleUserActions(content);
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }

    handleContentSwitch(content);

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
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

    async function fetchContent(url, callback) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            const data = await response.json();
            callback(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleUserActions(content) {
        switch (content) {
            case 'tasks':
                createButton('مهمة', 'add-task-BTN', 'background-bulrer-pup-on', 'firstTaskAddStep');
                break;
            case 'jobs':
                createButton('وظيفة', 'add-job-BTN', 'background-bulrer-pup-on', 'addJobDiv');
                break;
        }
    }

    function handleContentSwitch(content) {
        switch (content) {
            case 'workGallary':
                updateUI(workGallaryNavButton, [profileNavButton, dashBoardNavButton, workGallaryNavButton]);
                fetchContent('getAccountApi.php?action=getGallaryWork', renderWorkGallary);
                break;
            case 'dashBoard':
                updateUI(dashBoardNavButton, [profileNavButton, dashBoardNavButton, workGallaryNavButton]);
                fetchContent('getAccountApi.php?action=getPosts', renderDashBoard);
                break;
            case 'mainProfile':
                updateUI(profileNavButton, [profileNavButton, dashBoardNavButton, workGallaryNavButton]);
                fetchContent('getAccountApi.php?action=getMainProfile', renderMainProfile);

                break;
        }
    }

    function renderMainProfile(main_profile) {
        const profileImageDiv = document.createElement('div');
        const mainInfoProfile = document.createElement('div');
        const profileHeader = document.createElement('img');
        const profilePic = document.createElement('img');
        const fullName = document.createElement('div');
        const profileBaio = document.createElement('div');

        profileBaio.setAttribute('class','profile-baio');
        profileImageDiv.setAttribute('class', 'profile-image-div');
        mainInfoProfile.setAttribute('class', 'main-info-profile-div');
        profileHeader.setAttribute('class', 'main-profile-header');
        profilePic.setAttribute('class', 'main-profile-pic');
        fullName.setAttribute('class', 'profile-full-name');
        profileHeader.setAttribute('src', main_profile.data.profile_header);
        profilePic.setAttribute('src', main_profile.data.profile_pic);
        fullName.textContent = main_profile.data.first_name + `   ` + main_profile.data.last_name;
        profileBaio.textContent= main_profile.data.user_baio;
        
        profileImageDiv.appendChild(profileHeader);
        mainInfoProfile.appendChild(profilePic);
        mainInfoProfile.appendChild(fullName);
        mainInfoProfile.appendChild(profileBaio);

        mainContentContainer.appendChild(profileImageDiv);
        mainContentContainer.appendChild(mainInfoProfile);
    }

    function renderWorkGallary(work_gallary) {
        mainContentContainer.innerHTML = '<h2>Work Gallary</h2>';
        work_gallary.data.forEach(work => {
            const taskDiv = document.createElement('div');
            taskDiv.textContent = work.name; // Assuming tasks have a name property
            mainContentContainer.appendChild(taskDiv);
        });
    }

    function renderDashBoard(dash_bord) {
        mainContentContainer.innerHTML = '<h2>Dashboard</h2>';
        dash_bord.data.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.textContent = post.title; // Assuming posts have a title property
            mainContentContainer.appendChild(postDiv);
        });
    }
}
uploadContent('mainProfile');