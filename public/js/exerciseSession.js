// Global object to store all exercise data

const workoutData = {};
let currentExercise = '';
let currentUserId = window.routineData.userId;
// Track which routine each exercise belongs to
const exerciseToRoutineMap = {};

const mainRoutineName = window.routineData.routineName;
const mainRoutineId = window.routineData.routineId;
window.routineData.exercises.forEach(exercise => {
    workoutData[exercise] = [];
    exerciseToRoutineMap[exercise] = {
        routineName: mainRoutineName,
        routineId: mainRoutineId
    };
});

//Function to load routines into the "Link Routines" modal
async function loadRoutines() {
    try {
        const res = await fetch('/api/routines'); //Fetch the user's saved routines
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        //Populate the routine list with the user's routines
        const list = document.getElementById('routineList');
        list.innerHTML = '';
        data.forEach(routine => {
            const li = document.createElement('li');
            li.textContent = routine.routineName;
            li.style.cursor = 'pointer';
            li.onclick = () => addRoutineExercises(routine._id);
            list.appendChild(li);
        });
        //Make the Routine modal visible
        document.getElementById('routineModal').style.display = 'block';
    } catch (err) {
        console.error('Failed to load routines:', err);
        alert('Error loading routines. Please try again.');
    }
}
//Function to add exercises to your current session from another routine
async function addRoutineExercises(routineId) {   //Function accepts the given routineID to grab the exercises from
    try {
        console.log('Fetching routine with ID:', routineId);
        const res = await fetch(`/api/routine/${routineId}`); //Fetch the selected routine
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        const exerciseList = document.getElementById('exercise-list');
        //Get the names of the exercises already listed & store them in an array 
        const existingExercises = Array.from(exerciseList.querySelectorAll('.exercise-name')).map(el => el.textContent);
        //Get the names of the new exercises to be added & store them in an array 
        const newExercises = data.exercises.filter(ex => !existingExercises.includes(ex));
        newExercises.forEach(exercise => {
            // Add to workout data tracking
            workoutData[exercise] = [];

            // Map this exercise to its routine
            exerciseToRoutineMap[exercise] = {
                routineName: data.routineName,
                routineId: data._id
            };

            const div = document.createElement('div');
            div.className = 'exercise';
            //Assign each exercise to trigger startExercise when clicked and pass the current exercise
            div.onclick = () => startExercise(exercise);
            div.innerHTML = `
          <div class="icon">🏋️‍♂️</div>
          <div class="exercise-name">${exercise}</div>
          <div class="arrow">›</div>
        `;
            exerciseList.insertBefore(div, document.querySelector('.finish-btn')); //Add the new exercise to the end of the list
        });

        // Save new exercises to session to ve logged
        if (newExercises.length > 0) {
            await fetch(`/api/add-exercises/${mainRoutineId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exercises: newExercises })
            });
        }

        closeModal();
    } catch (err) {
        console.error('Failed to add exercises:', err);
        alert('Error adding exercises. Please try again.');
    }
}
//Function to close the "Link Routine" modal
function closeModal() {
    document.getElementById('routineModal').style.display = 'none'; //Hide modal when function is called
}

//Start Exercise: Bring user to the log form for the given exercise
function startExercise(name) {
    currentExercise = name;

    // Replace the main title with the exercise name
    const titleContainer = document.getElementById('title-container');
    // Store the original HTML to restore it later
    if (!titleContainer.getAttribute('data-original-html')) {
        titleContainer.setAttribute('data-original-html', titleContainer.innerHTML);
    }
    // Set the exercise name without the link button
    titleContainer.innerHTML = name;

    document.getElementById('exercise-title').style.display = 'none';

    // Hide exercise list and show detail view
    document.getElementById('exercise-list').style.display = 'none';
    document.getElementById('exercise-detail').style.display = 'block';

    // Refresh the sets display based on saved data for this exercise
    refreshSetsDisplay();
}
//Function to display the sets for each exercise
function refreshSetsDisplay() {
    const setsContainer = document.getElementById('sets-container');
    setsContainer.innerHTML = '';

    // Get the saved sets for this exercise or initialize with one empty set
    const sets = workoutData[currentExercise];
    const isCardio = exercises.find(ex => ex.name === currentExercise)?.category === 'Cardio';

    if (sets && sets.length > 0) {
        // Display all saved sets
        sets.forEach((set, index) => {
            if (isCardio) {
                addSetToDisplay(index + 1, set.duration, set.distance);
            } else {
                addSetToDisplay(index + 1, set.reps, set.weight);
            }
        });
    } else {
        // Add a single empty set if none exist
        addSetToDisplay(1, '', '');
    }
}

//Function to display a new set on the page
function addSetToDisplay(setNumber, value1 = '0', value2 = '0') {
    const setsContainer = document.getElementById('sets-container');
    const exercise = exercises.find(ex => ex.name === currentExercise);
    const isCardio = exercise?.category === 'Cardio';
    const newSet = document.createElement('div');
    newSet.className = 'set-entry';

    if (isCardio) {
        newSet.innerHTML = `
          <div>Set ${setNumber}</div>
          <div><input type="number" class="duration-input" placeholder="0" min="0" value="${value1}"> min</div>
          <div><input type="number" class="distance-input" placeholder="0" min="0" step="0.1" value="${value2}"> km</div>
        `;
    } else {
        newSet.innerHTML = `
          <div>Set ${setNumber}</div>
          <div><input type="number" class="rep-input" value="${value1}" placeholder="0" min="0" step="1"> reps</div>
          <div><input type="number" class="weight-input" value="${value2}" placeholder="0" min="0" step="1"> lbs</div>
        `;
    }

    setsContainer.appendChild(newSet);

    // Add event listeners to new inputs to save data whenever it has been altered
    const inputs = newSet.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const value = parseFloat(input.value);
            //Invalid input handling for rep input
            if (input.classList.contains('rep-input')) {
                if (!Number.isInteger(value)) {
                    input.value = Math.floor(value); //Restrict float inputs
                }
                if (value < 0) {                    //Restrict negative inputs
                    input.value = 0;
                }
                if (value > 50) {                  //Restrict inputs >50
                    input.value = 50;
                }
            }
            //Invalid input handling for weight input
            else if (input.classList.contains('weight-input')) {
                if (value < 0) {                   //Only restrict negative inputs
                    input.value = 0;
                }
            }
            //For Cardio inputs
            else if (input.classList.contains('duration-input')) {
                if (value < 0) {
                    input.value = 0; // Restrict negative inputs
                }
                if (value > 300) {
                    input.value = 300; // Restrict to max 5 hours
                }
            } else if (input.classList.contains('distance-input')) {
                if (value < 0) {
                    input.value = 0; // Restrict negative inputs
                }
                if (value > 100) {
                    input.value = 100; //Restrict to max 100km 
                }
            }
            saveCurrentExerciseData();
            calculateXP(workoutData);
        });
        input.addEventListener('input', () => { saveCurrentExerciseData(); });
    });
}
//Function to calculate the XP gained throughout the session
function calculateXP(workoutData) {
    let totalXP = 0;
    for (const exercise in workoutData) {
        const sets = workoutData[exercise];
        const isCardio = exercises.find(ex => ex.name === exercise)?.category === 'Cardio';
        for (const set of sets) {
            if (isCardio) {
                const duration = parseFloat(set.duration);
                if (!isNaN(duration)) {
                    totalXP += duration * 15; // 15 XP per minute for cardio
                }
            } else {
                const reps = parseInt(set.reps);
                if (!isNaN(reps)) {
                    totalXP += reps * 10; // 10 XP per rep for strength
                }
            }
        }
    }
    console.log("XP gained: ", totalXP);
    displayXP(totalXP);
    return totalXP;
}
function displayXP(xpGained) {
    document.getElementById('xpGained').textContent = xpGained
}

//Function to add a new set in the exercise log
function addSet() {
    if (
        !workoutData[currentExercise] ||
        workoutData[currentExercise].length === 0
    ) {
        console.log("I am NOT allowed to add a set");
        showError("Please fill the current set.")
        return;
    }

    const existingSets = document.getElementById('sets-container').querySelectorAll('.set-entry');
    const setNumber = existingSets.length + 1;

    const lastSet = workoutData[currentExercise][workoutData[currentExercise].length - 1];
    const lastReps = lastSet.reps;
    const lastCardioSet = lastSet.duration
    console.log("last Cardio set duration:", lastCardioSet)
    console.log("Last set reps:", lastReps);

    // Check if last set has reps >= 1
    if (lastReps >= 1 || lastCardioSet > 0) {
        console.log("I am allowed to add a set");
        addSetToDisplay(setNumber);

        // Add new empty set to workoutData
        workoutData[currentExercise].push({ reps: '', weight: '' });
        console.log("I've added a set");
    } else {
        showError("Please fill the current set");
        return;
    }
}

//Function to save the reps/weight data inputted by the user 
function saveCurrentExerciseData() {
    const setsContainer = document.getElementById('sets-container');
    const setEntries = setsContainer.querySelectorAll('.set-entry');
    const exercise = exercises.find(ex => ex.name === currentExercise);
    const isCardio = exercise && exercise.category === 'Cardio';
    // Clear any existing data from an earlier save
    workoutData[currentExercise] = [];

    // Save data from each set
    setEntries.forEach(setEntry => { //For each set...

        if (isCardio) {
            // Handle cardio exercise inputs
            const durationInput = setEntry.querySelector('.duration-input');
            const distanceInput = setEntry.querySelector('.distance-input');

            const duration = durationInput && durationInput.value.trim() ? parseFloat(durationInput.value) : '';
            const distance = distanceInput && distanceInput.value.trim() ? parseFloat(distanceInput.value) : '';

            workoutData[currentExercise].push({ duration, distance });
        } else {
            const repInput = setEntry.querySelector('.rep-input'); //Grab the inputted reps 
            const weightInput = setEntry.querySelector('.weight-input'); //Grab the inputted weight

            const reps = repInput.value.trim() ? parseInt(repInput.value) : ''; //If the input is empty, set as an empty string
            const weight = weightInput.value.trim() ? parseFloat(weightInput.value) : ''; //If the input is empty, set as an empty string

            workoutData[currentExercise].push({ reps, weight }); //Add the data for the current exercise to workoutData
        }
    });
    //Log each time anything is save - useful for keeping track of what's being logged & when!
    console.log('Saved data for', currentExercise, workoutData[currentExercise]);
}
//Function to return the user from their current exercise back to the list of exercises in the session
function finishExercise() {
    // Save current exercise data before switching
    saveCurrentExerciseData();

    // Restore the original title with routine name and link button
    const titleContainer = document.getElementById('title-container');
    const originalHtml = titleContainer.getAttribute('data-original-html');
    if (originalHtml) {
        titleContainer.innerHTML = originalHtml;
        // Re-bind the event listener to the link button since it gets removed when logging an exercise
        const linkButton = document.getElementById('link-routine-btn');
        if (linkButton) {
            linkButton.addEventListener('click', loadRoutines);
        }
    }

    // Make sure the exercise title is visible for next time
    document.getElementById('exercise-title').style.display = 'block';

    // Hide detail view and show exercise list
    document.getElementById('exercise-detail').style.display = 'none';
    document.getElementById('exercise-list').style.display = 'block';

    // Clear current exercise
    currentExercise = '';
}
let isPaused = false;
// Event listener for "Link routine" button
document.getElementById('link-routine-btn').addEventListener('click', loadRoutines); //Call loadRoutines function on click
//Event listener for "Finish workout" Button
//This event listener manages the saving & presentation of the user's logged data 
document.getElementById('finish-workout-btn').addEventListener('click', async () => {
    if (currentExercise) {
        saveCurrentExerciseData();
    }
    const routinesData = {};
    Object.keys(workoutData).forEach(exercise => {
        const isCardio = exercises.find(ex => ex.name === exercise)?.category === 'Cardio';
        const validSets = workoutData[exercise].filter(set => {
            if (isCardio) {
                return (set.duration !== '' && set.duration !== null) ||
                    (set.distance !== '' && set.distance !== null);
            } else {
                return (set.reps !== '' && set.reps !== null) ||
                    (set.weight !== '' && set.weight !== null);
            }
        });

        if (validSets.length > 0) {
            const routineInfo = exerciseToRoutineMap[exercise];
            const routineName = routineInfo.routineName;
            const routineId = routineInfo.routineId;
            if (!routinesData[routineName]) {
                routinesData[routineName] = {
                    routineId: routineId,
                    exercises: {}
                };
            }
            routinesData[routineName].exercises[exercise] = validSets;
        }
    });

    if (Object.keys(routinesData).length === 0) {
        showError('No exercise data to save. Please log at least one set.');
        return;
    }
    isPaused = true;
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const workoutDuration = `${minutes}:${seconds}`;
    console.log('currentUserId:', currentUserId);
    const payload = {
        userId: currentUserId,
        date: new Date().toISOString(),
        routines: routinesData,
        duration: workoutDuration,
        xpGained: calculateXP(workoutData)
    };
    console.log('Workout complete! Full payload to save:', JSON.stringify(payload, null, 2));
    try {
        const response = await fetch(`/api/log-workout/${mainRoutineId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to save workout data');
        const result = await response.json();
        alert('Workout saved successfully!');
        window.location.href = '/history';
    } catch (err) {
        console.error('Error saving workout:', err);
        alert('Failed to save workout. Please try again.');
    }
});

//Timer functions

let totalSeconds = 0;


// Function to update the time
function updateTimer() {
    if (!isPaused) {
        totalSeconds++; // Increase the timer by 1 second
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        // Format minutes and seconds to always show 2 digits
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        document.querySelector('.header-item p').textContent = `${minutes}:${seconds}`; // Update the time displayed on the page
    }
}
setInterval(updateTimer, 1000); // Call updateTimer every 1000ms (1 second)

//For the Pause button
document.getElementById("pauseBtn").addEventListener("click", () => {
    isPaused = !isPaused;

    // Toggle emoji
    const btn = document.getElementById("pauseBtn");
    btn.textContent = isPaused ? "▶️" : "⏸️";

    console.log("Paused:", isPaused);
});

//Rest Timer functions
let defaultRestTime = 60
let restTime = defaultRestTime;
let isResting = false;
let restInterval = null;

// Function to update the rest timer every second
function updateRestTimer() {
    if (restTime > 0) {
        restTime--;

        const minutes = Math.floor(restTime / 60);
        const seconds = restTime % 60;

        const displayTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        document.getElementById('restTimer').textContent = displayTime;
    } else {
        // Auto-stop when it reaches 0
        clearInterval(restInterval);
        restInterval = null;
        isResting = false;
        restTime = defaultRestTime;
        const minutes = Math.floor(restTime / 60);
        const seconds = restTime % 60;
        const displayTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        document.getElementById('restTimer').textContent = displayTime;
        document.getElementById('rest-toggle-Btn').textContent = "▶️";
    }
}

// Event listener for rest play/pause toggle button
document.getElementById("rest-toggle-Btn").addEventListener("click", () => {
    isResting = !isResting;

    const btn = document.getElementById("rest-toggle-Btn");
    btn.textContent = isResting ? "⏸️" : "▶️";

    if (isResting) {
        // Start the countdown
        if (!restInterval) {
            restInterval = setInterval(updateRestTimer, 1000);
        }
    } else {
        // Pause the countdown
        clearInterval(restInterval);
        restInterval = null;
    }

    console.log("User is resting:", isResting);
});

// // Event listener for rest reset button
document.getElementById("rest-restart-Btn").addEventListener("click", () => {
    isResting = false;
    console.log("User is resting:", isResting)
    const btn = document.getElementById("rest-toggle-Btn");
    btn.textContent = isResting ? "⏸️" : "▶️";
    restTime = defaultRestTime
    const minutes = Math.floor(restTime / 60);
    const seconds = restTime % 60;
    // Pause the countdown
    clearInterval(restInterval);
    restInterval = null;
    const displayTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    document.getElementById('restTimer').textContent = displayTime;
});

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}